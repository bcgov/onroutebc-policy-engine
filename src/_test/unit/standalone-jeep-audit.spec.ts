type CurrentTrailerGroupLike = {
  trailers: Map<string, string>;
};

type StandaloneJeepAuditEntryLike = {
  rowNumber: number;
  commodityName: string;
  powerUnitName: string;
  powerUnitId: string;
  reasonTags: string[];
};

async function loadClassifyStandaloneJeepRows() {
  const mod = await import('../../_tools/xls-scraper/src/standaloneJeepAudit.js');
  return mod.classifyStandaloneJeepRows;
}

function createEntry(
  overrides: Partial<StandaloneJeepAuditEntryLike>,
): StandaloneJeepAuditEntryLike {
  return {
    rowNumber: 50,
    commodityName: 'Bridge Beams',
    powerUnitName: 'Truck Tractors',
    powerUnitId: 'TRKTRAC',
    reasonTags: ['jeep-row', 'missing-trailer-mapping'],
    ...overrides,
  };
}

function createTrailerGroup(trailerIds: string[]): CurrentTrailerGroupLike {
  return {
    trailers: new Map(trailerIds.map((trailerId) => [trailerId, trailerId])),
  };
}

describe('standalone jeep audit', () => {
  it('should mark a standalone jeep row as resolved when policy already exposes JEEPSRG', async () => {
    const classifyStandaloneJeepRows = await loadClassifyStandaloneJeepRows();
    const result = classifyStandaloneJeepRows({
      commodityEntries: [createEntry({ rowNumber: 50 })],
      currentPowerUnits: new Map([['TRKTRAC', 'Truck Tractors']]),
      currentDirectTrailers: new Map([
        ['TRKTRAC', createTrailerGroup(['JEEPSRG', 'POLETRL'])],
      ]),
    });

    expect(result).toEqual([
      {
        rowNumber: 50,
        commodityName: 'Bridge Beams',
        powerUnitName: 'Truck Tractors',
        reason: 'resolved-via-current-jeep-option',
      },
    ]);
  });

  it('should mark a standalone jeep row as blocked when the power unit is still missing', async () => {
    const classifyStandaloneJeepRows = await loadClassifyStandaloneJeepRows();
    const result = classifyStandaloneJeepRows({
      commodityEntries: [createEntry({ rowNumber: 71, commodityName: 'Fixed Equipment' })],
      currentPowerUnits: new Map(),
      currentDirectTrailers: new Map(),
    });

    expect(result).toEqual([
      {
        rowNumber: 71,
        commodityName: 'Fixed Equipment',
        powerUnitName: 'Truck Tractors',
        reason: 'blocked-by-missing-direct-path',
      },
    ]);
  });

  it('should leave a standalone jeep row unresolved when the power unit exists but JEEPSRG is not exposed', async () => {
    const classifyStandaloneJeepRows = await loadClassifyStandaloneJeepRows();
    const result = classifyStandaloneJeepRows({
      commodityEntries: [createEntry({ rowNumber: 105, commodityName: 'None' })],
      currentPowerUnits: new Map([['TRKTRAC', 'Truck Tractors']]),
      currentDirectTrailers: new Map([
        ['TRKTRAC', createTrailerGroup(['SEMITRL'])],
      ]),
    });

    expect(result).toEqual([]);
  });
});
