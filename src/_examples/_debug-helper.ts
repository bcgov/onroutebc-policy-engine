import { Policy } from 'onroute-policy-engine';
import completePolicyConfig from '../_test/policy-config/_current-config.json';

function start() {
  const policy: Policy = new Policy(completePolicyConfig);
  //console.log(JSON.stringify(policy.policyDefinition));

  const allVehicles = policy.getPermittableVehicleTypes('QRFR');
  const powerUnits: any = allVehicles.get('powerUnits');
  const trailers: any = allVehicles.get('trailers');
  console.log('***POWER UNIT TYPES FOR QRFR***');
  console.log(JSON.stringify(Array.from(powerUnits.entries()), null, '   '));
  console.log('***TRAILER TYPES FOR QRFR***');
  console.log(JSON.stringify(Array.from(trailers.entries()), null, '   '));

  /*
  console.log('***ALL POWER UNIT TYPES***');
  const allPowerUnits = policy.getPowerUnitTypes();
  const puArray = Array.from(allPowerUnits.entries());
  puArray.sort((a: any, b: any) => a[0] - b[0]);
  console.log(
    JSON.stringify((puArray), null, '   '),
  );

  console.log('***ALL TRAILER TYPES***');
  const allTrailers = policy.getTrailerTypes();
  console.log(
    JSON.stringify(Array.from(allTrailers.entries()), null, '   '),
  );

  console.log('***ALL COMMODITIES***');
  const allCommodities = policy.getCommodities();
  console.log(
    JSON.stringify(Array.from(allCommodities.entries()), null, '   '),
  );

  console.log('***COMMODITIES FOR STOS***');
  const stosCommodities = policy.getCommodities('STOS');
  console.log(
    JSON.stringify(Array.from(stosCommodities.entries()), null, '   '),
  );

  console.log('***POWER UNITS PERMITTABLE FOR STOS AND EMPTY COMMODITY***');
  const puTypesEmpty = policy.getPermittablePowerUnitTypes('STOS', COMMODITY_CODES.EMPTY);
  console.log(JSON.stringify(Array.from(puTypesEmpty.entries()), null, '   '));

  console.log(
    '***POWER UNITS PERMITTABLE FOR STOS AND BRIDGE BEAMS COMMODITY***',
  );
  const puTypesBridgeBeams = policy.getPermittablePowerUnitTypes(
    'STOS',
    COMMODITY_CODES.BRIDGE_BEAMS,
  );
  console.log(
    JSON.stringify(Array.from(puTypesBridgeBeams.entries()), null, '   '),
  );

  console.log(
    '***PERMITTABLE NEXT VEHICLES WITH EMPTY CONFIGURATION, STOS AND EMPTY***',
  );
  const vehicleTypes1 = policy.getNextPermittableVehicles(
    'STOS',
    COMMODITY_CODES.EMPTY,
    [],
  );
  console.log(JSON.stringify(Array.from(vehicleTypes1.entries()), null, '   '));

  console.log(
    '***PERMITTABLE NEXT VEHICLES WITH TRUCK TRACTOR AND JEEP, STOS AND EMPTY***',
  );
  const vehicleTypes2 = policy.getNextPermittableVehicles('STOS', COMMODITY_CODES.EMPTY, [
    POWER_UNIT_CODES.TRUCK_TRACTORS,
    TRAILER_CODES.JEEPS,
  ]);
  console.log(JSON.stringify(Array.from(vehicleTypes2.entries()), null, '   '));

  console.log(
    '***MAX SIZE FOR TRUCK TRACTOR, JEEP, HIBOEXP, STOS AND EMPTYXX***',
  );
  const sizeDimension = policy.getSizeDimension('STOS', COMMODITY_CODES.EMPTY, [POWER_UNIT_CODES.TRUCK_TRACTORS, TRAILER_CODES.JEEPS, TRAILER_CODES.HIBOYS_EXPANDOS]);
  console.log(JSON.stringify(sizeDimension, null, '   '));

  console.log(
    '***MAX SIZE FOR TRUCK TRACTOR, JEEP, HIBOEXP, STOS AND EMPTYXX IN PEACE***',
  );
  const sizeDimensionPeace = policy.getSizeDimension('STOS', COMMODITY_CODES.EMPTY, [POWER_UNIT_CODES.TRUCK_TRACTORS, TRAILER_CODES.JEEPS, TRAILER_CODES.HIBOYS_EXPANDOS], ['PCE']);
  console.log(JSON.stringify(sizeDimensionPeace, null, '   '));

  console.log(
    '***MAX SIZE FOR TRUCK TRACTOR, JEEP, HIBOEXP, STOS AND EMPTYXX IN PEACE,BC DEFAULT***',
  );
  const sizeDimensionPeaceBC = policy.getSizeDimension('STOS', COMMODITY_CODES.EMPTY, [POWER_UNIT_CODES.TRUCK_TRACTORS, TRAILER_CODES.JEEPS, TRAILER_CODES.HIBOYS_EXPANDOS], ['PCE','BCD']);
  console.log(JSON.stringify(sizeDimensionPeaceBC, null, '   '));
  */
}

start();
