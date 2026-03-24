import {
  buildCommodityAuditResult,
  type CommodityAuditResult,
  type CurrentBoosterGroup,
  type CurrentTrailerGroup,
  type ExpectedBoosterGroup,
  type ExpectedPowerUnitGroup,
  type ExpectedTrailerGroup,
  type ExtraTrailerGroup,
  type IgnoredAuditEntry,
} from './stowAudit.js';
import type { CompareConfigMode } from './policyConfig.js';

interface CliOptions {
  commodityType?: string;
  permitType?: string;
  compareConfig: CompareConfigMode;
}

async function main(): Promise<void> {
  const options = parseCliArgs(process.argv.slice(2));
  const commodityType = options.commodityType;

  if (!commodityType) {
    throw new Error(
      'Missing commodity type. Use npm run audit:commodity -- --commodity-type=None',
    );
  }

  const result = await buildCommodityAuditResult({
    commodityType,
    compareConfig: options.compareConfig,
    ...(options.permitType ? { permitType: options.permitType } : {}),
  });

  console.log(
    [
      `Commodity Type: ${result.commodityName}`,
      `Permit Type: ${result.permitType}`,
      `Compare Config Mode: ${result.compareConfig}`,
      `Compared Config: ${result.configPath}`,
      `Rows Considered From XLS: ${result.rowsConsidered}`,
      '',
      'Expected Vehicle Sub-types (Source: XLS Commodity to Vehicle to Trailer)',
      ...formatExpectedPowerUnits(result.expectedPowerUnits),
      '',
      'Current Permittable Vehicle Sub-types (Source: policyEngine.getPermittablePowerUnitTypes)',
      ...formatCurrentPowerUnits(result.currentPowerUnits),
      '',
      'Missing Vehicle Sub-types (Source: computed diff = XLS direct rows - policyEngine)',
      ...formatExpectedPowerUnits(result.missingPowerUnits),
      '',
      'Deferred Vehicle Sub-types (Source: XLS direct rows blocked by policy constraints)',
      ...formatExpectedPowerUnits(result.deferredPowerUnits),
      '',
      'Extra Vehicle Sub-types In Policy (Source: computed diff = policyEngine - XLS direct rows)',
      ...formatExtraPowerUnits(result.extraPowerUnits),
      '',
      'Expected Direct Trailers (Source: XLS Commodity to Vehicle to Trailer)',
      ...formatExpectedTrailers(result.expectedDirectTrailers),
      '',
      'Current Permittable Direct Trailers (Source: policyEngine.getNextPermittableVehicles after [powerUnit])',
      ...formatCurrentTrailers(result.currentDirectTrailers),
      '',
      'Missing Direct Trailers (Source: computed diff = XLS direct rows - policyEngine after [powerUnit])',
      ...formatExpectedTrailers(result.missingDirectTrailers),
      '',
      'Extra Direct Trailers In Policy (Source: computed diff = policyEngine after [powerUnit] - XLS direct rows)',
      ...formatExtraTrailers(result.extraDirectTrailers),
      '',
      'Expected Boosters (Source: XLS Trailer - Weight Dim. Sets)',
      ...formatExpectedBoosters(result.expectedBoosters),
      '',
      'Current Permittable Boosters (Source: policyEngine.getNextPermittableVehicles after [powerUnit, trailer])',
      ...formatCurrentBoosters(result.currentBoosters),
      '',
      'Missing Boosters (Source: computed diff = XLS trailer weight rows - policyEngine after [powerUnit, trailer])',
      ...formatExpectedBoosters(result.missingBoosters),
      '',
      'Extra Boosters In Policy (Source: computed diff = policyEngine after [powerUnit, trailer] - XLS trailer weight rows)',
      ...formatExpectedBoosters(result.extraBoosters),
      '',
      'Unresolved XLS Rows Not Yet Modeled By The Updater (Source: XLS Commodity to Vehicle to Trailer)',
      ...formatIgnoredRows(result.ignoredRows),
    ].join('\n'),
  );
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

function formatExtraTrailers(entries: ExtraTrailerGroup[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map((entry) => `- ${entry.powerUnitName} - ${entry.trailerName}`);
}

function formatExpectedBoosters(entries: ExpectedBoosterGroup[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  return entries.map((entry) => {
    const rowParts: string[] = [];
    if (entry.rows.length > 0) {
      rowParts.push(`trailer weight rows: ${entry.rows.join(', ')}`);
    }

    if (entry.sourceBoosterRows.length > 0) {
      rowParts.push(`commodity booster rows: ${entry.sourceBoosterRows.join(', ')}`);
    }

    const rowSuffix = rowParts.length > 0 ? ` (${rowParts.join('; ')})` : '';
    const reasonTags = entry.reasonTags.length > 0
      ? ` [${entry.reasonTags.join(', ')}]`
      : '';
    return `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerName}${rowSuffix}${reasonTags}`;
  });
}

function formatCurrentBoosters(entries: CurrentBoosterGroup[]): string[] {
  if (entries.length === 0) {
    return ['- None'];
  }

  const lines = entries
    .filter((entry) => entry.nextVehicles.has('BOOSTER'))
    .sort((left, right) => {
      const powerUnitCompare = left.powerUnitName.localeCompare(right.powerUnitName);
      if (powerUnitCompare !== 0) {
        return powerUnitCompare;
      }

      return left.trailerName.localeCompare(right.trailerName);
    })
    .map((entry) => `- ${entry.powerUnitName} - ${entry.trailerName} - Boosters`);

  return lines.length > 0 ? lines : ['- None'];
}

function formatIgnoredRows(entries: IgnoredAuditEntry[]): string[] {
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
