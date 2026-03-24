import type { CompareConfigMode } from './policyConfig.js';
import {
  buildAllCommodityAuditResults,
} from './stowAudit.js';

interface CliOptions {
  permitType?: string;
  compareConfig: CompareConfigMode;
}

async function main(): Promise<void> {
  const options = parseCliArgs(process.argv.slice(2));
  const results = await buildAllCommodityAuditResults({
    compareConfig: options.compareConfig,
    ...(options.permitType ? { permitType: options.permitType } : {}),
  });

  const missingPowerUnits = results.flatMap((result) =>
    result.missingPowerUnits.map((entry) =>
      `- ${entry.commodityName} - ${entry.powerUnitName} (${formatCommodityRows(entry.rows)})`,
    ),
  );
  const missingDirectTrailers = results.flatMap((result) =>
    result.missingDirectTrailers.map((entry) => {
      const reasonTags = entry.reasonTags.length > 0
        ? ` [${entry.reasonTags.join(', ')}]`
        : '';
      return `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerLabel} (${formatCommodityRows(entry.rows)})${reasonTags}`;
    }),
  );
  const missingBoosters = results.flatMap((result) =>
    result.missingBoosters.map((entry) => {
      const rowSuffix = entry.rows.length > 0
        ? ` (${formatCommodityRows(entry.rows)})`
        : '';
      const reasonTags = entry.reasonTags.length > 0
        ? ` [${entry.reasonTags.join(', ')}]`
        : '';
      return `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerName}${rowSuffix}${reasonTags}`;
    }),
  );
  const directBoostersWithoutPlacement = results.flatMap((result) =>
    result.directBoostersWithoutSafePlacement.map((entry) => {
      const reasonTags = entry.reasonTags.length > 0
        ? ` [${entry.reasonTags.join(', ')}]`
        : '';
      return `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerName} (${formatCommodityRows(entry.rows)})${reasonTags}`;
    }),
  );
  const ambiguousTrailerWeightBoosters = results.flatMap((result) =>
    result.ambiguousTrailerWeightBoosters.map((entry) => formatTrailerWeightLine(entry)),
  );
  const contradictoryTrailerWeightBoosters = results.flatMap((result) =>
    result.contradictoryTrailerWeightBoosters.map((entry) => formatTrailerWeightLine(entry)),
  );
  const unmatchedTrailerWeightBoosters = results.flatMap((result) =>
    result.unmatchedTrailerWeightBoosters.map((entry) => formatTrailerWeightLine(entry)),
  );
  const deferredPowerUnits = results.flatMap((result) =>
    result.deferredPowerUnits.map((entry) =>
      `- ${entry.commodityName} - ${entry.powerUnitName} (${formatCommodityRows(entry.rows)}) [lcv-special-authorization-required]`,
    ),
  );
  const unresolvedRows = results.flatMap((result) =>
    result.ignoredRows.map((entry) =>
      `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerLabel} (Commodity row: ${entry.rowNumber}) [${entry.reasonTags.join(', ')}]`,
    ),
  );

  console.log(
    [
      `Permit Type: ${results[0]?.permitType ?? options.permitType ?? 'STOW'}`,
      `Compare Config Mode: ${options.compareConfig}`,
      `Compared Config: ${results[0]?.configPath ?? '(none)'}`,
      `Commodities Audited: ${results.length}`,
      '',
      'Missing Direct Power Units (Source: computed diff = XLS direct rows - policyEngine.getPermittablePowerUnitTypes)',
      ...formatSection(missingPowerUnits),
      '',
      'Missing Direct Trailers (Source: computed diff = XLS direct rows - policyEngine.getNextPermittableVehicles after [powerUnit])',
      ...formatSection(missingDirectTrailers),
      '',
      'Missing Boosters (Source: computed diff = XLS direct booster-capable rows - policyEngine.getNextPermittableVehicles after [powerUnit, trailer])',
      ...formatSection(missingBoosters),
      '',
      'Direct Booster Rows Without Safe Placement Detail (Source: XLS direct booster-capable rows with no safe trailer-weight correlation)',
      ...formatSection(directBoostersWithoutPlacement),
      '',
      'Ambiguous Trailer Weight Booster Rows (Source: XLS Trailer - Weight Dim. Sets rows with mixed direct Commodity booster flags)',
      ...formatSection(ambiguousTrailerWeightBoosters),
      '',
      'Contradictory Trailer Weight Booster Rows (Source: XLS Trailer - Weight Dim. Sets rows whose matching direct Commodity rows all say Can Add Booster = N)',
      ...formatSection(contradictoryTrailerWeightBoosters),
      '',
      'Unmatched Trailer Weight Booster Rows (Source: XLS Trailer - Weight Dim. Sets rows with no matching direct Commodity trailer rows)',
      ...formatSection(unmatchedTrailerWeightBoosters),
      '',
      'Unresolved XLS Rows Not Yet Modeled By The Updater (Source: XLS Commodity to Vehicle to Trailer)',
      ...formatSection(unresolvedRows),
      '',
      'Deferred (Source: policy constraints or intentionally excluded cases)',
      ...formatSection(deferredPowerUnits),
    ].join('\n'),
  );
}

function formatSection(entries: string[]): string[] {
  return entries.length > 0 ? entries : ['- None'];
}

function formatTrailerWeightLine(entry: {
  commodityName: string;
  trailerName: string;
  rows: number[];
  reasonTags: string[];
  directRows: string[];
}): string {
  const reasonTags = entry.reasonTags.length > 0
    ? ` [${entry.reasonTags.join(', ')}]`
    : '';
  const directRows = entry.directRows.length > 0
    ? ` {${formatCommodityDirectRows(entry.directRows)}}`
    : '';
  return `- ${entry.commodityName} - ${entry.trailerName} (${formatWeightDimRows(entry.rows)})${reasonTags}${directRows}`;
}

function formatCommodityRows(rows: number[]): string {
  return `Commodity rows: ${rows.join(', ')}`;
}

function formatWeightDimRows(rows: number[]): string {
  return `Weight Dim. rows: ${rows.join(', ')}`;
}

function formatCommodityDirectRows(rows: string[]): string {
  return `Commodity rows: ${rows.join(', ')}`;
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
