import { readFile, writeFile } from 'node:fs/promises';

import { readWorksheetRows, type ScrapedRow } from './readWorksheet.js';
import { COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET } from './sheets.js';
import { loadWorkbook } from './workbook.js';
import {
  CANONICAL_CONFIG_PATH,
  GENERATED_CONFIG_PATH,
} from './configPaths.js';

const NONE_ID = 'XXXXXXX';

const COMMODITY_ID_OVERRIDES: Record<string, string> = {
  'Scrapers on Dollies': 'SCRAPER',
  'Tow Trucks and Disabled Vehicles': 'TOWDISB',
};

const TRAILER_ID_OVERRIDES: Record<string, string> = {
  'Platform Trailer': 'PLATFRM',
  'Semi-Trailers - Widespread Tandem': 'STWDTAN',
};

interface NamedDefinition {
  id: string;
  name: string;
  category?: string;
}

interface TrailerEntry {
  type: string;
  booster?: boolean;
  jeep?: boolean;
  weightPermittable?: boolean;
  [key: string]: unknown;
}

interface PowerUnitEntry {
  type: string;
  trailers: TrailerEntry[];
}

interface CommodityEntry {
  id: string;
  name: string;
  powerUnits?: PowerUnitEntry[];
}

interface PolicyConfig {
  vehicleTypes: {
    powerUnitTypes: NamedDefinition[];
    trailerTypes: NamedDefinition[];
  };
  commodities: CommodityEntry[];
}

interface SupportedEntry {
  commodityId: string;
  powerUnitId: string;
  trailerId: string;
  booster: boolean;
}

interface SkippedEntry {
  reason: string;
  row: ScrapedRow;
}

async function main(): Promise<void> {
  const workbook = await loadWorkbook();
  const rows = readWorksheetRows(workbook, COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET);
  const existingCanonicalConfig = await readFile(CANONICAL_CONFIG_PATH, 'utf8');
  const config = JSON.parse(existingCanonicalConfig) as PolicyConfig;
  const parsed = parseSupportedEntries(rows, config);

  // pass config as reference, modify it.
  applySupportedEntries(config, parsed.supportedEntries);

  const serializedConfig = `${JSON.stringify(config, null, 2)}\n`;
  const differsFromCanonical = serializedConfig !== existingCanonicalConfig;

  await writeFile(GENERATED_CONFIG_PATH, serializedConfig, 'utf8');

  console.log(
    JSON.stringify(
      {
        supportedRowCount: parsed.supportedEntries.length,
        affectedCommodityCount: new Set(
          parsed.supportedEntries.map((entry) => entry.commodityId),
        ).size,
        skippedRowsByReason: countSkippedEntries(parsed.skippedEntries),
        differsFromCanonical,
        writtenFiles: [GENERATED_CONFIG_PATH],
      },
      null,
      2,
    ),
  );
}

function parseSupportedEntries(
  rows: ScrapedRow[],
  config: PolicyConfig,
): {
  supportedEntries: SupportedEntry[];
  skippedEntries: SkippedEntry[];
} {
  const commodityNameToId = new Map(
    config.commodities.map((commodity) => [commodity.name, commodity.id]),
  );
  const powerUnitNameToId = new Map(
    config.vehicleTypes.powerUnitTypes.map((powerUnit) => [powerUnit.name, powerUnit.id]),
  );
  const trailerNameToId = new Map(
    config.vehicleTypes.trailerTypes.map((trailer) => [trailer.name, trailer.id]),
  );

  const supportedEntries: SupportedEntry[] = [];
  const skippedEntries: SkippedEntry[] = [];

  for (const row of rows) {
    const parsedRow = parseRow(
      row,
      commodityNameToId,
      powerUnitNameToId,
      trailerNameToId,
    );

    if ('reason' in parsedRow) {
      skippedEntries.push(parsedRow);
      continue;
    }

    supportedEntries.push(parsedRow);
  }

  return { supportedEntries, skippedEntries };
}

