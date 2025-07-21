import { DimensionModifier, SelfIssuable } from 'onroute-policy-engine/types';

export type SingleAxleDimension = {
  legal?: number;
  permittable?: number;
};

export type WeightDimension = SelfIssuable & {
  axles: number;
  modifier?: DimensionModifier;
};

export type PowerUnitWeightDimension = WeightDimension & {
  saLegal?: number;
  saPermittable?: number;
  daLegal?: number;
  daPermittable?: number;
};

export type TrailerWeightDimension = WeightDimension & SingleAxleDimension;

export type DefaultWeightDimensions = {
  powerUnits: Array<PowerUnitWeightDimension>;
  trailers: Array<TrailerWeightDimension>;
};
