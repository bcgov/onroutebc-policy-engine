import type { PolicyConfig } from './policyConfig.js';
import type {
  ScrapedRow,
  ScrapedWorksheetRow,
} from './readWorksheet.js';

export const NONE_ID = 'XXXXXXX';

const COMMODITY_ID_OVERRIDES: Record<string, string> = {
  'Scrapers on Dollies': 'SCRAPER',
  'Tow Trucks and Disabled Vehicles': 'TOWDISB',
};

const POWER_UNIT_ID_OVERRIDES: Record<string, string> = {
  'Rubber-Tired Loaders': 'RBTRLDR',
};

const TRAILER_ID_OVERRIDES: Record<string, string> = {
  'Platform Trailer': 'PLATFRM',
  'Semi-Trailers - Widespread Tandem': 'STWDTAN',
};

export interface LookupMaps {
  commodityNameToId: Map<string, string>;
  powerUnitNameToId: Map<string, string>;
  trailerNameToId: Map<string, string>;
}

export interface SupportedEntry {
  commodityId: string;
  powerUnitId: string;
  trailerId: string;
  booster: boolean;
  rowNumber: number;
}

export interface SkippedEntry {
  reason: string;
  rowNumber: number;
  row: ScrapedRow;
}

export interface AuditEntry {
  rowNumber: number;
  commodityName: string;
  commodityId: string | null;
  powerUnitName: string;
  powerUnitId: string | null;
  trailerLabel: string;
  trailerId: string | null;
  reasonTags: string[];
  isStruckThrough: boolean;
  canCompareTrailer: boolean;
}

export function createLookupMaps(config: PolicyConfig): LookupMaps {
  return {
    commodityNameToId: new Map(
      config.commodities.map((commodity) => [commodity.name, commodity.id]),
    ),
    powerUnitNameToId: new Map(
      config.vehicleTypes.powerUnitTypes.map((powerUnit) => [
        powerUnit.name,
        powerUnit.id,
      ]),
    ),
    trailerNameToId: new Map(
      config.vehicleTypes.trailerTypes.map((trailer) => [trailer.name, trailer.id]),
    ),
  };
}

export function parseSupportedEntries(
  rows: ScrapedWorksheetRow[],
  config: PolicyConfig,
): {
  supportedEntries: SupportedEntry[];
  skippedEntries: SkippedEntry[];
} {
  const lookups = createLookupMaps(config);
  const supportedEntries: SupportedEntry[] = [];
  const skippedEntries: SkippedEntry[] = [];

  for (const rowEntry of rows) {
    const parsedRow = parseSupportedRow(rowEntry, lookups);

    if ('reason' in parsedRow) {
      skippedEntries.push(parsedRow);
      continue;
    }

    supportedEntries.push(parsedRow);
  }

  return { supportedEntries, skippedEntries };
}

