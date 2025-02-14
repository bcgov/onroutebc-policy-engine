import {
  IdentifiedObject,
  SizeDimension,
  PowerUnitWeightDimension,
  TrailerWeightDimension,
} from 'onroute-policy-engine/types';
import { ConditionRequirement } from './permit-condition';

export type VehicleType = IdentifiedObject & {
  category: string;
  defaultSizeDimensions?: SizeDimension;
  ignoreForSizeDimensions?: boolean;
  isLcv?: boolean;
  conditions?: Array<ConditionRequirement>;
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
