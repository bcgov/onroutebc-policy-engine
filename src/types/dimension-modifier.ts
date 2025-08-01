import { SelfIssuable } from 'onroute-policy-engine/types';

export type DimensionModifier = SelfIssuable & {
  position: string;
  type?: string;
  category?: string;
  axles?: number;
  minInterAxleSpacing?: number;
  maxInterAxleSpacing?: number;
};

export type VehicleRelatives = {
  firstType: string;
  lastType?: string;
  nextType?: string | null;
  prevType?: string | null;
  firstCategory?: string | null;
  lastCategory?: string | null;
  nextCategory?: string | null;
  prevCategory?: string | null;
};
