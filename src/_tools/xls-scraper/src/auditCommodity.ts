import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  parseAuditEntries,
  type AuditEntry,
} from './commodityWorksheet.js';
import { readWorksheetRowEntries } from './readWorksheet.js';
import { COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET } from './sheets.js';
import {
  type CompareConfigMode,
  readPolicyConfigSync,
  resolvePolicyConfigPath,
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

interface CliOptions {
  commodityType?: string;
  permitType?: string;
  compareConfig: CompareConfigMode;
}

interface ExpectedPowerUnitGroup {
  commodityName: string;
  powerUnitName: string;
  powerUnitId: string | null;
  rows: number[];
}

interface ExpectedTrailerGroup {
  commodityName: string;
  powerUnitName: string;
  powerUnitId: string | null;
  trailerLabel: string;
  trailerId: string | null;
  rows: number[];
  reasonTags: string[];
}

interface CurrentTrailerGroup {
  powerUnitId: string;
  powerUnitName: string;
  trailers: Map<string, string>;
}

// This audit intentionally keeps the XLS-derived expectation set separate from
// the policy-engine current state so the report can show a real diff.
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
  const configPath = resolvePolicyConfigPath(options.compareConfig);
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

  const expectedPowerUnits = buildExpectedPowerUnits(auditEntries);
  const expectedPowerUnitIdSet = new Set(
    expectedPowerUnits
      .map((entry) => entry.powerUnitId)
      .filter((entry): entry is string => Boolean(entry)),
  );
  const currentTrailersByPowerUnit = buildCurrentTrailersByPowerUnit(
    policy,
    permitType,
    commodityId,
    currentPowerUnits,
  );
  const expectedTrailers = buildExpectedTrailers(auditEntries);
  const comparablePowerUnitIds = new Set(
    Array.from(expectedPowerUnitIdSet).filter((powerUnitId) =>
      currentPowerUnitIds.has(powerUnitId),
    ),
  );
  const missingPowerUnits = expectedPowerUnits
    .filter((entry) => entry.powerUnitId && !currentPowerUnitIds.has(entry.powerUnitId))
    .sort((left, right) => left.rows[0]! - right.rows[0]!);
  const extraPowerUnits = Array.from(currentPowerUnits.entries())
    .filter(([powerUnitId]) => !expectedPowerUnitIdSet.has(powerUnitId))
    .sort((left, right) => left[1].localeCompare(right[1]));
  const missingTrailers = buildMissingTrailers(
    expectedTrailers,
    currentTrailersByPowerUnit,
    comparablePowerUnitIds,
  );
  const extraTrailers = buildExtraTrailers(
    expectedTrailers,
    currentTrailersByPowerUnit,
    comparablePowerUnitIds,
  );
  const ignoredRows = auditEntries
    .filter((entry) => entry.reasonTags.length > 0)
    .sort((left, right) => left.rowNumber - right.rowNumber);

  console.log([
    `Commodity Type: ${auditEntries[0]?.commodityName ?? commodityType}`,
    `Permit Type: ${permitType}`,
    `Compare Config Mode: ${options.compareConfig}`,
    `Compared Config: ${configPath}`,
    `Rows Considered From XLS: ${auditEntries.length}`,
    '',
    'Expected Vehicle Sub-types (Source: XLS)',
    ...formatExpectedPowerUnits(expectedPowerUnits),
    '',
    'Current Permittable Vehicle Sub-types (Source: policyEngine.getPermittablePowerUnitTypes)',
    ...formatCurrentPowerUnits(currentPowerUnits),
    '',
    'Missing Vehicle Sub-types (Source: computed diff = XLS - policyEngine)',
    ...formatMissingPowerUnits(missingPowerUnits),
    '',
    'Extra Vehicle Sub-types In Policy (Source: computed diff = policyEngine - XLS)',
    ...formatExtraPowerUnits(extraPowerUnits),
    '',
    'Expected Trailers (Source: XLS)',
    ...formatExpectedTrailers(expectedTrailers),
    '',
    'Current Permittable Trailers (Source: policyEngine.getNextPermittableVehicles)',
    ...formatCurrentTrailers(currentTrailersByPowerUnit),
    '',
    'Missing Trailers (Source: computed diff = XLS - policyEngine)',
    ...formatMissingTrailers(missingTrailers),
    '',
    'Extra Trailers In Policy (Source: computed diff = policyEngine - XLS)',
    ...formatExtraTrailers(extraTrailers),
    '',
    'Ignored/Unsupported XLS Rows (Source: XLS)',
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

function buildExpectedPowerUnits(entries: AuditEntry[]): ExpectedPowerUnitGroup[] {
  const grouped = new Map<string, ExpectedPowerUnitGroup>();

  for (const entry of entries) {
    const key = `${entry.commodityName}:${entry.powerUnitName}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.rows.push(entry.rowNumber);
      continue;
    }

    grouped.set(key, {
      commodityName: entry.commodityName,
      powerUnitName: entry.powerUnitName,
      powerUnitId: entry.powerUnitId,
      rows: [entry.rowNumber],
    });
  }

  return Array.from(grouped.values()).sort(
    (left, right) => left.rows[0]!.valueOf() - right.rows[0]!.valueOf(),
  );
}

function buildExpectedTrailers(entries: AuditEntry[]): ExpectedTrailerGroup[] {
  const grouped = new Map<string, ExpectedTrailerGroup>();

  for (const entry of entries) {
    if (!entry.powerUnitName) {
      continue;
    }

    const key = `${entry.commodityName}:${entry.powerUnitName}:${entry.trailerLabel}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.rows.push(entry.rowNumber);
      existing.reasonTags = mergeTags(existing.reasonTags, entry.reasonTags);
      continue;
    }

    grouped.set(key, {
      commodityName: entry.commodityName,
      powerUnitName: entry.powerUnitName,
      powerUnitId: entry.powerUnitId,
      trailerLabel: entry.trailerLabel,
      trailerId: entry.trailerId,
      rows: [entry.rowNumber],
      reasonTags: [...entry.reasonTags],
    });
  }

  return Array.from(grouped.values()).sort(
    (left, right) => left.rows[0]!.valueOf() - right.rows[0]!.valueOf(),
  );
}

function buildCurrentTrailersByPowerUnit(
  policy: PolicyLike,
  permitType: string,
  commodityId: string,
  currentPowerUnits: Map<string, string>,
): Map<string, CurrentTrailerGroup> {
  const trailersByPowerUnit = new Map<string, CurrentTrailerGroup>();

  for (const [powerUnitId, powerUnitName] of currentPowerUnits.entries()) {
    trailersByPowerUnit.set(powerUnitId, {
      powerUnitId,
      powerUnitName,
      trailers: policy.getNextPermittableVehicles(
        permitType,
        commodityId,
        [powerUnitId],
      ),
    });
  }

  return trailersByPowerUnit;
}

function buildMissingTrailers(
  expectedTrailers: ExpectedTrailerGroup[],
  currentTrailersByPowerUnit: Map<string, CurrentTrailerGroup>,
  comparablePowerUnitIds: Set<string>,
): ExpectedTrailerGroup[] {
  return expectedTrailers
    .filter((entry) => entry.powerUnitId && comparablePowerUnitIds.has(entry.powerUnitId))
    .filter((entry) => entry.trailerId)
    .filter((entry) => {
      const current = currentTrailersByPowerUnit.get(entry.powerUnitId as string);
      return !current?.trailers.has(entry.trailerId as string);
    })
    .sort((left, right) => left.rows[0]! - right.rows[0]!);
}

function buildExtraTrailers(
  expectedTrailers: ExpectedTrailerGroup[],
  currentTrailersByPowerUnit: Map<string, CurrentTrailerGroup>,
  comparablePowerUnitIds: Set<string>,
): Array<{
  commodityName: string;
  powerUnitName: string;
  trailerName: string;
}> {
  const expectedTrailerIdsByPowerUnit = new Map<string, Set<string>>();

  for (const entry of expectedTrailers) {
    if (!entry.powerUnitId || !entry.trailerId || !comparablePowerUnitIds.has(entry.powerUnitId)) {
      continue;
    }

    const existing = expectedTrailerIdsByPowerUnit.get(entry.powerUnitId) ?? new Set<string>();
    existing.add(entry.trailerId);
    expectedTrailerIdsByPowerUnit.set(entry.powerUnitId, existing);
  }

  const extras: Array<{
    commodityName: string;
    powerUnitName: string;
    trailerName: string;
  }> = [];

  for (const [powerUnitId, current] of currentTrailersByPowerUnit.entries()) {
    if (!comparablePowerUnitIds.has(powerUnitId)) {
      continue;
    }

    const expectedIds = expectedTrailerIdsByPowerUnit.get(powerUnitId) ?? new Set<string>();

    for (const [trailerId, trailerName] of current.trailers.entries()) {
      if (!expectedIds.has(trailerId)) {
        extras.push({
          commodityName: '',
          powerUnitName: current.powerUnitName,
          trailerName,
        });
      }
    }
  }

  return extras.sort((left, right) => {
    const powerUnitCompare = left.powerUnitName.localeCompare(right.powerUnitName);
    if (powerUnitCompare !== 0) {
      return powerUnitCompare;
    }

    return left.trailerName.localeCompare(right.trailerName);
  });
}

function mergeTags(existing: string[], next: string[]): string[] {
  return Array.from(new Set([...existing, ...next])).sort();
}

function formatExpectedPowerUnits(entries: ExpectedPowerUnitGroup[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map((entry) =>
    `- ${entry.commodityName} - ${entry.powerUnitName} (${entry.rows.join(', ')})`,
  );
}

function formatCurrentPowerUnits(currentPowerUnits: Map<string, string>): string[] {
  if (currentPowerUnits.size === 0) {
    return ['- None'];
  }

  return Array.from(currentPowerUnits.values())
    .sort()
    .map((powerUnitName) => `- ${powerUnitName}`);
}

function formatMissingPowerUnits(entries: ExpectedPowerUnitGroup[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map((entry) =>
    `- ${entry.commodityName} - ${entry.powerUnitName} (${entry.rows.join(', ')})`,
  );
}

function formatExtraPowerUnits(entries: Array<[string, string]>): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map(([, powerUnitName]) => `- ${powerUnitName}`);
}

function formatExpectedTrailers(entries: ExpectedTrailerGroup[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map((entry) => {
    const reasonTags = entry.reasonTags.length > 0
      ? ` [${entry.reasonTags.join(', ')}]`
      : '';
    return `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerLabel} (${entry.rows.join(', ')})${reasonTags}`;
  });
}

function formatCurrentTrailers(
  currentTrailersByPowerUnit: Map<string, CurrentTrailerGroup>,
): string[] {
  if (currentTrailersByPowerUnit.size === 0) {
    return ['- None'];
  }

  const lines: string[] = [];
  const groups = Array.from(currentTrailersByPowerUnit.values()).sort((left, right) =>
    left.powerUnitName.localeCompare(right.powerUnitName),
  );

  for (const group of groups) {
    const trailerNames = Array.from(group.trailers.values()).sort();
    if (trailerNames.length === 0) {
      lines.push(`- ${group.powerUnitName}: None`);
      continue;
    }

    for (const trailerName of trailerNames) {
      lines.push(`- ${group.powerUnitName} - ${trailerName}`);
    }
  }

  return lines;
}

function formatMissingTrailers(entries: ExpectedTrailerGroup[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map((entry) => {
    const reasonTags = entry.reasonTags.length > 0
      ? ` [${entry.reasonTags.join(', ')}]`
      : '';
    return `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerLabel} (${entry.rows.join(', ')})${reasonTags}`;
  });
}

function formatExtraTrailers(
  entries: Array<{
    commodityName: string;
    powerUnitName: string;
    trailerName: string;
  }>,
): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map((entry) => `- ${entry.powerUnitName} - ${entry.trailerName}`);
}

function formatIgnoredRows(entries: AuditEntry[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map((entry) =>
    `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerLabel} (${entry.rowNumber}) [${entry.reasonTags.join(', ')}]`,
  );
}

function parseCliArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    compareConfig: 'generated',
  };

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

    if (rawKey === 'compare-config' || rawKey === 'compareConfig') {
      if (
        value === 'canonical' ||
        value === 'generated' ||
        value === 'prefer-generated'
      ) {
        options.compareConfig = value;
      } else {
        throw new Error(
          `Invalid compare config '${value}'. Use canonical, generated, or prefer-generated`,
        );
      }
    }
  }

  return options;
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
