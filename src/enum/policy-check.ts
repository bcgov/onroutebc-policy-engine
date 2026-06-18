export enum PolicyCheckResultType {
  Pass = 'pass',
  Fail = 'fail',
}

export enum PolicyCheckId {
  BoosterAxleLimit = 'booster-axle-limit',
  BridgeFormula = 'bridge-formula',
  CheckPermittableWeight = 'check-permittable-weight',
  DriveJeepLoadEqualization = 'drive-jeep-load-equalization',
  MaxTireLoad = 'max-tire-load',
  MinDriveAxleWeight = 'minimum-drive-axle-weight',
  MinSteerAxleWeight = 'minimum-steer-axle-weight',
  MinTandemSteerAxleWeight = 'minimum-tandem-steer-axle-weight',
  NumberOfAxles = 'number-of-axles',
  NumberOfWheelsPerAxle = 'number-of-wheels',
  TruckTractorWheelbase = 'truck-tractor-wheelbase',
}
