export const AXLE_SPREAD_LEGAL_LIMITS = {
  SINGLE: {
    MINIMUM: 0,
    MAXIMUM: 100,
  },
  TANDEM: {
    MINIMUM: 100,
    MAXIMUM: 185,
    SPREAD_TANDEM_SEMI_TRAILER: {
      MINIMUM: 186,
      MAXIMUM: 307,
    },
    DRIVE_AXLE_WITH_SINGLE_AXLE_JEEP: {
      MINIMUM: 240,
      MAXIMUM: 370,
    },
  },

  TRIDEM: {
    MINIMUM: 240,
    MAXIMUM: 280,
    PONY_TRAILER: {
      MAXIMUM: 250,
    },
    SEMI_TRAILER: {
      MAXIMUM: 370,
    },
    POLE_TRAILER: {
      MAXIMUM: 310,
    },
    OILFIELD_BED_TRUCK: {
      MAXIMUM: 310,
    },
  },
};
