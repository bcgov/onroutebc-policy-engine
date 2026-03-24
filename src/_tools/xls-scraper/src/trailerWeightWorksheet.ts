import {
  createLookupMaps,
  resolveCommodityId,
  resolveTrailerId,
} from './commodityWorksheet.js';
import type { PolicyConfig } from './policyConfig.js';
import type {
  ScrapedRow,
  ScrapedWorksheetRow,
} from './readWorksheet.js';

export interface BoosterExpectationEntry {
  rowNumber: number;
  commodityName: string;
  commodityId: string | null;
  trailerName: string;
  trailerId: string | null;
  forceSubmitToQueue: boolean;
  reasonTags: string[];
}

export function parseBoosterExpectationEntries(
  rows: ScrapedWorksheetRow[],
  config: PolicyConfig,
): BoosterExpectationEntry[] {
  const lookups = createLookupMaps(config);
  const entries: BoosterExpectationEntry[] = [];

  for (const rowEntry of rows) {
    if (rowEntry.isStruckThrough) {
      continue;
    }

    const commodityName = getCellText(rowEntry.row, 'Commodity Type');
    const trailerName = getCellText(rowEntry.row, 'Trailer Type');
    const trailerTypeBefore = getCellText(rowEntry.row, 'Trailer Type Before');
    const nextCategory = getCellText(rowEntry.row, 'Power Unit/Trailer Category');

    if (
      !commodityName ||
      !trailerName ||
      trailerTypeBefore !== 'x' ||
      nextCategory !== 'Booster'
    ) {
      continue;
    }

    const commodityId = resolveCommodityId(commodityName, lookups) ?? null;
    const trailerId = resolveTrailerId(trailerName, lookups) ?? null;
    const reasonTags: string[] = [];

    if (getCellText(rowEntry.row, 'Force submit  to Queue')) {
      reasonTags.push('force-submit-to-queue');
    }

    if (!commodityId) {
      reasonTags.push('missing-commodity-mapping');
    }

    if (!trailerId) {
      reasonTags.push('missing-trailer-mapping');
    }

    entries.push({
      rowNumber: rowEntry.rowNumber,
      commodityName,
      commodityId,
      trailerName,
      trailerId,
      forceSubmitToQueue: reasonTags.includes('force-submit-to-queue'),
      reasonTags,
    });
  }

  return entries;
}

function getCellText(row: ScrapedRow, key: string): string | null {
  const value = row[key];

  if (value == null) {
    return null;
  }

  const text = String(value).trim();
  return text === '' ? null : text;
}
