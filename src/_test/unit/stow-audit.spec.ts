import type { AuditEntry } from '../../_tools/xls-scraper/src/commodityWorksheet';
import {
  classifyBoosterRows,
} from '../../_tools/xls-scraper/src/boosterRowAudit';

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

interface ExpectedBoosterGroup {
  commodityName: string;
  powerUnitName: string;
  powerUnitId: string;
  trailerName: string;
  trailerId: string;
  rows: number[];
  sourceBoosterRows: number[];
  reasonTags: string[];
}

function makeBoosterRow(
  overrides: Partial<AuditEntry> = {},
): AuditEntry {
  return {
    rowNumber: 109,
    commodityName: 'None',
    commodityId: 'XXXXXXX',
    powerUnitName: 'Truck Tractors',
    powerUnitId: 'TRKTRAC',
    trailerLabel: 'Boosters',
    trailerId: null,
    reasonTags: ['booster-row', 'missing-trailer-mapping'],
    isStruckThrough: false,
    canCompareTrailer: false,
    ...overrides,
  };
}

function makeExpectedPowerUnit(
  overrides: Partial<ExpectedPowerUnitGroup> = {},
): ExpectedPowerUnitGroup {
  return {
    commodityName: 'None',
    powerUnitName: 'Truck Tractors',
    powerUnitId: 'TRKTRAC',
    rows: [49],
    ...overrides,
  };
}

function makeExpectedTrailer(
  overrides: Partial<ExpectedTrailerGroup> = {},
): ExpectedTrailerGroup {
  return {
    commodityName: 'None',
    powerUnitName: 'Truck Tractors',
    powerUnitId: 'TRKTRAC',
    trailerLabel: 'Fixed Equipment - Conveyors',
    trailerId: 'FECVYRX',
    rows: [109],
    reasonTags: [],
    ...overrides,
  };
}

function makeExpectedBooster(
  overrides: Partial<ExpectedBoosterGroup> = {},
): ExpectedBoosterGroup {
  return {
    commodityName: 'None',
    powerUnitName: 'Truck Tractors',
    powerUnitId: 'TRKTRAC',
    trailerName: 'Fixed Equipment - Conveyors',
    trailerId: 'FECVYRX',
    rows: [327, 328, 329],
    sourceBoosterRows: [109],
    reasonTags: [],
    ...overrides,
  };
}

describe('STOW audit booster row classification', () => {
  it('marks booster rows as resolved when trailer weight expectations are satisfied', () => {
    const [result] = classifyBoosterRows({
      boosterRows: [makeBoosterRow()],
      missingPowerUnits: [],
      missingDirectTrailers: [],
      expectedBoosters: [makeExpectedBooster()],
      missingBoosters: [],
    });

    expect(result?.status).toBe('resolved_via_trailer_weight_sheet');
  });

  it('marks booster rows as missing booster behavior when trailer weight expectations are still missing', () => {
    const expectedBooster = makeExpectedBooster();
    const [result] = classifyBoosterRows({
      boosterRows: [makeBoosterRow()],
      missingPowerUnits: [],
      missingDirectTrailers: [],
      expectedBoosters: [expectedBooster],
      missingBoosters: [expectedBooster],
    });

    expect(result?.status).toBe('missing_booster_behavior');
  });

  it('marks booster rows as blocked by a missing direct power unit', () => {
    const [result] = classifyBoosterRows({
      boosterRows: [makeBoosterRow()],
      missingPowerUnits: [makeExpectedPowerUnit()],
      missingDirectTrailers: [],
      expectedBoosters: [],
      missingBoosters: [],
    });

    expect(result?.status).toBe('blocked_by_missing_direct_power_unit');
  });

  it('marks booster rows as blocked by a missing direct trailer when booster expectations cannot be reached yet', () => {
    const [result] = classifyBoosterRows({
      boosterRows: [makeBoosterRow()],
      missingPowerUnits: [],
      missingDirectTrailers: [makeExpectedTrailer()],
      expectedBoosters: [],
      missingBoosters: [],
    });

    expect(result?.status).toBe('blocked_by_missing_direct_trailer');
  });

  it('keeps truly unmapped booster rows visible', () => {
    const [result] = classifyBoosterRows({
      boosterRows: [makeBoosterRow({ powerUnitId: null })],
      missingPowerUnits: [],
      missingDirectTrailers: [],
      expectedBoosters: [],
      missingBoosters: [],
    });

    expect(result?.status).toBe('unmapped_booster_row');
  });
});
