import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  NONE_ID,
  parseAuditEntries,
  type AuditEntry,
} from './commodityWorksheet.js';
import { readWorksheetRowEntries } from './readWorksheet.js';
import { COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET } from './sheets.js';
import {
  readPolicyConfigSync,
  resolveGeneratedPreferredConfigPath,
} from './policyConfig.js';
import { loadWorkbook } from './workbook.js';

interface PolicyLike {
  getPermittablePowerUnitTypes(
    permitTypeId: string,
    commodityId: string,
  ): Map<string, string>;
  getNextPermittableVehicles(
    permitTypeId: string,
    commodityId: string,
    currentConfiguration: string[],
  ): Map<string, string>;
}

async function main(): Promise<void> {
  const options = parseCliArgs(process.argv.slice(2));
  const commodityType = options.commodityType;
  const permitType = options.permitType ?? 'STOW';

  if (!commodityType) {
    throw new Error(
      'Missing commodity type. Use npm run audit:commodity -- --commodity-type=None',
    );
  }

  const workbook = await loadWorkbook();
  const rows = readWorksheetRowEntries(
    workbook,
    COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET,
  );
  const configPath = resolveGeneratedPreferredConfigPath();
  const config = readPolicyConfigSync(configPath);
  const auditEntries = parseAuditEntries(rows, config).filter(
    (entry) => entry.commodityName.toLowerCase() === commodityType.toLowerCase(),
  );

  if (auditEntries.length === 0) {
    throw new Error(`No XLS rows found for commodity type '${commodityType}'`);
  }

  const commodityId = auditEntries.find((entry) => entry.commodityId)?.commodityId;
  if (!commodityId) {
    throw new Error(`Unable to map commodity type '${commodityType}' to a config id`);
  }

  const policy = await loadPolicy(configPath);
  const currentPowerUnits = policy.getPermittablePowerUnitTypes(
    permitType,
    commodityId,
  );
  const currentPowerUnitIds = new Set(currentPowerUnits.keys());

  const missingPowerUnits = buildMissingPowerUnits(auditEntries, currentPowerUnitIds);
  const missingTrailers = buildMissingTrailers(
    auditEntries,
    permitType,
    commodityId,
    currentPowerUnitIds,
    policy,
  );
  const ignoredRows = auditEntries
    .filter((entry) => entry.reasonTags.some((tag) => tag.startsWith('missing-')))
    .sort((left, right) => left.rowNumber - right.rowNumber);

  console.log([
    `Commodity Type: ${auditEntries[0]?.commodityName ?? commodityType}`,
    `Permit Type: ${permitType}`,
    `Compared Config: ${configPath}`,
    `Rows Considered: ${auditEntries.length}`,
    '',
    'Expected Vehicle Sub-types From XLS',
    ...formatExpectedPowerUnits(auditEntries),
    '',
    'Current Permittable Vehicle Sub-types',
    ...formatCurrentPowerUnits(auditEntries, currentPowerUnitIds),
    '',
    'Missing Vehicle Sub-types',
    ...formatMissingPowerUnits(missingPowerUnits),
    '',
    'Missing Trailers',
    ...formatMissingTrailers(missingTrailers),
    '',
    'Ignored/Unsupported Rows',
    ...formatIgnoredRows(ignoredRows),
  ].join('\n'));
}

async function loadPolicy(configPath: string): Promise<PolicyLike> {
  const policyModuleUrl = pathToFileURL(
    path.resolve(process.cwd(), '..', '..', 'index.ts'),
  ).href;
  const importedModule = await import(policyModuleUrl);
  const policyModule = (importedModule.default ?? importedModule) as {
    Policy: new (definition: unknown) => PolicyLike;
  };
  const config = readPolicyConfigSync(configPath);
  return new policyModule.Policy(config);
}