export function parseAuditEntries(
  rows: ScrapedWorksheetRow[],
  config: PolicyConfig,
): AuditEntry[] {
  const lookups = createLookupMaps(config);
  const auditEntries: AuditEntry[] = [];

  for (const rowEntry of rows) {
    if (rowEntry.isStruckThrough) {
      continue;
    }

    const normalizedRow = normalizeWorksheetRow(rowEntry.row);
    const commodityName = getCellText(normalizedRow, 'Commodity Type');
    const powerUnitName = getCellText(normalizedRow, 'Vehicle Type');
    const trailerName = getCellText(normalizedRow, 'Trailer');
    const trailerCategory = getCellText(normalizedRow, 'Trailer Category');
    const canAddTrailer = getCellText(normalizedRow, 'Can Add Trailer?');
    const canAddBooster = getCellText(normalizedRow, 'Can Add Booster?');
    const forceSubmitToQueue = getCellText(normalizedRow, 'Force Submit to Queue');
    const steer = getCellText(normalizedRow, 'Steer');
    const drive = getCellText(normalizedRow, 'Drive');
    const wheelbase = getCellText(normalizedRow, 'Wheelbase');
    const specialInstructions = getCellText(normalizedRow, 'Special Instructions');

    if (!commodityName || !powerUnitName) {
      if (specialInstructions) {
        continue;
      }

      auditEntries.push({
        rowNumber: rowEntry.rowNumber,
        commodityName: commodityName ?? '(missing commodity)',
        commodityId: null,
        powerUnitName: powerUnitName ?? '(missing power unit)',
        powerUnitId: null,
        trailerLabel: trailerName ?? 'None',
        trailerId: trailerName
          ? resolveTrailerId(trailerName, lookups) ?? null
          : NONE_ID,
        reasonTags: ['missing-core-columns'],
        isStruckThrough: false,
        canCompareTrailer: false,
      });
      continue;
    }

    const commodityId = resolveCommodityId(commodityName, lookups);
    const powerUnitId = resolvePowerUnitId(powerUnitName, lookups);
    const trailerId = resolveAuditTrailerId({
      canAddTrailer,
      trailerName,
      lookups,
    });
    const trailerLabel = trailerName ?? 'None';
    const reasonTags: string[] = [];

    if (forceSubmitToQueue) {
      reasonTags.push('force-submit-to-queue');
    }

    if (trailerCategory === 'Jeep' || trailerName === 'Jeep') {
      reasonTags.push('jeep-row');
    }

    if (trailerCategory === 'Booster' || trailerName === 'Boosters') {
      reasonTags.push('booster-row');
    }

    if (steer || drive || wheelbase) {
      reasonTags.push('steer-drive-wheelbase');
    }

    if (!commodityId) {
      reasonTags.push('missing-commodity-mapping');
    }

    if (!powerUnitId) {
      reasonTags.push('missing-powerunit-mapping');
    }

    if (!trailerId) {
      reasonTags.push('missing-trailer-mapping');
    }

    auditEntries.push({
      rowNumber: rowEntry.rowNumber,
      commodityName,
      commodityId: commodityId ?? null,
      powerUnitName,
      powerUnitId: powerUnitId ?? null,
      trailerLabel,
      trailerId: trailerId ?? null,
      reasonTags,
      isStruckThrough: false,
      canCompareTrailer: Boolean(powerUnitId && trailerId),
    });
  }

  return auditEntries;
}

function parseSupportedRow(
  rowEntry: ScrapedWorksheetRow,
  lookups: LookupMaps,
): SupportedEntry | SkippedEntry {
  if (rowEntry.isStruckThrough) {
    return { reason: 'struck-through', rowNumber: rowEntry.rowNumber, row: rowEntry.row };
  }

  const row = normalizeWorksheetRow(rowEntry.row);
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
    return { reason: 'note-row', rowNumber: rowEntry.rowNumber, row: rowEntry.row };
  }

  if (!commodityName || !powerUnitName) {
    return {
      reason: 'missing-core-columns',
      rowNumber: rowEntry.rowNumber,
      row: rowEntry.row,
    };
  }

  if (forceSubmitToQueue) {
    return {
      reason: 'force-submit-to-queue',
      rowNumber: rowEntry.rowNumber,
      row: rowEntry.row,
    };
  }

  if (steer || drive || wheelbase) {
    return {
      reason: 'steer-drive-wheelbase',
      rowNumber: rowEntry.rowNumber,
      row: rowEntry.row,
    };
  }

  const commodityId = resolveCommodityId(commodityName, lookups);
  const powerUnitId = resolvePowerUnitId(powerUnitName, lookups);

  if (!commodityId || !powerUnitId) {
    return {
      reason: 'missing-commodity-or-powerunit-mapping',
      rowNumber: rowEntry.rowNumber,
      row: rowEntry.row,
    };
  }

  if (canAddTrailer === 'N') {
    return {
      commodityId,
      powerUnitId,
      trailerId: NONE_ID,
      booster: false,
      rowNumber: rowEntry.rowNumber,
    };
  }

  if (canAddTrailer === 'Y' && !trailerName) {
    return {
      commodityId,
      powerUnitId,
      trailerId: NONE_ID,
      booster: false,
      rowNumber: rowEntry.rowNumber,
    };
  }

  if (trailerCategory === 'Jeep' || trailerName === 'Jeep') {
    return { reason: 'jeep-row', rowNumber: rowEntry.rowNumber, row: rowEntry.row };
  }

  if (trailerCategory === 'Booster' || trailerName === 'Boosters') {
    return {
      reason: 'booster-row',
      rowNumber: rowEntry.rowNumber,
      row: rowEntry.row,
    };
  }

  if (canAddTrailer !== 'Y' || !trailerName) {
    return {
      reason: 'unsupported-row-shape',
      rowNumber: rowEntry.rowNumber,
      row: rowEntry.row,
    };
  }

  const trailerId = resolveTrailerId(trailerName, lookups);

  if (!trailerId) {
    return {
      reason: 'missing-trailer-mapping',
      rowNumber: rowEntry.rowNumber,
      row: rowEntry.row,
    };
  }

  return {
    commodityId,
    powerUnitId,
    trailerId,
    booster: canAddBooster === 'Y',
    rowNumber: rowEntry.rowNumber,
  };
}

