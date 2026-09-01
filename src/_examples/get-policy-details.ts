import { Policy } from 'onroute-policy-engine';
import completePolicyConfig from '../_test/policy-config/_current-config.json';
import { COMMODITY_CODES } from '../constants/commodity-codes';
import { POWER_UNIT_CODES } from '../constants/power-unit-codes';
import { TRAILER_CODES } from '../constants/trailer-codes';
import { PERMIT_CODES } from '../constants/permit-codes';

function start() {
  const policy: Policy = new Policy(completePolicyConfig);

  console.log('***ALL PERMIT TYPES***');
  const allPermitTypes = policy.getPermitTypes();
  console.log(
    JSON.stringify(Array.from(allPermitTypes.entries()), null, '   '),
  );

  console.log('***ALL COMMODITIES***');
  const allCommodities = policy.getCommodities();
  console.log(
    JSON.stringify(Array.from(allCommodities.entries()), null, '   '),
  );

  console.log('***COMMODITIES FOR STOS***');
  const stosCommodities = policy.getCommodities(PERMIT_CODES.SINGLE_TRIP_OVERSIZE);
  console.log(
    JSON.stringify(Array.from(stosCommodities.entries()), null, '   '),
  );

  console.log('***POWER UNITS PERMITTABLE FOR STOS AND EMPTY COMMODITY***');
  const puTypesEmpty = policy.getPermittablePowerUnitTypes(
    PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
    COMMODITY_CODES.EMPTY,
  );
  console.log(JSON.stringify(Array.from(puTypesEmpty.entries()), null, '   '));

  console.log(
    '***POWER UNITS PERMITTABLE FOR STOS AND BRIDGE BEAMS COMMODITY***',
  );
  const puTypesBridgeBeams = policy.getPermittablePowerUnitTypes(
    PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
    COMMODITY_CODES.BRIDGE_BEAMS,
  );
  console.log(
    JSON.stringify(Array.from(puTypesBridgeBeams.entries()), null, '   '),
  );

  console.log(
    '***PERMITTABLE NEXT VEHICLES WITH EMPTY CONFIGURATION, STOS AND EMPTY***',
  );
  const vehicleTypes1 = policy.getNextPermittableVehicles(
    PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
    COMMODITY_CODES.EMPTY,
    [],
  );
  console.log(JSON.stringify(Array.from(vehicleTypes1.entries()), null, '   '));

  console.log(
    '***PERMITTABLE NEXT VEHICLES WITH TRUCK TRACTOR AND JEEP, STOS AND EMPTY***',
  );
  const vehicleTypes2 = policy.getNextPermittableVehicles(
    PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
    COMMODITY_CODES.EMPTY,
    [POWER_UNIT_CODES.TRUCK_TRACTORS, TRAILER_CODES.JEEPS],
  );
  console.log(JSON.stringify(Array.from(vehicleTypes2.entries()), null, '   '));

  console.log(
    '***MAX SIZE FOR TRUCK TRACTOR, JEEP, HIBOEXP, STOS AND EMPTYXX***',
  );
  const sizeDimension = policy.getSizeDimension(PERMIT_CODES.SINGLE_TRIP_OVERSIZE, COMMODITY_CODES.EMPTY, [
    POWER_UNIT_CODES.TRUCK_TRACTORS,
    TRAILER_CODES.JEEPS,
    TRAILER_CODES.HIBOYS_EXPANDOS,
  ]);
  console.log(JSON.stringify(sizeDimension, null, '   '));

  console.log(
    '***MAX SIZE FOR TRUCK TRACTOR, JEEP, HIBOEXP, STOS AND EMPTYXX IN PEACE***',
  );
  const sizeDimensionPeace = policy.getSizeDimension(
    PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
    COMMODITY_CODES.EMPTY,
    [
      POWER_UNIT_CODES.TRUCK_TRACTORS,
      TRAILER_CODES.JEEPS,
      TRAILER_CODES.HIBOYS_EXPANDOS,
    ],
    ['PCE'],
  );
  console.log(JSON.stringify(sizeDimensionPeace, null, '   '));

  console.log(
    '***MAX SIZE FOR TRUCK TRACTOR, JEEP, HIBOEXP, STOS AND EMPTYXX IN PEACE,BC DEFAULT***',
  );
  const sizeDimensionPeaceBC = policy.getSizeDimension(
    PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
    COMMODITY_CODES.EMPTY,
    [
      POWER_UNIT_CODES.TRUCK_TRACTORS,
      TRAILER_CODES.JEEPS,
      TRAILER_CODES.HIBOYS_EXPANDOS,
    ],
    ['PCE', 'BCD'],
  );
  console.log(JSON.stringify(sizeDimensionPeaceBC, null, '   '));

  console.log(
    '***MAX SIZE FOR TRUCK TRACTOR, JEEP, STWHELR, STOS AND EMPTYXX IN BC DEFAULT***',
  );
  const sizeDimensionBC = policy.getSizeDimension(
    PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
    COMMODITY_CODES.EMPTY,
    [
      POWER_UNIT_CODES.TRUCK_TRACTORS,
      TRAILER_CODES.JEEPS,
      TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
    ],
    ['BCD'],
  );
  console.log(JSON.stringify(sizeDimensionBC, null, '   '));

  console.log(
    '***MAX SIZE FOR TRUCK TRACTOR, JEEP, STWHELR, STOS AND EMPTYXX IN PEACE***',
  );
  const sizeDimensionStwhelrPce = policy.getSizeDimension(
    PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
    COMMODITY_CODES.EMPTY,
    [
      POWER_UNIT_CODES.TRUCK_TRACTORS,
      TRAILER_CODES.JEEPS,
      TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
    ],
    ['PCE'],
  );
  console.log(JSON.stringify(sizeDimensionStwhelrPce, null, '   '));
}

start();
