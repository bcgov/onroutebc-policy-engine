type CurrentTrailerGroupLike = {
  trailers: Map<string, string>;
};

type ForceSubmitAuditEntryLike = {
  rowNumber: number;
  commodityName: string;
  powerUnitName: string;
  powerUnitId: string;
  trailerLabel: string;
  trailerId: string | null;
  reasonTags: string[];
};

async function loadClassifyForceSubmitRows() {
  const mod = await import('../../_tools/xls-scraper/src/forceSubmitAudit.js');
  return mod.classifyForceSubmitRows;
}

function createEntry(
  overrides: Partial<ForceSubmitAuditEntryLike>,
): ForceSubmitAuditEntryLike {
  return {
    rowNumber: 81,
    commodityName:
      'Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW)',
    powerUnitName: 'Truck Tractors',
    powerUnitId: 'TRKTRAC',
    trailerLabel: 'Dollies',
    trailerId: 'DOLLIES',
    reasonTags: ['force-submit-to-queue'],
    ...overrides,
  };
}

function createTrailerGroup(trailerIds: string[]): CurrentTrailerGroupLike {
  return {
    trailers: new Map(trailerIds.map((trailerId) => [trailerId, trailerId])),
  };
}

describe('force-submit audit', () => {
  it('should mark a direct force-submit row as resolved when policy already exposes the trailer', async () => {
    const classifyForceSubmitRows = await loadClassifyForceSubmitRows();
    const result = classifyForceSubmitRows({
      commodityEntries: [createEntry({ rowNumber: 81 })],
      currentPowerUnits: new Map([['TRKTRAC', 'Truck Tractors']]),
      currentDirectTrailers: new Map([
        ['TRKTRAC', createTrailerGroup(['DOLLIES', 'JEEPSRG'])],
      ]),
      coveredStandaloneBoosterRows: [],
      coveredStandaloneJeepRows: [],
    });

    expect(result).toEqual([
      {
        rowNumber: 81,
        commodityName:
          'Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW)',
        powerUnitName: 'Truck Tractors',
        trailerLabel: 'Dollies',
        reason: 'resolved-via-current-path',
      },
    ]);
  });

  it('should mark a force-submit row as blocked when the direct power unit is still missing', async () => {
    const classifyForceSubmitRows = await loadClassifyForceSubmitRows();
    const result = classifyForceSubmitRows({
      commodityEntries: [createEntry({ rowNumber: 83, trailerLabel: 'Semi-Trailers - Single Drop, Double Drop, Step Decks, Lowbed, Expandos, etc.', trailerId: 'STSDBDK' })],
      currentPowerUnits: new Map(),
      currentDirectTrailers: new Map(),
      coveredStandaloneBoosterRows: [],
      coveredStandaloneJeepRows: [],
    });

    expect(result).toEqual([
      {
        rowNumber: 83,
        commodityName:
          'Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW)',
        powerUnitName: 'Truck Tractors',
        trailerLabel:
          'Semi-Trailers - Single Drop, Double Drop, Step Decks, Lowbed, Expandos, etc.',
        reason: 'blocked-by-missing-direct-path',
      },
    ]);
  });

  it('should treat a force-submit jeep row as resolved when the jeep row is already covered elsewhere', async () => {
    const classifyForceSubmitRows = await loadClassifyForceSubmitRows();
    const result = classifyForceSubmitRows({
      commodityEntries: [
        createEntry({
          rowNumber: 82,
          trailerLabel: 'Jeep',
          trailerId: null,
          reasonTags: ['force-submit-to-queue', 'jeep-row', 'missing-trailer-mapping'],
        }),
      ],
      currentPowerUnits: new Map([['TRKTRAC', 'Truck Tractors']]),
      currentDirectTrailers: new Map([
        ['TRKTRAC', createTrailerGroup(['JEEPSRG'])],
      ]),
      coveredStandaloneBoosterRows: [],
      coveredStandaloneJeepRows: [
        {
          rowNumber: 82,
          commodityName:
            'Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW)',
          powerUnitName: 'Truck Tractors',
          reason: 'resolved-via-current-jeep-option',
        },
      ],
    });

    expect(result).toEqual([
      {
        rowNumber: 82,
        commodityName:
          'Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW)',
        powerUnitName: 'Truck Tractors',
        trailerLabel: 'Jeep',
        reason: 'resolved-via-current-path',
      },
    ]);
  });
});
