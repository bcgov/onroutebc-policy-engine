import type { AuditEntry } from '../../_tools/xls-scraper/src/commodityWorksheet' with { "resolution-mode": "import" };
import type { BoosterExpectationEntry } from '../../_tools/xls-scraper/src/trailerWeightWorksheet' with { "resolution-mode": "import" };

async function loadCorrelateBoosterPlacements() {
  const mod = await import(
    '../../_tools/xls-scraper/src/boosterPlacementCorrelation'
  );
  return mod.correlateBoosterPlacements;
}

function createAuditEntry(
  overrides: Partial<AuditEntry>,
): AuditEntry {
  return {
    rowNumber: 1,
    commodityName: 'None',
    commodityId: 'XXXXXXX',
    powerUnitName: 'Truck Tractors',
    powerUnitId: 'TRKTRAC',
    trailerLabel: 'Semi-Trailers',
    trailerId: 'SEMITRL',
    canAddBooster: false,
    reasonTags: [],
    isStruckThrough: false,
    canCompareTrailer: true,
    ...overrides,
  };
}

function createBoosterEntry(
  overrides: Partial<BoosterExpectationEntry>,
): BoosterExpectationEntry {
  return {
    rowNumber: 100,
    commodityName: 'None',
    commodityId: 'XXXXXXX',
    trailerName: 'Semi-Trailers',
    trailerId: 'SEMITRL',
    forceSubmitToQueue: false,
    reasonTags: [],
    ...overrides,
  };
}

describe('booster placement correlation', () => {
  it('should mark trailer-weight rows as safe when all matching direct rows are booster-capable', async () => {
    const correlateBoosterPlacements = await loadCorrelateBoosterPlacements();
    const result = correlateBoosterPlacements({
      commodityName: 'None',
      directTrailerEntries: [
        createAuditEntry({
          rowNumber: 20,
          powerUnitName: 'Truck Tractors',
          canAddBooster: true,
        }),
        createAuditEntry({
          rowNumber: 21,
          powerUnitName: 'Picker Truck Tractors',
          powerUnitId: 'PICKRTT',
          canAddBooster: true,
        }),
      ],
      trailerWeightEntries: [
        createBoosterEntry({ rowNumber: 300 }),
        createBoosterEntry({ rowNumber: 301 }),
      ],
    });

    expect(result.safeGroups).toHaveLength(1);
    expect(result.safeGroups[0]?.directRows).toEqual([
      '20:Truck Tractors:Y',
      '21:Picker Truck Tractors:Y',
    ]);
    expect(result.safeTrailerIds.has('SEMITRL')).toBe(true);
    expect(result.ambiguousGroups).toHaveLength(0);
    expect(result.contradictoryGroups).toHaveLength(0);
    expect(result.unmatchedGroups).toHaveLength(0);
  });

  it('should mark trailer-weight rows as contradictory when matching direct rows all disallow boosters', async () => {
    const correlateBoosterPlacements = await loadCorrelateBoosterPlacements();
    const result = correlateBoosterPlacements({
      commodityName: 'None',
      directTrailerEntries: [
        createAuditEntry({
          rowNumber: 123,
          powerUnitName: 'Truck Tractors',
          canAddBooster: false,
        }),
      ],
      trailerWeightEntries: [
        createBoosterEntry({ rowNumber: 368 }),
      ],
    });

    expect(result.safeGroups).toHaveLength(0);
    expect(result.contradictoryGroups).toHaveLength(1);
    expect(result.contradictoryGroups[0]?.directRows).toEqual([
      '123:Truck Tractors:N',
    ]);
  });

  it('should mark trailer-weight rows as ambiguous when matching direct rows mix booster flags', async () => {
    const correlateBoosterPlacements = await loadCorrelateBoosterPlacements();
    const result = correlateBoosterPlacements({
      commodityName: 'Reducible Loads',
      directTrailerEntries: [
        createAuditEntry({
          rowNumber: 114,
          commodityName: 'Reducible Loads',
          commodityId: 'REDUCBL',
          powerUnitName: 'Truck Tractors',
          canAddBooster: true,
        }),
        createAuditEntry({
          rowNumber: 124,
          commodityName: 'Reducible Loads',
          commodityId: 'REDUCBL',
          powerUnitName: 'Truck Tractors',
          canAddBooster: false,
        }),
      ],
      trailerWeightEntries: [
        createBoosterEntry({
          rowNumber: 429,
          commodityName: 'Reducible Loads',
          commodityId: 'REDUCBL',
        }),
      ],
    });

    expect(result.ambiguousGroups).toHaveLength(1);
    expect(result.ambiguousGroups[0]?.directRows).toEqual([
      '114:Truck Tractors:Y',
      '124:Truck Tractors:N',
    ]);
    expect(result.safeTrailerIds.size).toBe(0);
  });
});

export {};
