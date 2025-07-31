import {
  IdentifiedObject,
  VehicleDimensions,
} from 'onroute-policy-engine/types';

export type Commodity = IdentifiedObject & {
  powerUnits: Array<VehicleDimensions>;
};
