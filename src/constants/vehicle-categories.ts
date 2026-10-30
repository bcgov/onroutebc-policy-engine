export const VEHICLE_CATEGORIES = {
  BOOSTER: 'booster',
  BOOSTER_WHEELERS: 'booster-wheelers',
  DOLLY: 'dolly',
  JEEP: 'jeep',
  JEEP_WHEELERS: 'jeep-wheelers',
  // the MULTI_STEER category is congruent with the ability to add extra axle units, we may need this distinction in future to handle multiple steer axle units that sometimes get unique rules apply to them
  MULTI_STEER: 'multisteer',
  PONY_TRAILER: 'pony',
  POWER_UNIT: 'powerunit',
  PSEUDO: 'pseudo',
  SEMI_TRAILER: 'semi',
  STEERING_TRAILER: 'steering',
  // the TRAILER category is a placeholder category, primarily used for trailers in the STOS dimension set, where categories are not currently defined
  TRAILER: 'trailer',
  WHEELER: 'wheeler',
  WIDE_WHEELERS: 'wide-wheelers',
} as const;
