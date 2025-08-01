import {
  SelfIssuable,
  SizeDimension,
  PowerUnitWeightDimension,
  TrailerWeightDimension,
} from 'onroute-policy-engine/types';

export type Vehicle = SelfIssuable & {
  type: string;
};

export type VehicleDimensions = Vehicle & {
  trailers: Array<TrailerDimensions>;
  weightDimensions?: Array<PowerUnitWeightDimension>;
};

export type TrailerDimensions = Vehicle & {
  booster: boolean;
  jeep: boolean;
  sizeDimensions?: Array<SizeDimension>;
  sizePermittable?: boolean;
  weightDimensions?: Array<TrailerWeightDimension>;
  weightPermittable?: boolean;
};
