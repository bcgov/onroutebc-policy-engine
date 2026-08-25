export const AXLE_UNIT_TYPES = {
  SINGLE: 'SINGLE',
  TANDEM: 'TANDEM',
  TRIDEM: 'TRIDEM',
} as const;

export type AxleUnitType =
  (typeof AXLE_UNIT_TYPES)[keyof typeof AXLE_UNIT_TYPES];
