// Builds the vehicle and axle configuration for one trailer workbook row.
import { POWER_UNIT_CODES } from '../../src/constants/power-unit-codes';
import { TRAILER_CODES } from '../../src/constants/trailer-codes';
import { AxleConfiguration, Commodity } from '../../src/types';
import { AXLE_TYPES, getAxleCount, isAxleType } from '../shared/axle-types';

export type TrailerFixtureInput = {
  row: number;
  powerUnitCode: string;
  vehicleCode: string;
  axleType: string;
  before: string;
  after: string;
  neighbourCategory: string;
  neighbourAxleType: string;
  spreadCm: number | undefined;
  spacingCm: number | undefined;
};

/**
 * The vehicle next to the trailer under test, from workbook columns F to I:
 *   F "Trailer Type Before" = x : the trailer is before its neighbour (the neighbour follows).
 *   G "Trailer Type After"  = x : the trailer is after its neighbour (the neighbour is in front).
 *   H the neighbour category.
 *   I the neighbour axle type.
 */
type Neighbour =
  | 'no neighbour' // F, G, H, and I are all empty.
  | 'nothing follows' // F = x; H empty/I="None", or H="None"/I="NA".
  | 'booster follows' // F = x, H = "Booster".
  | 'power unit in front' // G = x, H = "Power Unit" (or "Cranes - Mobile").
  | 'semi-trailer in front'; // G = x, H = "Semi-Trailer".

/**
 * Column I can be "All". Then we test each axle type.
 */
export function getNeighbourAxleTypes(workbookAxleType: string): string[] {
  return workbookAxleType === 'All' ? AXLE_TYPES : [workbookAxleType];
}

/**
 * Returns the power units to test the trailer with.
 *
 * - Truck Tractors are always tested. They are the approved reference case,
 *   and they keep rows with incomplete commodity config in the test run.
 * - Each power unit that the commodity config allows with this trailer is also tested.
 *   This tests each commodity / power unit / trailer weight lookup.
 * - When column H is "Cranes - Mobile", only the Mobile Crane is tested.
 */
export function getTrailerFixturePowerUnits(
  commodityPowerUnits: Commodity['powerUnits'],
  trailerCode: string,
  neighbourCategory: string,
): string[] {
  if (neighbourCategory === 'Cranes - Mobile') {
    return [POWER_UNIT_CODES.CRANES_MOBILE];
  }
  const powerUnitsThatTowTrailer = commodityPowerUnits
    .filter((powerUnit) =>
      powerUnit.trailers.some((trailer) => trailer.type === trailerCode),
    )
    .map((powerUnit) => powerUnit.type);
  return [
    ...new Set([POWER_UNIT_CODES.TRUCK_TRACTORS, ...powerUnitsThatTowTrailer]),
  ];
}

/**
 * Returns the vehicles and axle units for one test, and the index of the
 * axle unit under test. Only that axle unit carries weight. All other axle units have 0 kg.
 *
 * The layout, from front to back:
 *   1. The power unit: a single steer axle unit, then the drive axle unit.
 *      The drive is a tandem, unless the row gives the drive axle type ("power unit in front").
 *   2. A semi-trailer, only for "semi-trailer in front".
 *   3. The trailer under test.
 *   4. A booster, only for "booster follows".
 *
 * Throws for a neighbour layout that is not in the list. Then the row fails,
 * until someone adds an explicit mapping. We do not guess.
 */
export function buildTrailerFixture(row: TrailerFixtureInput, weight: number) {
  const numberOfAxles = getAxleCount(row.axleType);
  const neighbour = getNeighbour(row);

  const vehicles: string[] = [row.powerUnitCode];
  const axles: AxleConfiguration[] = [
    { numberOfAxles: 1, vehicleIndex: 0, axleUnitWeight: 0 },
    {
      numberOfAxles:
        neighbour === 'power unit in front'
          ? getAxleCount(row.neighbourAxleType)
          : 2,
      vehicleIndex: 0,
      axleUnitWeight: 0,
    },
  ];

  if (neighbour === 'semi-trailer in front') {
    vehicles.push(TRAILER_CODES.SEMI_TRAILERS);
    axles.push({
      numberOfAxles: getAxleCount(row.neighbourAxleType),
      vehicleIndex: vehicles.length - 1,
      axleUnitWeight: 0,
    });
  }

  vehicles.push(row.vehicleCode);
  const targetAxleIndex = axles.length;
  const target: AxleConfiguration = {
    numberOfAxles,
    vehicleIndex: vehicles.length - 1,
    axleUnitWeight: weight,
  };
  if (row.spreadCm !== undefined) {
    target.axleSpread = row.spreadCm;
  }
  axles.push(target);

  // The engine reads interaxle spacing from the axle unit behind the gap.
  // So the spacing goes on the booster when it follows,
  // and on the trailer under test when a vehicle is in front of it.
  if (neighbour === 'booster follows') {
    vehicles.push(TRAILER_CODES.BOOSTER);
    const booster: AxleConfiguration = {
      numberOfAxles: getAxleCount(row.neighbourAxleType),
      vehicleIndex: vehicles.length - 1,
      axleUnitWeight: 0,
    };
    if (row.spacingCm !== undefined) {
      booster.interaxleSpacing = row.spacingCm;
    }
    axles.push(booster);
  } else if (
    neighbour === 'power unit in front' ||
    neighbour === 'semi-trailer in front'
  ) {
    if (row.spacingCm !== undefined) {
      target.interaxleSpacing = row.spacingCm;
    }
  } else if (row.spacingCm !== undefined) {
    throw new Error(
      `Spacing without an explicit neighbour needs interpretation at row ${row.row}`,
    );
  }

  return { vehicles, axles, targetAxleIndex };
}

function getNeighbour(row: TrailerFixtureInput): Neighbour {
  const isMarked = (value: string) => value.toLowerCase() === 'x';
  const trailerIsBefore = isMarked(row.before) && !row.after;
  const trailerIsAfter = isMarked(row.after) && !row.before;
  const neighbourHasAxles = isAxleType(row.neighbourAxleType);
  const nothingFollows =
    (!row.neighbourCategory && row.neighbourAxleType === 'None') ||
    (row.neighbourCategory === 'None' && row.neighbourAxleType === 'NA');

  if (
    !row.before &&
    !row.after &&
    !row.neighbourCategory &&
    !row.neighbourAxleType
  ) {
    return 'no neighbour';
  }
  if (trailerIsBefore && nothingFollows) {
    return 'nothing follows';
  }
  if (
    trailerIsBefore &&
    row.neighbourCategory === 'Booster' &&
    neighbourHasAxles
  ) {
    return 'booster follows';
  }
  if (trailerIsAfter && neighbourHasAxles) {
    if (row.neighbourCategory === 'Power Unit') {
      return 'power unit in front';
    }
    // A Mobile Crane counts as the power unit only when it is the power unit under test.
    if (
      row.neighbourCategory === 'Cranes - Mobile' &&
      row.powerUnitCode === POWER_UNIT_CODES.CRANES_MOBILE
    ) {
      return 'power unit in front';
    }
    if (row.neighbourCategory === 'Semi-Trailer') {
      return 'semi-trailer in front';
    }
  }
  throw new Error(
    `Unsupported worksheet neighbour relationship at row ${row.row}: ${row.neighbourCategory}/${row.neighbourAxleType || '(missing axle type)'}; requires explicit mapping`,
  );
}