function parseRow(
  row: ScrapedRow,
  commodityNameToId: Map<string, string>,
  powerUnitNameToId: Map<string, string>,
  trailerNameToId: Map<string, string>,
): SupportedEntry | SkippedEntry {
  const commodityName = getCellText(row, 'Commodity Type');
  const powerUnitName = getCellText(row, 'Vehicle Type');
  const trailerName = getCellText(row, 'Trailer');
  const trailerCategory = getCellText(row, 'Trailer Category');
  const canAddTrailer = getCellText(row, 'Can Add Trailer?');
  const canAddBooster = getCellText(row, 'Can Add Booster?');
  const forceSubmitToQueue = getCellText(row, 'Force Submit to Queue');
  const steer = getCellText(row, 'Steer');
  const drive = getCellText(row, 'Drive');
  const wheelbase = getCellText(row, 'Wheelbase');
  const specialInstructions = getCellText(row, 'Special Instructions');

  if (!commodityName && !powerUnitName && !trailerName && specialInstructions) {
    return { reason: 'note-row', row };
  }

  if (!commodityName || !powerUnitName) {
    return { reason: 'missing-core-columns', row };
  }

  if (forceSubmitToQueue) {
    return { reason: 'force-submit-to-queue', row };
  }

  if (steer || drive || wheelbase) {
    return { reason: 'steer-drive-wheelbase', row };
  }

  const commodityId =
    COMMODITY_ID_OVERRIDES[commodityName] ?? commodityNameToId.get(commodityName);
  const powerUnitId = powerUnitNameToId.get(powerUnitName);

  if (!commodityId || !powerUnitId) {
    return { reason: 'missing-commodity-or-powerunit-mapping', row };
  }

  if (canAddTrailer === 'N') {
    return {
      commodityId,
      powerUnitId,
      trailerId: NONE_ID,
      booster: false,
    };
  }

  if (canAddTrailer === 'Y' && !trailerName) {
    return {
      commodityId,
      powerUnitId,
      trailerId: NONE_ID,
      booster: false,
    };
  }

  if (trailerCategory === 'Jeep' || trailerName === 'Jeep') {
    return { reason: 'jeep-row', row };
  }

  if (trailerCategory === 'Booster' || trailerName === 'Boosters') {
    return { reason: 'booster-row', row };
  }

  if (canAddTrailer !== 'Y' || !trailerName) {
    return { reason: 'unsupported-row-shape', row };
  }

  const trailerId = TRAILER_ID_OVERRIDES[trailerName] ?? trailerNameToId.get(trailerName);

  if (!trailerId) {
    return { reason: 'missing-trailer-mapping', row };
  }

  return {
    commodityId,
    powerUnitId,
    trailerId,
    booster: canAddBooster === 'Y',
  };
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
      powerUnit = {
        type: supportedEntry.powerUnitId,
        trailers: [],
      };
      commodity.powerUnits.push(powerUnit);
    }

    let trailer = powerUnit.trailers.find(
      (entry) => entry.type === supportedEntry.trailerId,
    );
    if (!trailer) {
      trailer = {
        type: supportedEntry.trailerId,
        jeep: false,
        booster: supportedEntry.booster,
      };
      powerUnit.trailers.push(trailer);
    }

    trailer.booster = supportedEntry.booster;
    trailer.weightPermittable = true;


    // This is the jeep logic I'm a bit unsure about. Jeep has specific logic to it.
    if (supportedEntry.trailerId === NONE_ID && trailer.jeep === undefined) {
      trailer.jeep = false;
    }
  }
}

function countSkippedEntries(skippedEntries: SkippedEntry[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const skippedEntry of skippedEntries) {
    counts[skippedEntry.reason] = (counts[skippedEntry.reason] ?? 0) + 1;
  }

  return counts;
}

function getCellText(row: ScrapedRow, key: string): string | null {
  const value = row[key];

  if (value == null) {
    return null;
  }

  const text = String(value).trim();
  return text === '' ? null : text;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exit(1);
});
