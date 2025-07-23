import {
  SelfIssuable,
  SizeDimension,
  PowerUnitWeightDimension,
  TrailerWeightDimension,
} from 'onroute-policy-engine/types';

export type Vehicle = SelfIssuable & {
  type: string;
};

export type VehicleSizeConfiguration = Vehicle & {
  trailers: Array<TrailerSize>;
};

export type VehicleWeightConfiguration = Vehicle & {
  weightDimensions?: Array<PowerUnitWeightDimension>;
  additionalAxleSubType?: string;
  trailers: Array<TrailerWeight>;
};

export type TrailerSize = Vehicle & {
  sizeDimensions?: Array<SizeDimension>;
  jeep: boolean;
  booster: boolean;
};

export type TrailerWeight = Vehicle & {
  weightDimensions?: Array<TrailerWeightDimension>;
  additionalAxleSubType?: string;
  jeep: boolean;
  booster: boolean;
};
