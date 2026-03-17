import { readFile, writeFile } from 'node:fs/promises';

import {
  NONE_ID,
  parseSupportedEntries,
  type SupportedEntry,
  type SkippedEntry,
} from './commodityWorksheet.js';
import {
  BACKEND_EXAMPLE_CONFIG_PATH,
  CANONICAL_CONFIG_PATH,
  GENERATED_CONFIG_PATH,
} from './configPaths.js';
import type {
  PolicyConfig,
  PowerUnitEntry,
  TrailerEntry,
} from './policyConfig.js';
import { readWorksheetRowEntries } from './readWorksheet.js';
import { COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET } from './sheets.js';
import { loadWorkbook } from './workbook.js';

async function main(): Promise<void> {
  await ensureExistingConfigFiles([
    CANONICAL_CONFIG_PATH,
    BACKEND_EXAMPLE_CONFIG_PATH,
  ]);

  const workbook = await loadWorkbook();
  const rows = readWorksheetRowEntries(
    workbook,
    COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET,
  );
  const existingCanonicalConfig = await readFile(CANONICAL_CONFIG_PATH, 'utf8');
  const config = JSON.parse(existingCanonicalConfig) as PolicyConfig;
  const parsed = parseSupportedEntries(rows, config);

  applySupportedEntries(config, parsed.supportedEntries);

  const serializedConfig = `${JSON.stringify(config, null, 2)}\n`;
  const differsFromCanonical = serializedConfig !== existingCanonicalConfig;

  await writeFile(GENERATED_CONFIG_PATH, serializedConfig, 'utf8');
  await writeFile(BACKEND_EXAMPLE_CONFIG_PATH, serializedConfig, 'utf8');

  console.log(
    JSON.stringify(
      {
        supportedRowCount: parsed.supportedEntries.length,
        affectedCommodityCount: new Set(
          parsed.supportedEntries.map((entry) => entry.commodityId),
        ).size,
        skippedRowsByReason: countSkippedEntries(parsed.skippedEntries),
        differsFromCanonical,
        writtenFiles: [GENERATED_CONFIG_PATH, BACKEND_EXAMPLE_CONFIG_PATH],
      },
      null,
      2,
    ),
  );
}

// Supported rows from the STOW worksheet are modeled as weight-permittable
// commodity/power-unit/trailer combinations in the generated config.
function applySupportedEntries(
  config: PolicyConfig,
  supportedEntries: SupportedEntry[],
): void {
  for (const supportedEntry of supportedEntries) {
    const commodity = config.commodities.find(
      (entry) => entry.id === supportedEntry.commodityId,
    );

    if (!commodity) {
      continue;
    }

    if (!commodity.powerUnits) {
      commodity.powerUnits = [];
    }

    let powerUnit = commodity.powerUnits.find(
      (entry) => entry.type === supportedEntry.powerUnitId,
    );
    if (!powerUnit) {
      powerUnit = createPowerUnitEntry(supportedEntry.powerUnitId);
      commodity.powerUnits.push(powerUnit);
    }

    let trailer = powerUnit.trailers.find(
      (entry) => entry.type === supportedEntry.trailerId,
    );
    if (!trailer) {
      trailer = createTrailerEntry(
        supportedEntry.trailerId,
        supportedEntry.booster,
      );
      powerUnit.trailers.push(trailer);
    }

    trailer.booster = supportedEntry.booster;
    trailer.weightPermittable = true;

    if (supportedEntry.trailerId === NONE_ID && trailer.jeep === undefined) {
      trailer.jeep = false;
    }
  }
}

function createPowerUnitEntry(type: string): PowerUnitEntry {
  return {
    type,
    trailers: [],
  };
}

function createTrailerEntry(type: string, booster: boolean): TrailerEntry {
  return {
    type,
    jeep: false,
    booster,
  };
}

function countSkippedEntries(skippedEntries: SkippedEntry[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const skippedEntry of skippedEntries) {
    counts[skippedEntry.reason] = (counts[skippedEntry.reason] ?? 0) + 1;
  }

  return counts;
}

async function ensureExistingConfigFiles(paths: string[]): Promise<void> {
  await Promise.all(
    paths.map(async (filePath) => {
      try {
        await readFile(filePath, 'utf8');
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
          throw new Error(`Required config file not found at ${filePath}`);
        }

        throw error;
      }
    }),
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exit(1);
});
