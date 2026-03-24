import type { CompareConfigMode } from './policyConfig.js';
import {
  buildAllCommodityAuditResults,
  type CommodityAuditResult,
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
      `- ${entry.commodityName} - ${entry.powerUnitName} (${entry.rows.join(', ')})`,
    ),
  );
  const missingDirectTrailers = results.flatMap((result) =>
    result.missingDirectTrailers.map((entry) => {
      const reasonTags = entry.reasonTags.length > 0
        ? ` [${entry.reasonTags.join(', ')}]`
        : '';
      return `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerLabel} (${entry.rows.join(', ')})${reasonTags}`;
    }),
  );
  const missingBoosters = results.flatMap((result) =>
    result.missingBoosters.map((entry) => {
      const reasonTags = entry.reasonTags.length > 0
        ? ` [${entry.reasonTags.join(', ')}]`
        : '';
      return `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerName} (${entry.rows.join(', ')})${reasonTags}`;
    }),
  );
  const deferredPowerUnits = results.flatMap((result) =>
    result.deferredPowerUnits.map((entry) =>
      `- ${entry.commodityName} - ${entry.powerUnitName} (${entry.rows.join(', ')}) [lcv-special-authorization-required]`,
    ),
  );
  const unresolvedRows = results.flatMap((result) =>
    result.ignoredRows.map((entry) =>
      `- ${entry.commodityName} - ${entry.powerUnitName} - ${entry.trailerLabel} (${entry.rowNumber}) [${entry.reasonTags.join(', ')}]`,
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
      'Missing Boosters (Source: computed diff = XLS Trailer - Weight Dim. Sets - policyEngine.getNextPermittableVehicles after [powerUnit, trailer])',
      ...formatSection(missingBoosters),
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
