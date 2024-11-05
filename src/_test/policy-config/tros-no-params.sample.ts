import { PolicyDefinition } from '../../types/policy-definition';

export const trosNoParamsSample: PolicyDefinition = {
  version: '2024.03.18.001',
  geographicRegions: [],
  bridgeCalculationConstants: {
    minWeight: 18000,
    multiplier: 30,
  },
  commonRules: [],
  permitTypes: [
    {
      id: 'TROS',
      name: 'Term Oversize',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [],
      rules: [
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: '$.vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
          },
        },
      ],
    },
  ],
  globalWeightDefaults: {
    powerUnits: [],
    trailers: [],
  },
  globalSizeDefaults: {
    fp: 3,
    rp: 6.5,
    w: 2.6,
    h: 4.15,
    l: 31,
  },
  vehicleCategories: {
    trailerCategories: [],
    powerUnitCategories: [],
  },
  vehicleTypes: {
    powerUnitTypes: [],
    trailerTypes: [],
  },
  commodities: [],
};
