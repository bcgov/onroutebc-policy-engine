export type AxleConfiguration = {
  numberOfAxles: number;
  axleSpread?: number;
  // Spacing from the previous axle unit
  interaxleSpacing?: number;
  axleUnitWeight: number;
  numberOfTires?: number;
  tireSize?: number;
};
