import {
  IdentifiedObject,
  VehicleSizeConfiguration,
  VehicleWeightConfiguration,
} from 'onroute-policy-engine/types';

export type Commodity = IdentifiedObject & {
  size?: CommoditySize;
  weight?: CommodityWeight;
};

export type CommoditySize = {
  powerUnits?: Array<VehicleSizeConfiguration>;
};

export type CommodityWeight = {
  powerUnits?: Array<VehicleWeightConfiguration>;
};