function normalizeWorksheetRow(row: ScrapedRow): ScrapedRow {
  const normalizedRow = { ...row };
  const canAddTrailer = getCellText(row, 'Can Add Trailer?');
  const steer = getCellText(row, 'Steer');
  const drive = getCellText(row, 'Drive');
  const wheelbase = getCellText(row, 'Wheelbase');
  const trailerName = getCellText(row, 'Trailer');
  const trailerCategory = getCellText(row, 'Trailer Category');
  const canAddBooster = getCellText(row, 'Can Add Booster?');

  const hasDuplicatedTrailerValues =
    trailerName !== null &&
    trailerCategory !== null &&
    canAddBooster !== null &&
    canAddTrailer === trailerName &&
    steer === trailerCategory &&
    drive === canAddBooster &&
    wheelbase === null;

  if (!hasDuplicatedTrailerValues) {
    return normalizedRow;
  }

  normalizedRow['Can Add Trailer?'] = 'Y';
  normalizedRow.Steer = null;
  normalizedRow.Drive = null;
  normalizedRow.Wheelbase = null;

  return normalizedRow;
}

function resolveCommodityId(
  commodityName: string,
  lookups: LookupMaps,
): string | undefined {
  return COMMODITY_ID_OVERRIDES[commodityName] ?? lookups.commodityNameToId.get(commodityName);
}

function resolvePowerUnitId(
  powerUnitName: string,
  lookups: LookupMaps,
): string | undefined {
  return POWER_UNIT_ID_OVERRIDES[powerUnitName] ?? lookups.powerUnitNameToId.get(powerUnitName);
}

function resolveTrailerId(
  trailerName: string,
  lookups: LookupMaps,
): string | undefined {
  return TRAILER_ID_OVERRIDES[trailerName] ?? lookups.trailerNameToId.get(trailerName);
}

function resolveAuditTrailerId({
  canAddTrailer,
  trailerName,
  lookups,
}: {
  canAddTrailer: string | null;
  trailerName: string | null;
  lookups: LookupMaps;
}): string | undefined {
  if (canAddTrailer === 'N') {
    return NONE_ID;
  }

  if (canAddTrailer === 'Y' && !trailerName) {
    return NONE_ID;
  }

  if (!trailerName) {
    return undefined;
  }

  return resolveTrailerId(trailerName, lookups);
}

function getCellText(row: ScrapedRow, key: string): string | null {
  const value = row[key];

  if (value == null) {
    return null;
  }

  const text = String(value).trim();
  return text === '' ? null : text;
}
