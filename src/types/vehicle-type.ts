import {
  ConditionRequirement,
  IdentifiedObject,
  SizeDimension,
  PowerUnitWeightDimension,
  TrailerWeightDimension,
} from 'onroute-policy-engine/types';

export type VehicleType = IdentifiedObject & {
  category: string;
  defaultSizeDimensions?: SizeDimension;
  ignoreForSizeDimensions?: boolean;
  ignoreForAxleCalculation?: boolean;
  isLcv?: boolean;
  conditions?: Array<ConditionRequirement>;
  additionalAxleSubType?: string;
};

export type PowerUnitType = VehicleType & {
  defaultWeightDimensions?: Array<PowerUnitWeightDimension>;
  displayCodePrefix?: string;
  displayCodeSteerAxle?: string;
  displayCodeDriveAxle?: string;
};

export type TrailerType = VehicleType & {
  defaultWeightDimensions?: Array<TrailerWeightDimension>;
  displayCode?: string;
};

export type VehicleTypes = {
  powerUnitTypes: Array<PowerUnitType>;
  trailerTypes: Array<TrailerType>;
};
