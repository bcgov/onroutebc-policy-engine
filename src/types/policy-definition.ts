import {
  GeographicRegion,
  PermitType,
  DefaultWeightDimensions,
  VehicleTypes,
  Commodity,
  SizeDimension,
  VehicleCategories,
  RangeMatrix,
  BridgeCalculationConstants,
  PermitConditionDefinition,
} from 'onroute-policy-engine/types';
import { RuleProperties } from 'json-rules-engine';

export type PolicyDefinition = {
  minPEVersion: string;
  geographicRegions: Array<GeographicRegion>;
  permitTypes: Array<PermitType>;
  commonRules: Array<RuleProperties>;
  globalWeightDefaults: DefaultWeightDimensions;
  globalSizeDefaults: SizeDimension;
  vehicleCategories: VehicleCategories;
  vehicleTypes: VehicleTypes;
  commodities: Array<Commodity>;
  rangeMatrices?: Array<RangeMatrix>;
  bridgeCalculationConstants: BridgeCalculationConstants;
  conditions?: Array<PermitConditionDefinition>;
};
