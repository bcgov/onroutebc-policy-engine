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
  isLcv?: boolean;
  conditions?: Array<ConditionRequirement>;
  additionalAxleSubType?: string;
};

export type PowerUnitType = VehicleType & {
  defaultWeightDimensions?: Array<PowerUnitWeightDimension>;
};

export type TrailerType = VehicleType & {
  defaultWeightDimensions?: Array<TrailerWeightDimension>;
};

export type VehicleTypes = {
  powerUnitTypes: Array<PowerUnitType>;
  trailerTypes: Array<TrailerType>;
};