function buildMissingPowerUnits(
  entries: AuditEntry[],
  currentPowerUnitIds: Set<string>,
): AuditEntry[] {
  const seen = new Set<string>();

  return entries
    .filter((entry) => entry.powerUnitId && !currentPowerUnitIds.has(entry.powerUnitId))
    .filter((entry) => {
      const key = `${entry.commodityId}:${entry.powerUnitId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((left, right) => left.rowNumber - right.rowNumber);
}

function buildMissingTrailers(
  entries: AuditEntry[],
  permitType: string,
  commodityId: string,
  currentPowerUnitIds: Set<string>,
  policy: PolicyLike,
): AuditEntry[] {
  const currentTrailerIds = new Map<string, Set<string>>();

  const getCurrentTrailerIds = (powerUnitId: string): Set<string> => {
    const cached = currentTrailerIds.get(powerUnitId);
    if (cached) {
      return cached;
    }

    const trailers = policy.getNextPermittableVehicles(
      permitType,
      commodityId,
      [powerUnitId],
    );
    const ids = new Set(trailers.keys());
    currentTrailerIds.set(powerUnitId, ids);
    return ids;
  };

  return entries
    .filter((entry) => entry.powerUnitId && currentPowerUnitIds.has(entry.powerUnitId))
    .filter((entry) => entry.trailerId && entry.trailerId !== NONE_ID)
    .filter((entry) => !getCurrentTrailerIds(entry.powerUnitId as string).has(entry.trailerId as string))
    .sort((left, right) => left.rowNumber - right.rowNumber);
}

function formatExpectedPowerUnits(entries: AuditEntry[]): string[] {
  const grouped = new Map<string, { label: string; rows: number[] }>();

  for (const entry of entries) {
    if (!entry.powerUnitName) {
      continue;
    }

    const key = `${entry.commodityName}:${entry.powerUnitName}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.rows.push(entry.rowNumber);
      continue;
    }

    grouped.set(key, {
      label: `${entry.commodityName} - ${entry.powerUnitName}`,
      rows: [entry.rowNumber],
    });
  }

  return Array.from(grouped.values())
    .map((group) => `- ${group.label} (${group.rows.join(', ')})`)
    .sort();
}

function formatCurrentPowerUnits(
  entries: AuditEntry[],
  currentPowerUnitIds: Set<string>,
): string[] {
  const names = new Map<string, string>();

  for (const entry of entries) {
    if (entry.powerUnitId && currentPowerUnitIds.has(entry.powerUnitId)) {
      names.set(entry.powerUnitId, `${entry.commodityName} - ${entry.powerUnitName}`);
    }
  }

  return Array.from(names.values())
    .sort()
    .map((value) => `- ${value}`);
}

function formatMissingPowerUnits(entries: AuditEntry[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map(
    (entry) =>
      `- ${entry.commodityName} - ${entry.powerUnitName} (${entry.rowNumber})`,
  );
}

function formatMissingTrailers(entries: AuditEntry[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map((entry) => {
    const reasonTags = entry.reasonTags.length > 0
      ? ` [${entry.reasonTags.join(', ')}]`
      : '';
    return `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerLabel} (${entry.rowNumber})${reasonTags}`;
  });
}

function formatIgnoredRows(entries: AuditEntry[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map((entry) => {
    return `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerLabel} (${entry.rowNumber}) [${entry.reasonTags.join(', ')}]`;
  });
}

function parseCliArgs(args: string[]): {
  commodityType?: string;
  permitType?: string;
} {
  const options: { commodityType?: string; permitType?: string } = {};

  for (const arg of args) {
    const normalized = arg.replace(/^-+/, '');
    const [rawKey, ...valueParts] = normalized.split('=');
    const value = valueParts.join('=').trim();

    if (!value) {
      continue;
    }

    if (rawKey === 'commodity-type' || rawKey === 'commodityType') {
      options.commodityType = value;
    }

    if (rawKey === 'permit-type' || rawKey === 'permitType') {
      options.permitType = value;
    }
  }

  return options;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exit(1);
});
