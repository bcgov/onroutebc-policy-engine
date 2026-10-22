import { POWER_UNIT_CODES } from '../../src/constants/power-unit-codes';
import { TRAILER_CODES } from '../../src/constants/trailer-codes';
import {
  buildTrailerFixture,
  getNeighbourAxleTypes,
  getTrailerFixturePowerUnits,
} from './trailer-fixture';
import currentPolicyConfig from '../../src/_test/policy-config/_current-config.json';

const base = {
  row: 1,
  powerUnitCode: POWER_UNIT_CODES.TRUCK_TRACTORS,
  vehicleCode: TRAILER_CODES.SEMI_TRAILERS,
  axleType: 'Tridem',
  before: '',
  after: '',
  neighbourCategory: '',
  neighbourAxleType: '',
  spreadCm: undefined,
  spacingCm: undefined,
};

describe('worksheet vehicle and axle translation', () => {
  it.each<[string, string, string[]]>([
    ['NONREDU', TRAILER_CODES.PONY_TRAILERS, [POWER_UNIT_CODES.TRUCKS]],
    [
      'XXXXXXX',
      TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS,
      [
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.TRUCKS,
      ],
    ],
    [
      'EMPTYXX',
      TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
      [
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
      ],
    ],
  ])(
    'covers configured towing types for %s / %s',
    (commodityId, trailerCode, additional) => {
      const commodity = currentPolicyConfig.commodities.find(
        (entry) => entry.id === commodityId,
      )!;
      const powerUnits = getTrailerFixturePowerUnits(
        commodity.powerUnits,
        trailerCode,
        '',
      );
      expect(powerUnits).toEqual([
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        ...additional,
      ]);
      for (const powerUnitCode of powerUnits) {
        const fixture = buildTrailerFixture(
          { ...base, powerUnitCode, vehicleCode: trailerCode },
          21000,
        );
        expect(fixture.vehicles).toEqual([powerUnitCode, trailerCode]);
        expect(fixture.axles[fixture.targetAxleIndex].vehicleIndex).toBe(1);
      }
    },
  );

  it('keeps a reference case when no commodity trailer entry is present', () => {
    expect(getTrailerFixturePowerUnits([], TRAILER_CODES.DOLLIES, '')).toEqual([
      POWER_UNIT_CODES.TRUCK_TRACTORS,
    ]);
  });

  it('expands All in I into three drive types while keeping the tandem target in E', () => {
    const axleCounts = getNeighbourAxleTypes('All').map((neighbourAxleType) => {
      const fixture = buildTrailerFixture(
        {
          ...base,
          axleType: 'Tandem',
          after: 'x',
          neighbourCategory: 'Power Unit',
          neighbourAxleType,
        },
        23000,
      );
      return fixture.axles.map((axle) => axle.numberOfAxles);
    });
    expect(axleCounts).toEqual([
      [1, 1, 2],
      [1, 2, 2],
      [1, 3, 2],
    ]);
  });

  it('uses only the named Mobile Crane before the Dolly', () => {
    const powerUnits = getTrailerFixturePowerUnits(
      [],
      TRAILER_CODES.DOLLIES,
      'Cranes - Mobile',
    );
    expect(powerUnits).toEqual([POWER_UNIT_CODES.CRANES_MOBILE]);
    const row = {
      ...base,
      powerUnitCode: powerUnits[0],
      vehicleCode: TRAILER_CODES.DOLLIES,
      axleType: 'Tandem',
      after: 'X',
      neighbourCategory: 'Cranes - Mobile',
      neighbourAxleType: 'Single',
    };
    const fixture = buildTrailerFixture(row, 23000);
    expect(fixture.vehicles).toEqual([
      POWER_UNIT_CODES.CRANES_MOBILE,
      TRAILER_CODES.DOLLIES,
    ]);
    expect(fixture.axles.map((axle) => axle.numberOfAxles)).toEqual([1, 1, 2]);
    expect(() =>
      buildTrailerFixture(
        { ...row, powerUnitCode: POWER_UNIT_CODES.TRUCK_TRACTORS },
        23000,
      ),
    ).toThrow('Unsupported worksheet neighbour relationship');
  });

  it('puts the target booster after its semi and assigns target geometry to axle unit 4', () => {
    const fixture = buildTrailerFixture(
      {
        ...base,
        row: 5,
        vehicleCode: TRAILER_CODES.BOOSTER,
        axleType: 'Single',
        after: 'x',
        neighbourCategory: 'Semi-Trailer',
        neighbourAxleType: 'Tridem',
        spreadCm: 100,
        spacingCm: 299,
      },
      9100,
    );
    expect(fixture).toEqual({
      vehicles: [
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.SEMI_TRAILERS,
        TRAILER_CODES.BOOSTER,
      ],
      targetAxleIndex: 3,
      axles: [
        { numberOfAxles: 1, vehicleIndex: 0, axleUnitWeight: 0 },
        { numberOfAxles: 2, vehicleIndex: 0, axleUnitWeight: 0 },
        { numberOfAxles: 3, vehicleIndex: 1, axleUnitWeight: 0 },
        {
          numberOfAxles: 1,
          vehicleIndex: 2,
          axleUnitWeight: 9100,
          axleSpread: 100,
          interaxleSpacing: 299,
        },
      ],
    });
  });

  it('puts a following booster after the target, with spacing on that booster', () => {
    const fixture = buildTrailerFixture(
      {
        ...base,
        before: 'X',
        neighbourCategory: 'Booster',
        neighbourAxleType: 'Tandem',
        spreadCm: 370,
        spacingCm: 420,
      },
      28000,
    );
    expect(fixture.targetAxleIndex).toBe(2);
    expect(fixture.vehicles).toEqual([
      POWER_UNIT_CODES.TRUCK_TRACTORS,
      TRAILER_CODES.SEMI_TRAILERS,
      TRAILER_CODES.BOOSTER,
    ]);
    expect(fixture.axles[2]).toEqual({
      numberOfAxles: 3,
      vehicleIndex: 1,
      axleUnitWeight: 28000,
      axleSpread: 370,
    });
    expect(fixture.axles[3]).toEqual({
      numberOfAxles: 2,
      vehicleIndex: 2,
      axleUnitWeight: 0,
      interaxleSpacing: 420,
    });
  });

  it.each<[string, number]>([
    ['Single', 1],
    ['Tandem', 2],
    ['Tridem', 3],
  ])('uses the specified %s drive before a single target', (type, count) => {
    const fixture = buildTrailerFixture(
      {
        ...base,
        vehicleCode: TRAILER_CODES.JEEPS,
        axleType: 'Single',
        after: 'X',
        neighbourCategory: 'Power Unit',
        neighbourAxleType: type,
        spacingCm: 120,
      },
      11000,
    );
    expect(fixture.targetAxleIndex).toBe(2);
    expect(fixture.axles[1]).toEqual({
      numberOfAxles: count,
      vehicleIndex: 0,
      axleUnitWeight: 0,
    });
    expect(fixture.axles[2]).toEqual({
      numberOfAxles: 1,
      vehicleIndex: 1,
      axleUnitWeight: 11000,
      interaxleSpacing: 120,
    });
  });

  it.each([
    ['', 'None'],
    ['None', 'NA'],
  ])(
    'does not invent a neighbour or geometry for H=%s / I=%s',
    (neighbourCategory, neighbourAxleType) => {
      const fixture = buildTrailerFixture(
        { ...base, before: 'x', neighbourCategory, neighbourAxleType },
        29000,
      );
      expect(fixture.vehicles).toEqual([
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.SEMI_TRAILERS,
      ]);
      expect(fixture.axles[2]).toEqual({
        numberOfAxles: 3,
        vehicleIndex: 1,
        axleUnitWeight: 29000,
      });
    },
  );

  it('does not choose a drive count for an underspecified Dolly', () => {
    expect(() =>
      buildTrailerFixture(
        {
          ...base,
          row: 41,
          vehicleCode: TRAILER_CODES.DOLLIES,
          after: 'X',
          neighbourCategory: 'Power Unit',
        },
        11000,
      ),
    ).toThrow('(missing axle type)');
  });

  it('rejects contradictory direction flags and unowned spacing', () => {
    expect(() =>
      buildTrailerFixture(
        {
          ...base,
          before: 'x',
          after: 'x',
          neighbourCategory: 'Booster',
          neighbourAxleType: 'Single',
        },
        29000,
      ),
    ).toThrow('Unsupported worksheet neighbour relationship');
    expect(() =>
      buildTrailerFixture({ ...base, spacingCm: 300 }, 29000),
    ).toThrow('Spacing without an explicit neighbour');
    expect(() =>
      buildTrailerFixture(
        {
          ...base,
          before: 'x',
          neighbourCategory: 'None',
          neighbourAxleType: 'NA',
          spacingCm: 300,
        },
        29000,
      ),
    ).toThrow('Spacing without an explicit neighbour');
  });
});
