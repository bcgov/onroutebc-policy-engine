import { AXLE_SPREAD_LEGAL_LIMITS } from '../constants/axle-spread-legal-limits';
import { POWER_UNIT_CODES } from '../constants/power-unit-codes';
import { isSemiTrailerType } from '../constants/semi-trailer-codes';
import { TRAILER_CODES } from '../constants/trailer-codes';
import { AxleConfiguration } from '../types/axle-configuration';

export function getTandemAxleSpreadThreshold(
  vehicleConfiguration: Array<string>,
  vehicleIndex: number,
  axleConfiguration: Array<AxleConfiguration>,
  axleIndex: number,
): { minCm: number; maxCm: number } {
  const vehicleType = vehicleConfiguration[vehicleIndex];
  const isSpreadTandemSemiTrailer =
    vehicleType === TRAILER_CODES.SEMI_TRAILERS_SPREAD_TANDEMS;
  const isDriveAxle = axleIndex === 1;
  const hasSingleAxleJeep =
    vehicleConfiguration[1] === TRAILER_CODES.JEEPS &&
    axleConfiguration[2].numberOfAxles === 1;

  if (isSpreadTandemSemiTrailer) {
    return {
      minCm: AXLE_SPREAD_LEGAL_LIMITS.TANDEM.SPREAD_TANDEM_SEMI_TRAILER.MINIMUM,
      maxCm: AXLE_SPREAD_LEGAL_LIMITS.TANDEM.SPREAD_TANDEM_SEMI_TRAILER.MAXIMUM,
    };
  }

  // Tandem Drive with Single Axle Jeep Bridge Formula Exception
  if (isDriveAxle && hasSingleAxleJeep) {
    return {
      minCm:
        AXLE_SPREAD_LEGAL_LIMITS.TANDEM.DRIVE_AXLE_WITH_SINGLE_AXLE_JEEP
          .MINIMUM,
      maxCm:
        AXLE_SPREAD_LEGAL_LIMITS.TANDEM.DRIVE_AXLE_WITH_SINGLE_AXLE_JEEP
          .MAXIMUM,
    };
  }

  return {
    minCm: AXLE_SPREAD_LEGAL_LIMITS.TANDEM.MINIMUM,
    maxCm: AXLE_SPREAD_LEGAL_LIMITS.TANDEM.MAXIMUM,
  };
}

export function getTridemAxleSpreadThreshold(
  vehicleConfiguration: Array<string>,
  vehicleIndex: number,
  axleConfiguration: Array<AxleConfiguration>,
  axleIndex: number,
): { minCm: number; maxCm: number } {
  const vehicleType = vehicleConfiguration[vehicleIndex];
  const isDriveAxle = axleIndex === 1;
  const isTridemDrive = axleConfiguration[1].numberOfAxles === 3;
  const isPonyTrailer = vehicleType === TRAILER_CODES.PONY_TRAILERS;
  const isPoleTrailer = vehicleType === TRAILER_CODES.POLE_TRAILERS;
  const isOilfieldBedTruck =
    vehicleType === POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS;
  const isPowerUnitTruckTractor =
    vehicleConfiguration[0] === POWER_UNIT_CODES.TRUCK_TRACTORS;

  if (isOilfieldBedTruck && isDriveAxle) {
    return {
      minCm: AXLE_SPREAD_LEGAL_LIMITS.TRIDEM.MINIMUM,
      maxCm: AXLE_SPREAD_LEGAL_LIMITS.TRIDEM.OILFIELD_BED_TRUCK.MAXIMUM,
    };
  }

  if (isPonyTrailer) {
    return {
      minCm: AXLE_SPREAD_LEGAL_LIMITS.TRIDEM.MINIMUM,
      maxCm: AXLE_SPREAD_LEGAL_LIMITS.TRIDEM.PONY_TRAILER.MAXIMUM,
    };
  }

  if (isPowerUnitTruckTractor && isSemiTrailerType(vehicleType)) {
    return {
      minCm: AXLE_SPREAD_LEGAL_LIMITS.TRIDEM.MINIMUM,
      maxCm: AXLE_SPREAD_LEGAL_LIMITS.TRIDEM.SEMI_TRAILER.MAXIMUM,
    };
  }

  if (isPowerUnitTruckTractor && isTridemDrive && isPoleTrailer) {
    return {
      minCm: AXLE_SPREAD_LEGAL_LIMITS.TRIDEM.MINIMUM,
      maxCm: AXLE_SPREAD_LEGAL_LIMITS.TRIDEM.POLE_TRAILER.MAXIMUM,
    };
  }

  return {
    minCm: AXLE_SPREAD_LEGAL_LIMITS.TRIDEM.MINIMUM,
    maxCm: AXLE_SPREAD_LEGAL_LIMITS.TRIDEM.MAXIMUM,
  };
}

export function getAxleSpreadThreshold(
  vehicleConfiguration: Array<string>,
  axleUnitVehicleIndexes: Array<number>,
  axleConfiguration: Array<AxleConfiguration>,
  axleIndex: number,
): { minCm: number; maxCm: number } | undefined {
  const axleUnit = axleConfiguration[axleIndex];
  if (!Number.isFinite(axleUnit.axleSpread)) {
    return undefined;
  }

  const vehicleIndex = axleUnitVehicleIndexes[axleIndex];
  const numberOfAxles = axleUnit.numberOfAxles;

  const isSingleAxle = numberOfAxles === 1;
  const isTandemAxle = numberOfAxles === 2;
  const isTridemAxle = numberOfAxles === 3;

  if (isSingleAxle) {
    // the ASW table specifically disables the axleSpread input for single axle unit types, so this code will never run, but have left these in place in case something changes
    return {
      minCm: AXLE_SPREAD_LEGAL_LIMITS.SINGLE.MINIMUM,
      maxCm: AXLE_SPREAD_LEGAL_LIMITS.SINGLE.MAXIMUM,
    };
  }

  if (isTandemAxle) {
    return getTandemAxleSpreadThreshold(
      vehicleConfiguration,
      vehicleIndex,
      axleConfiguration,
      axleIndex,
    );
  }

  if (isTridemAxle) {
    return getTridemAxleSpreadThreshold(
      vehicleConfiguration,
      vehicleIndex,
      axleConfiguration,
      axleIndex,
    );
  }

  return undefined;
}
