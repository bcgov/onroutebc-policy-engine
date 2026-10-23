import { PolicyDefinition } from 'onroute-policy-engine/types';
import { PERMIT_CODES } from '../../constants/permit-codes';
import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { TRAILER_CODES } from '../../constants/trailer-codes';
import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { VEHICLE_CATEGORIES } from '../../constants/vehicle-categories';
import {
  RelativePosition,
  ValidationResultCode,
  ValidationResultType,
} from '../../enum';
import { GEOGRAPHIC_REGIONS } from '../../constants/geographic-regions';

export const data: PolicyDefinition = {
  minPEVersion: '2.0.0',
  geographicRegions: [
    {
      id: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
      name: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.name,
    },
    {
      id: GEOGRAPHIC_REGIONS.ELK_VALLEY.id,
      name: GEOGRAPHIC_REGIONS.ELK_VALLEY.name,
    },
    {
      id: GEOGRAPHIC_REGIONS.YOHO.id,
      name: GEOGRAPHIC_REGIONS.YOHO.name,
    },
    {
      id: GEOGRAPHIC_REGIONS.PEACE.id,
      name: GEOGRAPHIC_REGIONS.PEACE.name,
    },
  ],
  rangeMatrices: [
    {
      id: 'annualFeeCV',
      name: 'Annual licensing fee for commercial vehicle',
      matrix: [
        {
          min: 0,
          max: 500,
          value: 42,
        },
        {
          min: 501,
          max: 1000,
          value: 49,
        },
        {
          min: 1001,
          max: 1500,
          value: 60,
        },
        {
          min: 1501,
          max: 2000,
          value: 74,
        },
        {
          min: 2001,
          max: 2500,
          value: 85,
        },
        {
          min: 2501,
          max: 3000,
          value: 97,
        },
        {
          min: 3001,
          max: 3500,
          value: 108,
        },
        {
          min: 3501,
          max: 4000,
          value: 127,
        },
        {
          min: 4001,
          max: 4500,
          value: 147,
        },
        {
          min: 4501,
          max: 5000,
          value: 173,
        },
        {
          min: 5001,
          max: 5500,
          value: 193,
        },
        {
          min: 5501,
          max: 6000,
          value: 213,
        },
        {
          min: 6001,
          max: 6500,
          value: 230,
        },
        {
          min: 6501,
          max: 7000,
          value: 250,
        },
        {
          min: 7001,
          max: 7500,
          value: 266,
        },
        {
          min: 7501,
          max: 8000,
          value: 292,
        },
        {
          min: 8001,
          max: 8500,
          value: 320,
        },
        {
          min: 8501,
          max: 9000,
          value: 347,
        },
        {
          min: 9001,
          max: 9500,
          value: 376,
        },
        {
          min: 9501,
          max: 10000,
          value: 395,
        },
        {
          min: 10001,
          max: 10500,
          value: 416,
        },
        {
          min: 10501,
          max: 11000,
          value: 437,
        },
        {
          min: 11001,
          max: 11500,
          value: 450,
        },
        {
          min: 11501,
          max: 12000,
          value: 469,
        },
        {
          min: 12001,
          max: 12500,
          value: 493,
        },
        {
          min: 12501,
          max: 13000,
          value: 507,
        },
        {
          min: 13001,
          max: 13500,
          value: 532,
        },
        {
          min: 13501,
          max: 14000,
          value: 559,
        },
        {
          min: 14001,
          max: 14500,
          value: 586,
        },
        {
          min: 14501,
          max: 15000,
          value: 613,
        },
        {
          min: 15001,
          max: 15500,
          value: 645,
        },
        {
          min: 15501,
          max: 16000,
          value: 687,
        },
        {
          min: 16001,
          max: 16500,
          value: 729,
        },
        {
          min: 16501,
          max: 17000,
          value: 769,
        },
        {
          min: 17001,
          max: 17500,
          value: 814,
        },
        {
          min: 17501,
          max: 18000,
          value: 846,
        },
        {
          min: 18001,
          max: 18500,
          value: 870,
        },
        {
          min: 18501,
          max: 19000,
          value: 899,
        },
        {
          min: 19001,
          max: 19500,
          value: 927,
        },
        {
          min: 19501,
          max: 20000,
          value: 954,
        },
        {
          min: 20001,
          max: 20500,
          value: 987,
        },
        {
          min: 20501,
          max: 21000,
          value: 1014,
        },
        {
          min: 21001,
          max: 21500,
          value: 1041,
        },
        {
          min: 21501,
          max: 22000,
          value: 1068,
        },
        {
          min: 22001,
          max: 22500,
          value: 1095,
        },
        {
          min: 22501,
          max: 23000,
          value: 1123,
        },
        {
          min: 23001,
          max: 23500,
          value: 1152,
        },
        {
          min: 23501,
          max: 24000,
          value: 1182,
        },
        {
          min: 24001,
          max: 24500,
          value: 1212,
        },
        {
          min: 24501,
          max: 25000,
          value: 1252,
        },
        {
          min: 25001,
          max: 25500,
          value: 1298,
        },
        {
          min: 25501,
          max: 26000,
          value: 1340,
        },
        {
          min: 26001,
          max: 26500,
          value: 1381,
        },
        {
          min: 26501,
          max: 27000,
          value: 1410,
        },
        {
          min: 27001,
          max: 27500,
          value: 1439,
        },
        {
          min: 27501,
          max: 28000,
          value: 1465,
        },
        {
          min: 28001,
          max: 28500,
          value: 1495,
        },
        {
          min: 28501,
          max: 29000,
          value: 1521,
        },
        {
          min: 29001,
          max: 29500,
          value: 1550,
        },
        {
          min: 29501,
          max: 30000,
          value: 1581,
        },
        {
          min: 30001,
          max: 31000,
          value: 1608,
        },
        {
          min: 31001,
          max: 32000,
          value: 1661,
        },
        {
          min: 32001,
          max: 33000,
          value: 1714,
        },
        {
          min: 33001,
          max: 34000,
          value: 1769,
        },
        {
          min: 34001,
          max: 35000,
          value: 1824,
        },
        {
          min: 35001,
          max: 36000,
          value: 1910,
        },
        {
          min: 36001,
          max: 37000,
          value: 2039,
        },
        {
          min: 37001,
          max: 38000,
          value: 2110,
        },
        {
          min: 38001,
          max: 39000,
          value: 2182,
        },
        {
          min: 39001,
          max: 40000,
          value: 2252,
        },
        {
          min: 40001,
          max: 41000,
          value: 2324,
        },
        {
          min: 41001,
          max: 42000,
          value: 2398,
        },
        {
          min: 42001,
          max: 43000,
          value: 2471,
        },
        {
          min: 43001,
          max: 44000,
          value: 2540,
        },
        {
          min: 44001,
          max: 45000,
          value: 2612,
        },
        {
          min: 45001,
          max: 46000,
          value: 2718,
        },
        {
          min: 46001,
          max: 47000,
          value: 2828,
        },
        {
          min: 47001,
          max: 48000,
          value: 2901,
        },
        {
          min: 48001,
          max: 49000,
          value: 2971,
        },
        {
          min: 49001,
          max: 50000,
          value: 3044,
        },
        {
          min: 50001,
          max: 51000,
          value: 3093,
        },
        {
          min: 51001,
          max: 52000,
          value: 3160,
        },
        {
          min: 52001,
          max: 53000,
          value: 3226,
        },
        {
          min: 53001,
          max: 54000,
          value: 3291,
        },
        {
          min: 54001,
          max: 55000,
          value: 3357,
        },
        {
          min: 55001,
          max: 56000,
          value: 3423,
        },
        {
          min: 56001,
          max: 57000,
          value: 3488,
        },
        {
          min: 57001,
          max: 58000,
          value: 3553,
        },
        {
          min: 58001,
          max: 59000,
          value: 3619,
        },
        {
          min: 59001,
          max: 60000,
          value: 3685,
        },
        {
          min: 60001,
          max: 61000,
          value: 3749,
        },
        {
          min: 61001,
          max: 62000,
          value: 3815,
        },
        {
          min: 62001,
          max: 63000,
          value: 3880,
        },
        {
          min: 63001,
          max: 63500,
          value: 3946,
        },
      ],
    },
    {
      id: 'annualFeePassenger',
      name: 'Annual licensing fee for commercial passenger vehicle',
      matrix: [
        {
          min: 0,
          max: 500,
          value: 40,
        },
        {
          min: 501,
          max: 1000,
          value: 47,
        },
        {
          min: 1001,
          max: 1500,
          value: 57,
        },
        {
          min: 1501,
          max: 2000,
          value: 70,
        },
        {
          min: 2001,
          max: 2500,
          value: 81,
        },
        {
          min: 2501,
          max: 3000,
          value: 92,
        },
        {
          min: 3001,
          max: 3500,
          value: 103,
        },
        {
          min: 3501,
          max: 4000,
          value: 121,
        },
        {
          min: 4001,
          max: 4500,
          value: 140,
        },
        {
          min: 4501,
          max: 5000,
          value: 165,
        },
        {
          min: 5001,
          max: 5500,
          value: 184,
        },
        {
          min: 5501,
          max: 6000,
          value: 203,
        },
        {
          min: 6001,
          max: 6500,
          value: 219,
        },
        {
          min: 6501,
          max: 7000,
          value: 238,
        },
        {
          min: 7001,
          max: 7500,
          value: 253,
        },
        {
          min: 7501,
          max: 8000,
          value: 278,
        },
        {
          min: 8001,
          max: 8500,
          value: 305,
        },
        {
          min: 8501,
          max: 9000,
          value: 330,
        },
        {
          min: 9001,
          max: 9500,
          value: 358,
        },
        {
          min: 9501,
          max: 10000,
          value: 376,
        },
        {
          min: 10001,
          max: 10500,
          value: 396,
        },
        {
          min: 10501,
          max: 11000,
          value: 416,
        },
        {
          min: 11001,
          max: 11500,
          value: 429,
        },
        {
          min: 11501,
          max: 12000,
          value: 447,
        },
        {
          min: 12001,
          max: 12500,
          value: 465,
        },
        {
          min: 12501,
          max: 13000,
          value: 478,
        },
        {
          min: 13001,
          max: 13500,
          value: 501,
        },
        {
          min: 13501,
          max: 14000,
          value: 527,
        },
        {
          min: 14001,
          max: 14500,
          value: 552,
        },
        {
          min: 14501,
          max: 15000,
          value: 578,
        },
        {
          min: 15001,
          max: 15500,
          value: 608,
        },
        {
          min: 15501,
          max: 16000,
          value: 648,
        },
        {
          min: 16001,
          max: 16500,
          value: 687,
        },
        {
          min: 16501,
          max: 17000,
          value: 725,
        },
        {
          min: 17001,
          max: 17500,
          value: 768,
        },
        {
          min: 17501,
          max: 18000,
          value: 797,
        },
        {
          min: 18001,
          max: 18500,
          value: 820,
        },
        {
          min: 18501,
          max: 19000,
          value: 848,
        },
        {
          min: 19001,
          max: 19500,
          value: 873,
        },
        {
          min: 19501,
          max: 20000,
          value: 899,
        },
        {
          min: 20001,
          max: 20500,
          value: 930,
        },
        {
          min: 20501,
          max: 21000,
          value: 955,
        },
        {
          min: 21001,
          max: 21500,
          value: 981,
        },
        {
          min: 21501,
          max: 22000,
          value: 1007,
        },
        {
          min: 22001,
          max: 22500,
          value: 1032,
        },
        {
          min: 22501,
          max: 23000,
          value: 1058,
        },
        {
          min: 23001,
          max: 23500,
          value: 1086,
        },
        {
          min: 23501,
          max: 24000,
          value: 1114,
        },
        {
          min: 24001,
          max: 24500,
          value: 1142,
        },
        {
          min: 24501,
          max: 25000,
          value: 1180,
        },
        {
          min: 25001,
          max: 25500,
          value: 1224,
        },
        {
          min: 25501,
          max: 26000,
          value: 1263,
        },
        {
          min: 26001,
          max: 26500,
          value: 1302,
        },
        {
          min: 26501,
          max: 27000,
          value: 1329,
        },
        {
          min: 27001,
          max: 27500,
          value: 1356,
        },
        {
          min: 27501,
          max: 28000,
          value: 1381,
        },
        {
          min: 28001,
          max: 28500,
          value: 1409,
        },
        {
          min: 28501,
          max: 29000,
          value: 1433,
        },
        {
          min: 29001,
          max: 29500,
          value: 1461,
        },
        {
          min: 29501,
          max: 30000,
          value: 1490,
        },
        {
          min: 30001,
          max: 31000,
          value: 1516,
        },
        {
          min: 31001,
          max: 32000,
          value: 1569,
        },
        {
          min: 32001,
          max: 33000,
          value: 1621,
        },
        {
          min: 33001,
          max: 34000,
          value: 1676,
        },
        {
          min: 34001,
          max: 35000,
          value: 1730,
        },
        {
          min: 35001,
          max: 36000,
          value: 1815,
        },
        {
          min: 36001,
          max: 37000,
          value: 1943,
        },
        {
          min: 37001,
          max: 38000,
          value: 2013,
        },
        {
          min: 38001,
          max: 39000,
          value: 2084,
        },
        {
          min: 39001,
          max: 40000,
          value: 2154,
        },
        {
          min: 40001,
          max: 41000,
          value: 2225,
        },
        {
          min: 41001,
          max: 42000,
          value: 2298,
        },
        {
          min: 42001,
          max: 43000,
          value: 2370,
        },
        {
          min: 43001,
          max: 44000,
          value: 2439,
        },
        {
          min: 44001,
          max: 45000,
          value: 2510,
        },
        {
          min: 45001,
          max: 46000,
          value: 2615,
        },
        {
          min: 46001,
          max: 47000,
          value: 2724,
        },
        {
          min: 47001,
          max: 48000,
          value: 2796,
        },
        {
          min: 48001,
          max: 49000,
          value: 2865,
        },
        {
          min: 49001,
          max: 50000,
          value: 2937,
        },
        {
          min: 50001,
          max: 51000,
          value: 2986,
        },
        {
          min: 51001,
          max: 52000,
          value: 3052,
        },
        {
          min: 52001,
          max: 53000,
          value: 3117,
        },
        {
          min: 53001,
          max: 54000,
          value: 3182,
        },
        {
          min: 54001,
          max: 55000,
          value: 3247,
        },
        {
          min: 55001,
          max: 56000,
          value: 3312,
        },
        {
          min: 56001,
          max: 57000,
          value: 3377,
        },
        {
          min: 57001,
          max: 58000,
          value: 3441,
        },
        {
          min: 58001,
          max: 59000,
          value: 3506,
        },
        {
          min: 59001,
          max: 60000,
          value: 3572,
        },
        {
          min: 60001,
          max: 61000,
          value: 3635,
        },
        {
          min: 61001,
          max: 62000,
          value: 3700,
        },
        {
          min: 62001,
          max: 63000,
          value: 3765,
        },
        {
          min: 63001,
          max: 63500,
          value: 3830,
        },
      ],
    },
    {
      id: 'annualFeeIndustrial',
      name: 'Annual licensing fee for an industrial machine',
      matrix: [
        {
          min: 0,
          max: 2000,
          value: 45,
        },
        {
          min: 2001,
          max: 5000,
          value: 69,
        },
        {
          min: 5001,
          max: 7000,
          value: 110,
        },
        {
          min: 7001,
          max: 9000,
          value: 164,
        },
        {
          min: 9001,
          max: 11000,
          value: 216,
        },
        {
          min: 11001,
          value: 260,
        },
      ],
    },
    {
      id: 'annualFeeFarm',
      name: 'Annual licensing fee for farm vehicle',
      matrix: [
        {
          min: 0,
          max: 500,
          value: 30,
        },
        {
          min: 501,
          max: 1000,
          value: 40,
        },
        {
          min: 1001,
          max: 1500,
          value: 47,
        },
        {
          min: 1501,
          max: 2000,
          value: 55,
        },
        {
          min: 2001,
          max: 2500,
          value: 77,
        },
        {
          min: 2501,
          max: 3000,
          value: 101,
        },
        {
          min: 3001,
          max: 3500,
          value: 142,
        },
        {
          min: 3501,
          max: 4000,
          value: 181,
        },
        {
          min: 4001,
          max: 4500,
          value: 207,
        },
        {
          min: 4501,
          max: 5000,
          value: 243,
        },
        {
          min: 5001,
          max: 5500,
          value: 278,
        },
        {
          min: 5501,
          max: 6000,
          value: 322,
        },
        {
          min: 6001,
          max: 6500,
          value: 355,
        },
        {
          min: 6501,
          max: 7000,
          value: 396,
        },
        {
          min: 7001,
          max: 7500,
          value: 427,
        },
        {
          min: 7501,
          max: 8000,
          value: 473,
        },
        {
          min: 8001,
          max: 8500,
          value: 524,
        },
        {
          min: 8501,
          max: 9000,
          value: 558,
        },
        {
          min: 9001,
          max: 9500,
          value: 596,
        },
        {
          min: 9501,
          max: 10000,
          value: 633,
        },
        {
          min: 10001,
          max: 10500,
          value: 669,
        },
        {
          min: 10501,
          max: 11000,
          value: 711,
        },
        {
          min: 11001,
          max: 11500,
          value: 744,
        },
        {
          min: 11501,
          max: 12000,
          value: 784,
        },
        {
          min: 12001,
          max: 12500,
          value: 824,
        },
        {
          min: 12501,
          max: 13000,
          value: 863,
        },
        {
          min: 13001,
          max: 13500,
          value: 883,
        },
        {
          min: 13501,
          max: 14000,
          value: 899,
        },
        {
          min: 14001,
          max: 14500,
          value: 919,
        },
        {
          min: 14501,
          max: 15000,
          value: 940,
        },
        {
          min: 15001,
          max: 15500,
          value: 960,
        },
        {
          min: 15501,
          max: 16000,
          value: 979,
        },
        {
          min: 16001,
          max: 16500,
          value: 997,
        },
        {
          min: 16501,
          max: 17000,
          value: 1017,
        },
        {
          min: 17001,
          max: 17500,
          value: 1036,
        },
        {
          min: 17501,
          max: 18000,
          value: 1056,
        },
        {
          min: 18001,
          max: 18500,
          value: 1076,
        },
        {
          min: 18501,
          max: 19000,
          value: 1096,
        },
        {
          min: 19001,
          max: 19500,
          value: 1114,
        },
        {
          min: 19501,
          max: 20000,
          value: 1134,
        },
        {
          min: 20001,
          max: 20500,
          value: 1154,
        },
        {
          min: 20501,
          max: 21000,
          value: 1174,
        },
        {
          min: 21001,
          max: 21500,
          value: 1192,
        },
        {
          min: 21501,
          max: 22000,
          value: 1211,
        },
        {
          min: 22001,
          max: 22500,
          value: 1231,
        },
        {
          min: 22501,
          max: 23000,
          value: 1251,
        },
        {
          min: 23001,
          max: 23500,
          value: 1270,
        },
        {
          min: 23501,
          max: 24000,
          value: 1289,
        },
        {
          min: 24001,
          max: 24400,
          value: 1309,
        },
      ],
    },
  ],
  bridgeCalculationConstants: {
    minWeight: 18000,
    multiplier: 30,
  },
  commonRules: [
    {
      conditions: {
        not: {
          fact: 'permitData',
          path: 'companyName',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Company is required',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.companyName',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData',
          path: 'contactDetails.firstName',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Contact first name is required',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.contactDetails.firstName',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData',
          path: 'contactDetails.lastName',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Contact last name is required',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.contactDetails.lastName',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData',
          path: 'contactDetails.phone1',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Contact phone number is required',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.contactDetails.phone1',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData',
          path: 'contactDetails.email',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Company contact email is required',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.contactDetails.email',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'permitData',
            path: '$.startDate',
            operator: 'dateLessThan',
            value: {
              fact: 'validationDate',
            },
          },
        ],
      },
      event: {
        type: 'violation',
        params: {
          message: 'Permit start date cannot be in the past',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.startDate',
        },
      },
    },
    {
      conditions: {
        all: [
          {
            not: {
              fact: 'permitType',
              path: '$permitType',
              operator: 'equal',
              value: PERMIT_CODES.HIGHWAY_CROSSING,
            },
          },
          {
            fact: 'daysBetween',
            operator: 'greaterThan',
            value: 14,
            params: {
              dateFrom: {
                fact: 'validationDate',
              },
              dateTo: {
                fact: 'permitData',
                path: '$.startDate',
              },
            },
          },
        ],
      },
      event: {
        type: 'violation',
        params: {
          message:
            'Permit start date cannot be more than 14 days in the future',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.startDate',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData',
          path: 'vehicleDetails.vin',
          operator: 'regex',
          value: '^[a-zA-Z0-9]{6}$',
        },
      },
      event: {
        type: 'violation',
        params: {
          message:
            'Vehicle Identification Number (vin) must be 6 alphanumeric characters',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.vehicleDetails.vin',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData',
          path: 'vehicleDetails.plate',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Vehicle plate is required',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.vehicleDetails.plate',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData',
          path: 'vehicleDetails.make',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Vehicle make is required',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.vehicleDetails.make',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData',
          path: 'vehicleDetails.year',
          operator: 'greaterThan',
          value: 1900,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Vehicle year is required',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.vehicleDetails.year',
        },
      },
    },
    {
      conditions: {
        not: {
          fact: 'permitData',
          path: 'vehicleDetails.countryCode',
          operator: 'stringMinimumLength',
          value: 1,
        },
      },
      event: {
        type: 'violation',
        params: {
          message: 'Vehicle country of registration is required',
          code: ValidationResultCode.FieldValidationError,
          fieldReference: 'permitData.vehicleDetails.countryCode',
        },
      },
    },
  ],
  permitTypes: [
    {
      id: PERMIT_CODES.HIGHWAY_CROSSING,
      name: 'Highway Crossing Permit',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.BUSES,
        POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        POWER_UNIT_CODES.CRANES_MOBILE,
        POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
        POWER_UNIT_CODES.FARM_TRACTORS,
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.LOGGING_TRUCKS,
        POWER_UNIT_CODES.LOGGING_TRUCKS_OFF_HIGHWAY,
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        POWER_UNIT_CODES.LONG_WHEELBASE_TRUCK_TRACTORS,
        POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
        POWER_UNIT_CODES.PICKER_TRUCKS,
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        POWER_UNIT_CODES.RUBBER_TIRED_LOADERS,
        POWER_UNIT_CODES.SCRAPERS,
        POWER_UNIT_CODES.TAXIS,
        POWER_UNIT_CODES.TELESCOPIC_CONVEYOR_TRUCKS,
        POWER_UNIT_CODES.TOW_VEHICLES,
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
        POWER_UNIT_CODES.TRUCKS,
        POWER_UNIT_CODES.TRUCKS_FRONT_OR_UNDERBODY_PLOW_BLADES,
        TRAILER_CODES.BOOSTER,
        TRAILER_CODES.DOLLIES,
        TRAILER_CODES.EXPANDO_SEMI_TRAILERS,
        TRAILER_CODES.FIXED_EQUIPMENT_CONVEYORS,
        TRAILER_CODES.FIXED_EQUIPMENT_COUNTER_FLOW_ASPHALT_DRUM_MIXERS,
        TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS,
        TRAILER_CODES.FIXED_EQUIPMENT_PORTABLE_ASPHALT_BAGHOUSES,
        TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILERS,
        TRAILER_CODES.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS,
        TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILER_PEACE_RIVER,
        TRAILER_CODES.FLOAT_TRAILERS,
        TRAILER_CODES.FULL_TRAILERS,
        TRAILER_CODES.JEEPS,
        TRAILER_CODES.LOGGING_NON_TAC_B_TRAINS,
        TRAILER_CODES.LOGGING_SINGLE_AXLE_JEEPS,
        TRAILER_CODES.LOGGING_TRI_AXLE_TRAILERS,
        TRAILER_CODES.LOGGING_TANDEM_POLE_TRAILERS_DOGLOGGERS,
        TRAILER_CODES.LOGGING_OVERWIDTH_BUNKS,
        TRAILER_CODES.LOGGING_SEMI_TRAILER_EMPTY,
        TRAILER_CODES.LOGGING_FULL_TRAILERS,
        TRAILER_CODES.MANUFACTURED_HOMES_OVER_5M,
        TRAILER_CODES.MANUFACTURED_HOMES_UNDER_5M,
        TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
        TRAILER_CODES.OVERDIMENSIONAL_TRAILERS_FOR_EXPORT,
        TRAILER_CODES.PARK_MODEL_HOMES,
        TRAILER_CODES.PLATFORM_TRAILERS,
        TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
        TRAILER_CODES.POLE_TRAILERS,
        TRAILER_CODES.PONY_TRAILERS,
        TRAILER_CODES.READY_MIX_CONCRETE_PUMP_SEMI_TRAILERS,
        TRAILER_CODES.SEMI_TRAILERS,
        TRAILER_CODES.SEMI_TRAILERS_A_TRAINS_C_TRAINS,
        TRAILER_CODES.SEMI_TRAILERS_B_TRAINS,
        TRAILER_CODES.HIBOYS_EXPANDOS,
        TRAILER_CODES.HIBOYS_FLAT_DECKS,
        TRAILER_CODES.SEMI_TRAILERS_INSULATED_VANS_REEFER,
        TRAILER_CODES.SEMI_TRAILERS_LOGGING,
        TRAILER_CODES.SEMI_TRAILERS_NON_TAC_SHORT_CHASSIS,
        TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
        TRAILER_CODES.SEMI_TRAILERS_SPREAD_TANDEMS,
        TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
        TRAILER_CODES.SEMI_TRAILERS_STINGER_STEEERED_AUTOMOBILE_TRANSPORTERS,
        TRAILER_CODES.SEMI_TRAILERS_WALLED_B_TRAINS,
        TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
        TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
        TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
        TRAILER_CODES.STEERING_TRAILERS_MANNED,
        TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
        TRAILER_CODES.STINGER_STEERED_AUTOMOBILE_TRANSPORTERS,
        TRAILER_CODES.TANDEM_TRIDEM_DRIVE_B_TRAIN,
      ],
      rules: [
        {
          conditions: {
            any: [
              {
                fact: 'daysBetween',
                operator: 'greaterThan',
                value: 90,
                params: {
                  dateFrom: {
                    fact: 'validationDate',
                  },
                  dateTo: {
                    fact: 'permitData',
                    path: '$.startDate',
                  },
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Permit start date cannot be more than 90 days in the future',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.startDate',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData',
                  path: 'vehicleDetails.vehicleType',
                  operator: 'equal',
                  value: 'other',
                },
              },
              {
                fact: 'permitData',
                path: 'vehicleDetails.vehicleDescription',
                operator: 'stringMinimumLength',
                value: 1,
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Vehicle description should not exist unless the permit vehicle type is Other.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleDescription',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData',
                  path: 'vehicleDetails.vehicleDescription',
                  operator: 'stringMinimumLength',
                  value: 1,
                },
              },
              {
                fact: 'permitData',
                path: 'vehicleDetails.vehicleType',
                operator: 'equal',
                value: 'other',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Vehicle description must be present if the permit vehicle type is Other.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleDescription',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData',
                  path: 'icbcInsuranceCertificate.haveCertificate',
                  operator: 'equal',
                  value: true,
                },
              },
              {
                fact: 'permitData',
                path: 'icbcInsuranceCertificate.certificateNumber',
                operator: 'stringMinimumLength',
                value: 1,
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'ICBC certificate number should not exist if no certificate is being used.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference:
                'permitData.icbcInsuranceCertificate.certificateNumber',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'icbcInsuranceCertificate.haveCertificate',
                operator: 'equal',
                value: true,
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'icbcInsuranceCertificate.certificateNumber',
                  operator: 'stringMinimumLength',
                  value: 1,
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'ICBC certificate number is required if certificate is being used.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference:
                'permitData.icbcInsuranceCertificate.certificateNumber',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'icbcInsuranceCertificate.haveCertificate',
                operator: 'equal',
                value: true,
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'icbcInsuranceCertificate.certificateNumber',
                  operator: 'equal',
                  value: {
                    fact: 'permitData',
                    path: 'vehicleDetails.plate',
                  },
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'ICBC certificate number must match the vehicle plate number.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference:
                'permitData.icbcInsuranceCertificate.certificateNumber',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData',
                  path: 'vehicleDetails.vehicleType',
                  operator: 'equal',
                  value: 'other',
                },
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'vehicleDetails.vehicleSubType',
                  operator: 'in',
                  value: {
                    fact: 'allowedVehicles',
                  },
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleDetails.vehicleType',
                operator: 'equal',
                value: 'other',
              },
              {
                fact: 'permitData',
                path: 'vehicleDetails.vehicleSubType',
                operator: 'stringMinimumLength',
                value: 1,
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Vehicle subtype not permittable for Vehicle Type Other.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'expiryDate',
              operator: 'equal',
              value: {
                fact: 'endOfPermitYear',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Permit end date must be the end of the year in which the permit starts',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.expiryDate',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'fixedCost',
          params: {
            cost: 30,
          },
        },
      ],
      conditions: [
        {
          condition: 'CVSE-1070',
          mandatory: true,
        },
      ],
    },
    {
      id: PERMIT_CODES.TERM_OVERSIZE,
      name: 'Term Oversize',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        POWER_UNIT_CODES.CRANES_MOBILE,
        POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.INTERCITY_BUSES_PULLING_PONY_TRAILERS,
        POWER_UNIT_CODES.LOGGING_TRUCKS,
        POWER_UNIT_CODES.LOGGING_TRUCKS_OFF_HIGHWAY,
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        POWER_UNIT_CODES.PICKER_TRUCKS,
        POWER_UNIT_CODES.RUBBER_TIRED_LOADERS,
        POWER_UNIT_CODES.TELESCOPIC_CONVEYOR_TRUCKS,
        POWER_UNIT_CODES.TOW_VEHICLES,
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
        POWER_UNIT_CODES.TRUCKS,
        POWER_UNIT_CODES.TRUCKS_FRONT_OR_UNDERBODY_PLOW_BLADES,
        TRAILER_CODES.DOLLIES,
        TRAILER_CODES.EXPANDO_SEMI_TRAILERS,
        TRAILER_CODES.FIXED_EQUIPMENT_CONVEYORS,
        TRAILER_CODES.FIXED_EQUIPMENT_COUNTER_FLOW_ASPHALT_DRUM_MIXERS,
        TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS,
        TRAILER_CODES.FIXED_EQUIPMENT_PORTABLE_ASPHALT_BAGHOUSES,
        TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILERS,
        TRAILER_CODES.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS,
        TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILER_PEACE_RIVER,
        TRAILER_CODES.FLOAT_TRAILERS,
        TRAILER_CODES.FULL_TRAILERS,
        TRAILER_CODES.LOGGING_NON_TAC_B_TRAINS,
        TRAILER_CODES.LOGGING_SINGLE_AXLE_JEEPS,
        TRAILER_CODES.LOGGING_TRI_AXLE_TRAILERS,
        TRAILER_CODES.LOGGING_TANDEM_POLE_TRAILERS_DOGLOGGERS,
        TRAILER_CODES.LOGGING_SEMI_TRAILER_EMPTY,
        TRAILER_CODES.LOGGING_FULL_TRAILERS,
        TRAILER_CODES.LOGGING_OVERWIDTH_BUNKS,
        TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
        TRAILER_CODES.OVERDIMENSIONAL_TRAILERS_FOR_EXPORT,
        TRAILER_CODES.PLATFORM_TRAILERS,
        TRAILER_CODES.POLE_TRAILERS,
        TRAILER_CODES.PONY_TRAILERS,
        TRAILER_CODES.READY_MIX_CONCRETE_PUMP_SEMI_TRAILERS,
        TRAILER_CODES.SEMI_TRAILERS,
        TRAILER_CODES.HIBOYS_EXPANDOS,
        TRAILER_CODES.HIBOYS_FLAT_DECKS,
        TRAILER_CODES.SEMI_TRAILERS_INSULATED_VANS_REEFER,
        TRAILER_CODES.SEMI_TRAILERS_LOGGING,
        TRAILER_CODES.SEMI_TRAILERS_NON_TAC_SHORT_CHASSIS,
        TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
        TRAILER_CODES.SEMI_TRAILERS_STINGER_STEEERED_AUTOMOBILE_TRANSPORTERS,
        TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
        TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
        TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
        TRAILER_CODES.STINGER_STEERED_AUTOMOBILE_TRANSPORTERS,
      ],
      rules: [
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'in',
                  value: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                },
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'equal',
                  value: {
                    fact: 'daysInPermitYear',
                  },
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be in 30 day increments or a full year',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permitDuration',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'costPerMonth',
          params: {
            cost: 30,
          },
        },
      ],
      conditions: [
        {
          condition: 'CVSE-1000',
          mandatory: true,
        },
        {
          condition: 'CVSE-1070',
          mandatory: true,
        },
        {
          condition: 'CVSE-1000S',
          mandatory: false,
        },
        {
          condition: 'CVSE-1000L',
          mandatory: false,
        },
        {
          condition: 'CVSE-1012',
          mandatory: false,
        },
        {
          condition: 'CVSE-1013',
          mandatory: false,
        },
      ],
    },
    {
      id: PERMIT_CODES.TERM_OVERWEIGHT,
      name: 'Term Overweight',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        POWER_UNIT_CODES.CRANES_MOBILE,
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        POWER_UNIT_CODES.PICKER_TRUCKS,
        POWER_UNIT_CODES.RUBBER_TIRED_LOADERS,
        POWER_UNIT_CODES.TELESCOPIC_CONVEYOR_TRUCKS,
        POWER_UNIT_CODES.TOW_VEHICLES,
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.FIXED_EQUIPMENT_CONVEYORS,
        TRAILER_CODES.FIXED_EQUIPMENT_COUNTER_FLOW_ASPHALT_DRUM_MIXERS,
        TRAILER_CODES.FIXED_EQUIPMENT_PORTABLE_ASPHALT_BAGHOUSES,
        TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILERS,
        TRAILER_CODES.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS,
        TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILER_PEACE_RIVER,
        TRAILER_CODES.READY_MIX_CONCRETE_PUMP_SEMI_TRAILERS,
      ],
      rules: [
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'in',
                  value: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
                },
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'equal',
                  value: {
                    fact: 'daysInPermitYear',
                  },
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be in 30 day increments or a full year',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permitDuration',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'costPerMonth',
          params: {
            cost: 100,
          },
        },
      ],
      conditions: [
        {
          condition: 'CVSE-1000',
          mandatory: true,
        },
        {
          condition: 'CVSE-1070',
          mandatory: true,
        },
        {
          condition: 'CVSE-1011',
          mandatory: true,
        },
      ],
    },
    {
      id: PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      name: 'Single Trip Oversize',
      routingRequired: true,
      weightDimensionRequired: false,
      sizeDimensionRequired: true,
      commodityRequired: true,
      rules: [
        {
          conditions: {
            any: [
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'lessThanInclusive',
                  value: 7,
                },
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be 7 days or less',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permitDuration',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'configurationIsValid',
              operator: 'equal',
              value: true,
            },
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Vehicle configuration is not permittable for this commodity',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.trailers',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedCommodity.loadDescription',
              operator: 'stringMinimumLength',
              value: 1,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Commodity load description is required',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permittedCommodity.loadDescription',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'fixedCost',
          params: {
            cost: 15,
          },
        },
      ],
      conditions: [
        {
          condition: 'CVSE-1000',
          mandatory: true,
        },
        {
          condition: 'CVSE-1070',
          mandatory: true,
        },
        {
          condition: 'CVSE-1001',
          mandatory: false,
        },
        {
          condition: 'CVSE-1002',
          mandatory: false,
        },
        {
          condition: 'CVSE-1010',
          mandatory: false,
        },
        {
          condition: 'CVSE-1012',
          mandatory: false,
        },
        {
          condition: 'CVSE-1013',
          mandatory: false,
        },
      ],
    },
    {
      id: PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      name: 'Single Trip Overweight',
      routingRequired: true,
      weightDimensionRequired: true,
      sizeDimensionRequired: false,
      commodityRequired: true,
      rules: [
        {
          conditions: {
            not: {
              fact: 'configurationIsValid',
              operator: 'equal',
              value: true,
            },
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Vehicle configuration is not permittable for this commodity',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.trailers',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedCommodity.loadDescription',
              operator: 'stringMinimumLength',
              value: 1,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Commodity load description is required',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permittedCommodity.loadDescription',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'axleCalcViolations',
              operator: 'isEmptyArray',
              value: true,
            },
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Vehicle configuration failed axle calculation policy checks',
              code: ValidationResultCode.PolicyValidationError,
              details: {
                fact: 'axleCalcViolations',
              },
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'extraordinaryLoadRequest.isExtraordinaryLoadRequest',
                operator: 'equal',
                value: true,
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'extraordinaryLoadRequest.approvalNumber',
                  operator: 'stringMinimumLength',
                  value: 1,
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Approval number is required when an extraordinary load request is being used.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference:
                'permitData.extraordinaryLoadRequest.approvalNumber',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'extraordinaryLoadRequest.isExtraordinaryLoadRequest',
                operator: 'equal',
                value: false,
              },
              {
                fact: 'permitData',
                path: 'extraordinaryLoadRequest.approvalNumber',
                operator: 'stringMinimumLength',
                value: 1,
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Approval number should not exist if no extraordinary load request is being used.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference:
                'permitData.extraordinaryLoadRequest.approvalNumber',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'overloadAxleCost',
          params: {},
        },
      ],
      conditions: [
        {
          condition: 'CVSE-1070',
          mandatory: false,
        },
        {
          condition: 'CVSE-1011',
          mandatory: false,
        },
      ],
    },
    {
      id: PERMIT_CODES.EMPTY_SINGLE_TRIP_OVER_LENGTH_27_5,
      name: 'Overweight Oversize Empty - Length over 27.5 m',
      routingRequired: true,
      weightDimensionRequired: true,
      sizeDimensionRequired: true,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        POWER_UNIT_CODES.CRANES_MOBILE,
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.LONG_WHEELBASE_TRUCK_TRACTORS,
        POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.PICKER_TRUCKS,
        POWER_UNIT_CODES.RUBBER_TIRED_LOADERS,
        POWER_UNIT_CODES.TELESCOPIC_CONVEYOR_TRUCKS,
        POWER_UNIT_CODES.TOW_VEHICLES,
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCKS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
      ],
      rules: [
        {
          conditions: {
            any: [
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'lessThanInclusive',
                  value: 7,
                },
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be 7 days or less',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permitDuration',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleConfiguration.overallWidth',
              operator: 'greaterThan',
              value: 0,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Must be greater than 0m.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.overallWidth',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleConfiguration.overallWidth',
                operator: 'greaterThan',
                value: 3.2,
              },
            ],
          },
          event: {
            type: ValidationResultType.Warning,
            params: {
              message:
                'The provided dimensions make this application ineligible for self-issue and must be reviewed by the Provincial Permit Centre.',
              code: ValidationResultCode.DimensionOversize,
              fieldReference: 'permitData.vehicleConfiguration.overallWidth',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleConfiguration.overallHeight',
              operator: 'greaterThan',
              value: 0,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Must be greater than 0m.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.overallHeight',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleConfiguration.overallHeight',
                operator: 'greaterThan',
                value: 4.3,
              },
            ],
          },
          event: {
            type: ValidationResultType.Warning,
            params: {
              message:
                'The provided dimensions make this application ineligible for self-issue and must be reviewed by the Provincial Permit Centre.',
              code: ValidationResultCode.DimensionOversize,
              fieldReference: 'permitData.vehicleConfiguration.overallHeight',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleConfiguration.overallLength',
              operator: 'greaterThan',
              value: 27.5,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Must be greater than 27.5m.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.overallLength',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleConfiguration.overallLength',
                operator: 'greaterThan',
                value: 31,
              },
            ],
          },
          event: {
            type: ValidationResultType.Warning,
            params: {
              message:
                'The provided dimensions make this application ineligible for self-issue and must be reviewed by the Provincial Permit Centre.',
              code: ValidationResultCode.DimensionOversize,
              fieldReference: 'permitData.vehicleConfiguration.overallLength',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleConfiguration.overloadWeight',
              operator: 'greaterThan',
              value: 0,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Must be greater than 0kg.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.overloadWeight',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedRoute.manualRoute.origin',
              operator: 'stringMinimumLength',
              value: 1,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Route origin is required',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permittedRoute.manualRoute.origin',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedRoute.manualRoute.destination',
              operator: 'stringMinimumLength',
              value: 1,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Route destination is required',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permittedRoute.manualRoute.origin',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedRoute.manualRoute.totalDistance',
              operator: 'greaterThan',
              value: 0,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Trip distance must be greater than zero',
              code: ValidationResultCode.FieldValidationError,
              fieldReference:
                'permitData.permittedRoute.manualRoute.totalDistance',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'fixedCost',
          params: {
            cost: 15,
            description: 'Oversize',
          },
        },
        {
          fact: 'overloadWeightCost',
          params: {
            description: 'Overload',
          },
        },
      ],
      conditions: [
        {
          condition: 'CVSE-1000',
          mandatory: true,
        },
        {
          condition: 'CVSE-1070',
          mandatory: true,
        },
      ],
    },
    {
      id: PERMIT_CODES.SINGLE_TRIP_GVW_INCREASE,
      name: 'Single Trip GVW Increase',
      routingRequired: true,
      weightDimensionRequired: true,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.BUSES,
        POWER_UNIT_CODES.INTERCITY_BUSES_PULLING_PONY_TRAILERS,
        POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        POWER_UNIT_CODES.CRANES_MOBILE,
        POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        POWER_UNIT_CODES.LOGGING_TRUCKS,
        POWER_UNIT_CODES.LOGGING_TRUCKS_OFF_HIGHWAY,
        POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        POWER_UNIT_CODES.TRUCKS_FRONT_OR_UNDERBODY_PLOW_BLADES,
        POWER_UNIT_CODES.TAXIS,
        POWER_UNIT_CODES.TRUCKS,
        POWER_UNIT_CODES.SCRAPERS,
        POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
        POWER_UNIT_CODES.TOW_VEHICLES,
        POWER_UNIT_CODES.TRUCK_TRACTORS,
      ],
      rules: [
        {
          conditions: {
            any: [
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'lessThanInclusive',
                  value: 7,
                },
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be 7 days or less',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permitDuration',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleConfiguration.actualGVW',
              operator: 'greaterThan',
              value: 0,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'This is a required field',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.actualGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleConfiguration.actualGVW',
                operator: 'greaterThan',
                value: 0,
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'vehicleConfiguration.actualGVW',
                  operator: 'greaterThan',
                  value: {
                    fact: 'permitData',
                    path: 'vehicleDetails.licensedGVW',
                  },
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Must be greater than Licensed GVW.',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.actualGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleConfiguration.actualGVW',
                operator: 'greaterThan',
                value: 0,
              },
              {
                fact: 'permitData',
                path: 'vehicleConfiguration.actualGVW',
                operator: 'greaterThan',
                value: 63500,
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Cannot exceed 63,500kg',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.actualGVW',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedRoute.manualRoute.origin',
              operator: 'stringMinimumLength',
              value: 1,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Route origin is required',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permittedRoute.manualRoute.origin',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedRoute.manualRoute.destination',
              operator: 'stringMinimumLength',
              value: 1,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Route destination is required',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permittedRoute.manualRoute.origin',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedRoute.manualRoute.totalDistance',
              operator: 'greaterThan',
              value: 0,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Trip distance must be greater than zero',
              code: ValidationResultCode.FieldValidationError,
              fieldReference:
                'permitData.permittedRoute.manualRoute.totalDistance',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'overloadGvwCost',
          params: {
            description:
              'Calculates overload fee based on distance and licensed GVW increase',
          },
        },
      ],
      conditions: [
        {
          condition: 'CVSE-1070',
          mandatory: true,
        },
      ],
    },
    {
      id: PERMIT_CODES.SINGLE_TRIP_ICBC_BASIC_INSURANCE_FR,
      name: 'Single Trip ICBC Basic Insurance (FR)',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.BUSES,
        POWER_UNIT_CODES.INTERCITY_BUSES_PULLING_PONY_TRAILERS,
        POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        POWER_UNIT_CODES.CRANES_MOBILE,
        POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        POWER_UNIT_CODES.LOGGING_TRUCKS,
        POWER_UNIT_CODES.LOGGING_TRUCKS_OFF_HIGHWAY,
        POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        POWER_UNIT_CODES.TRUCKS_FRONT_OR_UNDERBODY_PLOW_BLADES,
        POWER_UNIT_CODES.TAXIS,
        POWER_UNIT_CODES.TRUCKS,
        POWER_UNIT_CODES.SCRAPERS,
        POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
        POWER_UNIT_CODES.TOW_VEHICLES,
        POWER_UNIT_CODES.TRUCK_TRACTORS,
      ],
      rules: [
        {
          conditions: {
            any: [
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'lessThanInclusive',
                  value: 30,
                },
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be 30 days or less',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permitDuration',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.licensedGVW',
              operator: 'greaterThan',
              value: 0,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Licensed GVW must be greater than zero',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.licensedGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleDetails.licensedGVW',
                operator: 'greaterThan',
                value: 63500,
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Licensed GVW may not exceed 63,500 kg',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.licensedGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleDetails.countryCode',
                operator: 'equal',
                value: 'CA',
              },
              {
                fact: 'permitData',
                path: 'vehicleDetails.provinceCode',
                operator: 'equal',
                value: 'BC',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'BC plated vehicles do not require this permit',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.provinceCode',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'thirdPartyLiability',
              operator: 'in',
              value: ['GENERAL_GOODS', 'DANGEROUS_GOODS'],
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Third party liability is invalid',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.thirdPartyLiability',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'fixedCost',
          params: {
            cost: 84,
          },
        },
        {
          fact: 'conditionalFixedCost',
          params: {
            cost: 5,
            fact: 'thirdPartyLiability',
            value: 'DANGEROUS_GOODS',
          },
        },
      ],
    },
    {
      id: PERMIT_CODES.QUARTERLY_ICBC_BASIC_INSURANCE_FR,
      name: 'Quarterly ICBC Basic Insurance (FR)',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.BUSES,
        POWER_UNIT_CODES.INTERCITY_BUSES_PULLING_PONY_TRAILERS,
        POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        POWER_UNIT_CODES.CRANES_MOBILE,
        POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        POWER_UNIT_CODES.LOGGING_TRUCKS,
        POWER_UNIT_CODES.LOGGING_TRUCKS_OFF_HIGHWAY,
        POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        POWER_UNIT_CODES.TRUCKS_FRONT_OR_UNDERBODY_PLOW_BLADES,
        POWER_UNIT_CODES.TAXIS,
        POWER_UNIT_CODES.TRUCKS,
        POWER_UNIT_CODES.SCRAPERS,
        POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
        POWER_UNIT_CODES.TOW_VEHICLES,
        POWER_UNIT_CODES.TRUCK_TRACTORS,
      ],
      rules: [
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'expiryDate',
              operator: 'equal',
              value: {
                fact: 'endOfPermitQuarter',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Permit end date must be the end of the quarter in which the permit starts',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.expiryDate',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.licensedGVW',
              operator: 'greaterThan',
              value: 0,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Licensed GVW must be greater than zero',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.licensedGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleDetails.licensedGVW',
                operator: 'greaterThan',
                value: 63500,
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Licensed GVW may not exceed 63,500 kg',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.licensedGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleDetails.countryCode',
                operator: 'equal',
                value: 'CA',
              },
              {
                fact: 'permitData',
                path: 'vehicleDetails.provinceCode',
                operator: 'equal',
                value: 'BC',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'BC plated vehicles do not require this permit',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.provinceCode',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              operator: 'in',
              value: ['GENERAL_GOODS', 'DANGEROUS_GOODS'],
              path: 'thirdPartyLiability',
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Third party liability is invalid',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.thirdPartyLiability',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'fixedCost',
          params: {
            cost: 843,
          },
        },
        {
          fact: 'conditionalFixedCost',
          params: {
            cost: 56,
            fact: 'thirdPartyLiability',
            value: 'DANGEROUS_GOODS',
          },
        },
      ],
    },
    {
      id: PERMIT_CODES.MOTIVE_FUEL_USER_PERMIT,
      name: 'Motive Fuel User Permit',
      routingRequired: true,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.BUSES,
        POWER_UNIT_CODES.INTERCITY_BUSES_PULLING_PONY_TRAILERS,
        POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        POWER_UNIT_CODES.CRANES_MOBILE,
        POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        POWER_UNIT_CODES.LOGGING_TRUCKS,
        POWER_UNIT_CODES.LOGGING_TRUCKS_OFF_HIGHWAY,
        POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        POWER_UNIT_CODES.TRUCKS_FRONT_OR_UNDERBODY_PLOW_BLADES,
        POWER_UNIT_CODES.TRUCKS,
        POWER_UNIT_CODES.SCRAPERS,
        POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
        POWER_UNIT_CODES.TOW_VEHICLES,
        POWER_UNIT_CODES.TRUCK_TRACTORS,
      ],
      rules: [
        {
          conditions: {
            any: [
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'lessThanInclusive',
                  value: 7,
                },
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be 7 days or less',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permitDuration',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.licensedGVW',
              operator: 'greaterThan',
              value: 0,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Licensed GVW must be greater than zero',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.licensedGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleDetails.licensedGVW',
                operator: 'greaterThan',
                value: 63500,
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Licensed GVW may not exceed 63,500 kg',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.licensedGVW',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedRoute.manualRoute.origin',
              operator: 'stringMinimumLength',
              value: 1,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Route origin is required',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permittedRoute.manualRoute.origin',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedRoute.manualRoute.destination',
              operator: 'stringMinimumLength',
              value: 1,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Route destination is required',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permittedRoute.manualRoute.origin',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedRoute.manualRoute.totalDistance',
              operator: 'greaterThan',
              value: 0,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Trip distance must be greater than zero',
              code: ValidationResultCode.FieldValidationError,
              fieldReference:
                'permitData.permittedRoute.manualRoute.totalDistance',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'costPerKilometre',
          params: {
            cost: 0.07,
            minValue: 10,
            maxValue: 140,
          },
        },
      ],
    },
    {
      id: PERMIT_CODES.SINGLE_TRIP_NON_RESIDENT,
      name: 'Non-Resident Single Trip',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.BUSES,
        POWER_UNIT_CODES.INTERCITY_BUSES_PULLING_PONY_TRAILERS,
        POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        POWER_UNIT_CODES.CRANES_MOBILE,
        POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
        POWER_UNIT_CODES.FARM_TRACTORS,
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        POWER_UNIT_CODES.LOGGING_TRUCKS,
        POWER_UNIT_CODES.LOGGING_TRUCKS_OFF_HIGHWAY,
        POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        POWER_UNIT_CODES.TRUCKS_FRONT_OR_UNDERBODY_PLOW_BLADES,
        POWER_UNIT_CODES.TAXIS,
        POWER_UNIT_CODES.TRUCKS,
        POWER_UNIT_CODES.SCRAPERS,
        POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
        POWER_UNIT_CODES.TOW_VEHICLES,
        POWER_UNIT_CODES.TRUCK_TRACTORS,
      ],
      rules: [
        {
          conditions: {
            any: [
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'lessThanInclusive',
                  value: 30,
                },
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be 30 days or less',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permitDuration',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData',
                  path: 'vehicleConfiguration.loadedGVW',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
              {
                fact: 'permitData',
                path: 'conditionalLicensingFee',
                operator: 'in',
                value: [
                  'conditional',
                  'none',
                  'x-plated',
                  'commercial-passenger',
                ],
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Loaded GVW must be greater than zero for the selected conditional license fee type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.loadedGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData',
                  path: 'vehicleConfiguration.netWeight',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
              {
                fact: 'permitData',
                path: 'conditionalLicensingFee',
                operator: 'equal',
                value: 'farm-vehicle',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Net weight must be greater than zero for a farm vehicle',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.netWeight',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleConfiguration.netWeight',
                operator: 'greaterThan',
                value: 24400,
              },
              {
                fact: 'permitData',
                path: 'conditionalLicensingFee',
                operator: 'equal',
                value: 'farm-vehicle',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Net weight may not exceed 24,400 kg for a farm vehicle',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.netWeight',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleConfiguration.loadedGVW',
                operator: 'greaterThan',
                value: 63500,
              },
              {
                fact: 'permitData',
                path: 'conditionalLicensingFee',
                operator: 'notEqual',
                value: 'farm-vehicle',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Loaded GVW may not exceed 63,500 kg',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.loadedGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleDetails.countryCode',
                operator: 'equal',
                value: 'CA',
              },
              {
                fact: 'permitData',
                path: 'vehicleDetails.provinceCode',
                operator: 'equal',
                value: 'BC',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'BC plated vehicles do not require this permit',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.provinceCode',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'conditionalLicensingFee',
              operator: 'in',
              value: [
                'none',
                'conditional',
                'x-plated',
                'farm-vehicle',
                'farm-tractor',
                'commercial-passenger',
              ],
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Conditional licensing selection is invalid',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.conditionalLicensingFee',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'conditionalFixedCost',
          params: {
            cost: 12,
            fact: 'conditionalLicensingFee',
            value: 'conditional',
          },
        },
        {
          fact: 'conditionalFixedCost',
          params: {
            cost: 33,
            fact: 'conditionalLicensingFee',
            value: 'farm-tractor',
          },
        },
        {
          fact: 'rangeMatrixCostLookup',
          params: {
            divisor: 12,
            matrixMap: [
              {
                key: 'none',
                value: 'annualFeeCV',
              },
              {
                key: 'x-plated',
                value: 'annualFeeIndustrial',
              },
              {
                key: 'commercial-passenger',
                value: 'annualFeePassenger',
              },
            ],
            rangeLookupKey: 'conditionalLicensingFee',
            matrixFactValue: 'vehicleConfiguration.loadedGVW',
          },
        },
        {
          fact: 'rangeMatrixCostLookup',
          params: {
            divisor: 12,
            matrixMap: [
              {
                key: 'farm-vehicle',
                value: 'annualFeeFarm',
              },
            ],
            rangeLookupKey: 'conditionalLicensingFee',
            matrixFactValue: 'vehicleConfiguration.netWeight',
          },
        },
      ],
    },
    {
      id: PERMIT_CODES.QUARTERLY_NON_RESIDENT,
      name: 'Non-Resident Quarterly',
      routingRequired: false,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.BUSES,
        POWER_UNIT_CODES.INTERCITY_BUSES_PULLING_PONY_TRAILERS,
        POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        POWER_UNIT_CODES.CRANES_MOBILE,
        POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
        POWER_UNIT_CODES.FARM_TRACTORS,
        POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        POWER_UNIT_CODES.LOGGING_TRUCKS,
        POWER_UNIT_CODES.LOGGING_TRUCKS_OFF_HIGHWAY,
        POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
        POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        POWER_UNIT_CODES.TRUCK_WITH_PME,
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        POWER_UNIT_CODES.TRUCKS_FRONT_OR_UNDERBODY_PLOW_BLADES,
        POWER_UNIT_CODES.TAXIS,
        POWER_UNIT_CODES.TRUCKS,
        POWER_UNIT_CODES.SCRAPERS,
        POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
        POWER_UNIT_CODES.TOW_VEHICLES,
        POWER_UNIT_CODES.TRUCK_TRACTORS,
      ],
      rules: [
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'expiryDate',
              operator: 'equal',
              value: {
                fact: 'endOfPermitQuarter',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Permit end date must be the end of the quarter in which the permit starts',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.expiryDate',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData',
                  path: 'vehicleConfiguration.loadedGVW',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
              {
                fact: 'permitData',
                path: 'conditionalLicensingFee',
                operator: 'in',
                value: [
                  'conditional',
                  'none',
                  'x-plated',
                  'commercial-passenger',
                ],
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Loaded GVW must be greater than zero for the selected conditional license fee type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.loadedGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                not: {
                  fact: 'permitData',
                  path: 'vehicleConfiguration.netWeight',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
              {
                fact: 'permitData',
                path: 'conditionalLicensingFee',
                operator: 'equal',
                value: 'farm-vehicle',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message:
                'Net weight must be greater than zero for a farm vehicle',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.netWeight',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleConfiguration.netWeight',
                operator: 'greaterThan',
                value: 24400,
              },
              {
                fact: 'permitData',
                path: 'conditionalLicensingFee',
                operator: 'equal',
                value: 'farm-vehicle',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Net weight may not exceed 24,400 kg for a farm vehicle',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.netWeight',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleConfiguration.loadedGVW',
                operator: 'greaterThan',
                value: 63500,
              },
              {
                fact: 'permitData',
                path: 'conditionalLicensingFee',
                operator: 'notEqual',
                value: 'farm-vehicle',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Loaded GVW may not exceed 63,500 kg',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleConfiguration.loadedGVW',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleDetails.countryCode',
                operator: 'equal',
                value: 'CA',
              },
              {
                fact: 'permitData',
                path: 'vehicleDetails.provinceCode',
                operator: 'equal',
                value: 'BC',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'BC plated vehicles do not require this permit',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.provinceCode',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'conditionalLicensingFee',
              operator: 'in',
              value: [
                'none',
                'conditional',
                'x-plated',
                'farm-vehicle',
                'farm-tractor',
                'commercial-passenger',
              ],
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Conditional licensing selection is invalid',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.conditionalLicensingFee',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'conditionalFixedCost',
          params: {
            cost: 12,
            fact: 'conditionalLicensingFee',
            value: 'conditional',
          },
        },
        {
          fact: 'conditionalFixedCost',
          params: {
            cost: 33,
            fact: 'conditionalLicensingFee',
            value: 'farm-tractor',
          },
        },
        {
          fact: 'rangeMatrixCostLookup',
          params: {
            divisor: 4,
            matrixMap: [
              {
                key: 'none',
                value: 'annualFeeCV',
              },
              {
                key: 'x-plated',
                value: 'annualFeeIndustrial',
              },
              {
                key: 'commercial-passenger',
                value: 'annualFeePassenger',
              },
            ],
            rangeLookupKey: 'conditionalLicensingFee',
            matrixFactValue: 'vehicleConfiguration.loadedGVW',
          },
        },
        {
          fact: 'rangeMatrixCostLookup',
          params: {
            divisor: 4,
            matrixMap: [
              {
                key: 'farm-vehicle',
                value: 'annualFeeFarm',
              },
            ],
            rangeLookupKey: 'conditionalLicensingFee',
            matrixFactValue: 'vehicleConfiguration.netWeight',
          },
        },
      ],
    },
    {
      id: PERMIT_CODES.EXTRA_PROVINCIAL_TEMP_OPERATING_PERMIT,
      name: 'Extra-Provincial Temporary Operating Permit',
      routingRequired: true,
      weightDimensionRequired: false,
      sizeDimensionRequired: false,
      commodityRequired: false,
      allowedVehicles: [
        POWER_UNIT_CODES.BUSES,
        POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
        POWER_UNIT_CODES.TAXIS,
      ],
      rules: [
        {
          conditions: {
            any: [
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'lessThanInclusive',
                  value: 7,
                },
              },
              {
                not: {
                  fact: 'permitData',
                  path: 'permitDuration',
                  operator: 'greaterThan',
                  value: 0,
                },
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'Duration must be 7 days or less',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.permitDuration',
            },
          },
        },
        {
          conditions: {
            all: [
              {
                fact: 'permitData',
                path: 'vehicleDetails.countryCode',
                operator: 'equal',
                value: 'CA',
              },
              {
                fact: 'permitData',
                path: 'vehicleDetails.provinceCode',
                operator: 'equal',
                value: 'BC',
              },
            ],
          },
          event: {
            type: 'violation',
            params: {
              message: 'BC plated vehicles do not require this permit',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.provinceCode',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'vehicleDetails.vehicleSubType',
              operator: 'in',
              value: {
                fact: 'allowedVehicles',
              },
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Vehicle type not permittable for this permit type',
              code: ValidationResultCode.FieldValidationError,
              fieldReference: 'permitData.vehicleDetails.vehicleSubType',
            },
          },
        },
        {
          conditions: {
            not: {
              fact: 'permitData',
              path: 'permittedRoute.manualRoute.entryPoint',
              operator: 'stringMinimumLength',
              value: 1,
            },
          },
          event: {
            type: 'violation',
            params: {
              message: 'Entry Point is required',
              code: ValidationResultCode.FieldValidationError,
              fieldReference:
                'permitData.permittedRoute.manualRoute.entryPoint',
            },
          },
        },
      ],
      costRules: [
        {
          fact: 'fixedCost',
          params: {
            cost: 25,
          },
        },
      ],
      conditions: [],
    },
  ],
  globalWeightDefaults: {
    powerUnits: [
      {
        axles: 11,
        saLegal: 6000,
        saPermittable: 9100,
        daLegal: 9100,
        daPermittable: 11000,
      },
      {
        axles: 12,
        saLegal: 6000,
        saPermittable: 9100,
        daLegal: 17000,
        daPermittable: 23000,
      },
      {
        axles: 13,
        saLegal: 7300,
        saPermittable: 9100,
        daLegal: 24000,
        daPermittable: 28000,
      },
      {
        axles: 22,
        saLegal: 17000,
        saPermittable: 17000,
        daLegal: 17000,
        daPermittable: 23000,
      },
      {
        axles: 23,
        saLegal: 13600,
        saPermittable: 15200,
        daLegal: 24000,
        daPermittable: 28000,
      },
    ],
    trailers: [
      {
        axles: 1,
        legal: 9100,
        permittable: 11000,
      },
      {
        axles: 2,
        legal: 17000,
        permittable: 23000,
      },
      {
        axles: 3,
        legal: 24000,
        permittable: 28000,
      },
    ],
  },
  globalInteraxleSpacingDefaults: [
    {
      axles: [11, 12, 13, 21, 31],
      min: 300,
    },
    {
      axles: [22],
      min: 500,
    },
    {
      axles: [23],
      min: 550,
    },
    {
      axles: [32],
      min: 550,
    },
    {
      axles: [33],
      min: 600,
    },
  ],
  vehicleCategories: {
    trailerCategories: [
      {
        id: VEHICLE_CATEGORIES.TRAILER,
        name: 'Default trailer category',
        defaultWeightDimensions: [
          {
            axles: 3,
            legal: 24000,
            permittable: 28000,
          },
          {
            axles: 3,
            legal: 24000,
            permittable: 29000,
            permittableAxleSpread: {
              min: 240,
              max: 370,
            },
          },
        ],
      },
      {
        id: VEHICLE_CATEGORIES.PSEUDO,
        name: 'Placeholder for a trailer that is not technically a separate trailer, such as (None) to represent no trailer in a combination, or an extra axle.',
      },
      {
        id: VEHICLE_CATEGORIES.SEMI_TRAILER,
        name: 'Semi-Trailer',
        defaultWeightDimensions: [
          {
            axles: 3,
            legal: 24000,
            permittable: 28000,
          },
          {
            axles: 3,
            legal: 24000,
            permittable: 29000,
            permittableAxleSpread: {
              min: 240,
              max: 370,
            },
          },
        ],
      },
      {
        id: VEHICLE_CATEGORIES.WHEELER,
        name: 'Wheeler',
        defaultWeightDimensions: [
          {
            axles: 1,
            legal: 0,
            permittable: 0,
          },
          {
            axles: 2,
            legal: 17000,
            permittable: 31000,
          },
          {
            axles: 3,
            legal: 24000,
            permittable: 40000,
          },
        ],
      },
      {
        id: VEHICLE_CATEGORIES.STEERING_TRAILER,
        name: 'Steering Trailer',
        defaultWeightDimensions: [
          {
            axles: 3,
            legal: 24000,
            permittable: 28000,
          },
          {
            axles: 3,
            legal: 24000,
            permittable: 29000,
            permittableAxleSpread: {
              min: 240,
              max: 370,
            },
          },
        ],
      },
      {
        id: VEHICLE_CATEGORIES.DOLLY,
        name: 'Dolly',
      },
      {
        id: VEHICLE_CATEGORIES.PONY_TRAILER,
        name: 'Pony Trailer',
        defaultWeightDimensions: [
          {
            axles: 2,
            legal: 17000,
            permittable: 21000,
          },
          {
            axles: 3,
            legal: 21000,
            permittable: 21000,
          },
        ],
      },
    ],
    powerUnitCategories: [
      {
        id: VEHICLE_CATEGORIES.POWER_UNIT,
        name: 'Default power unit category',
      },
      {
        id: VEHICLE_CATEGORIES.MULTI_STEER,
        name: 'Power units supporting greater than tandem steer axle units',
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 11000,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 12000,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 12000,
            daLegal: 24000,
            daPermittable: 28000,
          },
          {
            axles: 23,
            saLegal: 15200,
            saPermittable: 17000,
            daLegal: 24000,
            daPermittable: 28000,
          },
          {
            axles: 33,
            saLegal: 24000,
            saPermittable: 24000,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
      },
    ],
  },
  vehicleTypes: {
    powerUnitTypes: [
      {
        id: POWER_UNIT_CODES.BUSES,
        name: 'Buses',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
      },
      {
        id: POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
        name: 'Concrete Pumper Trucks',
        category: VEHICLE_CATEGORIES.MULTI_STEER,
        displayCodePrefix: 'MC',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'A',
      },
      {
        id: POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
        name: 'Cranes - All Terrain',
        category: VEHICLE_CATEGORIES.MULTI_STEER,
        additionalAxleSubType:
          TRAILER_CODES.ADDITIONAL_AXLE_UNIT_ALL_TERRAIN_CRANE,
        displayCodePrefix: 'MC',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'A',
      },
      {
        id: POWER_UNIT_CODES.CRANES_MOBILE,
        name: 'Cranes - Mobile',
        category: VEHICLE_CATEGORIES.MULTI_STEER,
        displayCodePrefix: 'MC',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'A',
      },
      {
        id: POWER_UNIT_CODES.CRANES_RUBBER_TIRED_LOADERS_FIRETRUCKS_ALL_TERRAIN,
        name: 'Cranes, Rubber-Tired Loaders, Firetrucks - All Terrain',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        displayCodePrefix: 'MC',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'A',
      },
      {
        id: POWER_UNIT_CODES.CRANES_RUBBER_TIRED_LOADERS_FIRETRUCKS_MOBILE,
        name: 'Cranes, Rubber-Tired Loaders, Firetrucks - Mobile',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        displayCodePrefix: 'MC',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'A',
      },
      {
        id: POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
        name: 'Double Decker Buses',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
      },
      {
        id: POWER_UNIT_CODES.FARM_TRACTORS,
        name: 'Farm Tractors',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.FARM_VEHICLES,
        name: 'Farm Vehicles',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
        name: 'Fixed Equipment - Trucks/Graders etc.',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 11000,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 24000,
            daPermittable: 28000,
          },
          {
            axles: 23,
            saLegal: 15200,
            saPermittable: 15200,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'MC',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'A',
      },
      {
        id: POWER_UNIT_CODES.INTERCITY_BUSES_PULLING_PONY_TRAILERS,
        name: 'Intercity Buses (Pulling Pony Trailers)',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
      },
      {
        id: POWER_UNIT_CODES.LOGGING_TRUCKS,
        name: 'Logging Trucks',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.LOGGING_TRUCKS_OFF_HIGHWAY,
        name: 'Logging Trucks - Off-Highway',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        name: 'Long Combination Vehicles (LCV) - Rocky Mountain Doubles',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        isLcv: true,
        defaultWeightDimensions: [
          {
            axles: 12,
            saLegal: 6000,
            saPermittable: 6000,
            daLegal: 17000,
            daPermittable: 17000,
          },
          {
            axles: 13,
            saLegal: 7300,
            saPermittable: 7300,
            daLegal: 24000,
            daPermittable: 24000,
          },
        ],
        conditions: [
          {
            condition: 'CVSE-1014',
            mandatory: true,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        name: 'Long Combination Vehicles (LCV) - Turnpike Doubles',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        isLcv: true,
        defaultWeightDimensions: [
          {
            axles: 12,
            saLegal: 6000,
            saPermittable: 6000,
            daLegal: 17000,
            daPermittable: 17000,
          },
          {
            axles: 13,
            saLegal: 7300,
            saPermittable: 7300,
            daLegal: 24000,
            daPermittable: 24000,
          },
        ],
        conditions: [
          {
            condition: 'CVSE-1014',
            mandatory: true,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.LONG_WHEELBASE_TRUCK_TRACTORS,
        name: 'Long Wheelbase Truck Tractors Exceeding 6.2 m up to 7.25 m',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
      },
      {
        id: POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
        name: 'Municipal Fire Trucks',
        category: VEHICLE_CATEGORIES.MULTI_STEER,
        displayCodePrefix: 'MC',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'A',
      },
      {
        id: POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
        name: 'Oil and Gas - Bed Trucks',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 11000,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 24000,
            daPermittable: 28000,
          },
          {
            axles: 23,
            saLegal: 13600,
            saPermittable: 17000,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
        name: 'Oil and Gas - Oilfield Sows',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 11000,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
        name: 'Oil and Gas - Service Rigs',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 12000,
            daLegal: 9100,
            daPermittable: 11000,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 12000,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 12000,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
        name: 'Oil and Gas - Service Rigs and Rathole Augers Only Equipped with Heavy Front Projected Crane (must exceed 14,000 kg tare weight)',
        category: VEHICLE_CATEGORIES.MULTI_STEER,
        defaultWeightDimensions: [
          {
            axles: 22,
            saLegal: 17000,
            saPermittable: 20000,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 23,
            saLegal: 17000,
            saPermittable: 20000,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'MC',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'A',
      },
      {
        id: POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        name: 'Picker Truck Tractors',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 9100,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 24000,
            daPermittable: 24000,
          },
          {
            axles: 23,
            saLegal: 15200,
            saPermittable: 17000,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.TRUCK_WITH_PME,
        name: 'Truck with PME',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 9100,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 24000,
            daPermittable: 24000,
          },
          {
            axles: 23,
            saLegal: 15200,
            saPermittable: 15200,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        name: 'Truck Tractor with PME',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 9100,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 24000,
            daPermittable: 24000,
          },
          {
            axles: 23,
            saLegal: 15200,
            saPermittable: 15200,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.PICKER_TRUCKS,
        name: 'Picker Trucks',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 9100,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 24000,
            daPermittable: 24000,
          },
          {
            axles: 23,
            saLegal: 15200,
            saPermittable: 15200,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.RUBBER_TIRED_LOADERS,
        name: 'Rubber Tired Loaders',
        category: VEHICLE_CATEGORIES.MULTI_STEER,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 12000,
          },
        ],
        displayCodePrefix: 'MC',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'A',
      },
      {
        id: POWER_UNIT_CODES.SCRAPERS,
        name: 'Scrapers',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 23000,
            daLegal: 9100,
            daPermittable: 23000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.SPECIALLY_AUTHORIZED_VEHICLES,
        name: 'Specially Authorized Vehicles',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
      },
      {
        id: POWER_UNIT_CODES.TAXIS,
        name: 'Taxis',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
      },
      {
        id: POWER_UNIT_CODES.TELESCOPIC_CONVEYOR_TRUCKS,
        name: 'Telescopic Conveyor Trucks',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 12000,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 12000,
            daLegal: 24000,
            daPermittable: 28000,
          },
          {
            axles: 23,
            saLegal: 15200,
            saPermittable: 17000,
            daLegal: 24000,
            daPermittable: 28000,
          },
          {
            axles: 33,
            saLegal: 24000,
            saPermittable: 24000,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.TOW_VEHICLES,
        name: 'Tow Vehicles',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 11000,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 17000,
            daPermittable: 23000,
          },
          {
            axles: 13,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 24000,
            daPermittable: 28000,
          },
          {
            axles: 23,
            saLegal: 15200,
            saPermittable: 15200,
            daLegal: 24000,
            daPermittable: 28000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.TRUCK_TRACTORS,
        name: 'Truck Tractors',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
        name: 'Truck Tractors - Stinger Steered',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.TRUCKS,
        name: 'Trucks',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        defaultWeightDimensions: [
          {
            axles: 11,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 9100,
            daPermittable: 11000,
          },
          {
            axles: 12,
            saLegal: 9100,
            saPermittable: 9100,
            daLegal: 17000,
            daPermittable: 23000,
          },
        ],
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
      {
        id: POWER_UNIT_CODES.TRUCKS_FRONT_OR_UNDERBODY_PLOW_BLADES,
        name: 'Trucks Equipped with Front or Underbody Plow Blades',
        category: VEHICLE_CATEGORIES.POWER_UNIT,
        displayCodePrefix: 'TT',
        displayCodeSteerAxle: 'S',
        displayCodeDriveAxle: 'D',
      },
    ],
    trailerTypes: [
      {
        id: TRAILER_CODES.ADDITIONAL_AXLE_UNIT_PLATFORM_TRAILER,
        name: 'Additional Axle Unit for Platform Trailer',
        category: VEHICLE_CATEGORIES.PSEUDO,
        ignoreForSizeDimensions: true,
        displayCode: 'A',
        defaultWeightDimensions: [
          {
            axles: 3,
            legal: 24000,
            permittable: 28000,
          },
          {
            axles: 3,
            legal: 24000,
            permittable: 29000,
            permittableAxleSpread: {
              min: 240,
              max: 370,
            },
          },
        ],
      },
      {
        id: TRAILER_CODES.ADDITIONAL_AXLE_UNIT_ALL_TERRAIN_CRANE,
        name: 'Additional Axle Unit for All-Terrain Crane',
        category: VEHICLE_CATEGORIES.PSEUDO,
        ignoreForSizeDimensions: true,
        displayCode: 'A',
        defaultWeightDimensions: [
          {
            axles: 3,
            legal: 24000,
            permittable: 28000,
          },
          {
            axles: 3,
            legal: 24000,
            permittable: 29000,
            permittableAxleSpread: {
              min: 240,
              max: 370,
            },
          },
        ],
      },
      {
        id: TRAILER_CODES.BOOSTER,
        name: 'Boosters',
        category: VEHICLE_CATEGORIES.BOOSTER,
        ignoreForSizeDimensions: true,
        defaultWeightDimensions: [
          {
            axles: 1,
            legal: 9100,
            permittable: 9100,
          },
          {
            axles: 2,
            legal: 17000,
            permittable: 23000,
          },
          {
            axles: 3,
            legal: 24000,
            permittable: 28000,
          },
          {
            axles: 1,
            modifier: {
              category: VEHICLE_CATEGORIES.SEMI_TRAILER,
              position: RelativePosition.Before,
              maxInteraxleSpacing: 419,
            },
            legal: 9100,
            permittable: 9100,
          },
          {
            axles: 1,
            modifier: {
              category: VEHICLE_CATEGORIES.SEMI_TRAILER,
              position: RelativePosition.Before,
              minInteraxleSpacing: 420,
            },
            legal: 9100,
            permittable: 11000,
          },
        ],
        interaxleSpacings: [
          {
            axles: [11, 21, 31],
            min: 0,
          },
          {
            axles: [12, 22, 32],
            maxAxleUnitWeight: 23000,
            modifier: {
              category: VEHICLE_CATEGORIES.SEMI_TRAILER,
              position: RelativePosition.Before,
            },
            min: 420,
          },
          {
            axles: [13, 23, 33],
            maxAxleUnitWeight: 28000,
            modifier: {
              category: VEHICLE_CATEGORIES.SEMI_TRAILER,
              position: RelativePosition.Before,
            },
            min: 420,
          },
        ],
        displayCode: 'B',
      },
      {
        id: TRAILER_CODES.DOLLIES,
        name: 'Dollies',
        category: VEHICLE_CATEGORIES.DOLLY,
        displayCode: 'B',
      },
      {
        id: TRAILER_CODES.EXPANDO_SEMI_TRAILERS,
        name: 'Expando Semi-Trailers',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.FIXED_EQUIPMENT_CONVEYORS,
        name: 'Fixed Equipment - Conveyors',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.FIXED_EQUIPMENT_COUNTER_FLOW_ASPHALT_DRUM_MIXERS,
        name: 'Fixed Equipment - Counter Flow Asphalt Drum Mixers',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS,
        name: 'Fixed Equipment - Pony Trailers',
        category: VEHICLE_CATEGORIES.PONY_TRAILER,
        displayCode: 'B',
        defaultWeightDimensions: [
          {
            axles: 1,
            legal: 9100,
            permittable: 11000,
          },
          {
            axles: 1,
            modifier: {
              category: VEHICLE_CATEGORIES.POWER_UNIT,
              position: RelativePosition.Before,
              axles: 2,
              minInteraxleSpacing: 300,
            },
            legal: 9100,
            permittable: 9100,
          },
          {
            axles: 1,
            modifier: {
              category: VEHICLE_CATEGORIES.MULTI_STEER,
              position: RelativePosition.Before,
              axles: 2,
              minInteraxleSpacing: 300,
            },
            legal: 9100,
            permittable: 9100,
          },
          {
            axles: 1,
            modifier: {
              category: VEHICLE_CATEGORIES.POWER_UNIT,
              position: RelativePosition.Before,
              axles: 3,
              minInteraxleSpacing: 300,
            },
            legal: 9100,
            permittable: 9100,
          },
          {
            axles: 1,
            modifier: {
              category: VEHICLE_CATEGORIES.MULTI_STEER,
              position: RelativePosition.Before,
              axles: 3,
              minInteraxleSpacing: 300,
            },
            legal: 9100,
            permittable: 9100,
          },
          {
            axles: 3,
            legal: 21000,
            permittable: 21000,
          },
          {
            axles: 3,
            modifier: {
              category: VEHICLE_CATEGORIES.POWER_UNIT,
              position: RelativePosition.Before,
              axles: 1,
              minInteraxleSpacing: 300,
            },
            legal: 17000,
            permittable: 17000,
          },
          {
            axles: 3,
            modifier: {
              category: VEHICLE_CATEGORIES.MULTI_STEER,
              position: RelativePosition.Before,
              axles: 1,
              minInteraxleSpacing: 300,
            },
            legal: 17000,
            permittable: 17000,
          },
          {
            axles: 3,
            modifier: {
              category: VEHICLE_CATEGORIES.POWER_UNIT,
              position: RelativePosition.Before,
              axles: 2,
              minInteraxleSpacing: 550,
            },
            legal: 17000,
            permittable: 21000,
          },
          {
            axles: 3,
            modifier: {
              category: VEHICLE_CATEGORIES.MULTI_STEER,
              position: RelativePosition.Before,
              axles: 2,
              minInteraxleSpacing: 550,
            },
            legal: 17000,
            permittable: 21000,
          },
        ],
      },
      {
        id: TRAILER_CODES.FIXED_EQUIPMENT_PORTABLE_ASPHALT_BAGHOUSES,
        name: 'Fixed Equipment - Portable Asphalt Baghouses',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILERS,
        name: 'Fixed Equipment - Semi-Trailers',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS,
        name: 'Fixed Equipment - Wheeler Semi-Trailers',
        category: VEHICLE_CATEGORIES.WHEELER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILER_PEACE_RIVER,
        name: 'Fixed Equipment - Semi Trailer (16 and 24 Wheeler) Peace River Only',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.FLOAT_TRAILERS,
        name: 'Float Trailers',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.FULL_TRAILERS,
        name: 'Full Trailers',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.JEEPS,
        name: 'Jeeps',
        category: VEHICLE_CATEGORIES.JEEP,
        ignoreForSizeDimensions: true,
        displayCode: 'J',
        interaxleSpacings: [
          {
            axles: [11, 21, 31],
            min: 120,
          },
          {
            axles: [22, 32, 23, 33],
            min: 420,
          },
        ],
      },
      {
        id: TRAILER_CODES.LOGGING_NON_TAC_B_TRAINS,
        name: 'Legacy Logging Trailer Combinations - Non-TAC B-Trains',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.LOGGING_SINGLE_AXLE_JEEPS,
        name: 'Legacy Logging Trailer Combinations - Single Axle Jeeps, Tandem Axle Pole Trailers, Dogloggers',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.LOGGING_TRI_AXLE_TRAILERS,
        name: 'Legacy Logging Trailer Combinations - Single Axle Jeeps, Tri Axle Trailers',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.LOGGING_TANDEM_POLE_TRAILERS_DOGLOGGERS,
        name: 'Legacy Logging Trailer Combinations - Tandem Pole Trailers, Dogloggers',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.LOGGING_SEMI_TRAILER_EMPTY,
        name: 'Logging Semi-Trailer - Empty, 3.2 m Bunks',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.LOGGING_FULL_TRAILERS,
        name: 'Logging Trailer - Full Trailers, Tri Axle, Quad Axle',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.LOGGING_OVERWIDTH_BUNKS,
        name: 'Logging Trailers - Overwidth Bunks',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.MANUFACTURED_HOMES_OVER_5M,
        name: 'Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW) with Attached Axles',
        category: VEHICLE_CATEGORIES.PONY_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.MANUFACTURED_HOMES_UNDER_5M,
        name: 'Manufactured Homes, Modular Buildings, Structures and Houseboats (<= 5.0 m OAW) with Attached Axles',
        category: VEHICLE_CATEGORIES.PONY_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
        name: 'Oil and Gas - Oversize Oilfield Flat Deck Semi-Trailers',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.OVERDIMENSIONAL_TRAILERS_FOR_EXPORT,
        name: 'Overdimensional Trailers and Semi-Trailers (For Export)',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.PARK_MODEL_HOMES,
        name: 'Park Model Homes with Attached Axles',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.PLATFORM_TRAILERS,
        name: 'Platform Trailers',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        additionalAxleSubType:
          TRAILER_CODES.ADDITIONAL_AXLE_UNIT_PLATFORM_TRAILER,
        displayCode: 'B',
      },
      {
        id: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
        name: 'Platform Trailers - Wheelers',
        category: VEHICLE_CATEGORIES.WHEELER,
        additionalAxleSubType:
          TRAILER_CODES.ADDITIONAL_AXLE_UNIT_PLATFORM_TRAILER,
        displayCode: 'B',
        defaultWeightDimensions: [
          {
            axles: 3,
            legal: 24000,
            permittable: 28000,
          },
          {
            axles: 3,
            legal: 24000,
            permittable: 29000,
            permittableAxleSpread: {
              min: 240,
              max: 370,
            },
          },
        ],
      },
      {
        id: TRAILER_CODES.POLE_TRAILERS,
        name: 'Pole Trailers',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.PONY_TRAILERS,
        name: 'Pony Trailers',
        category: VEHICLE_CATEGORIES.PONY_TRAILER,
        displayCode: 'B',
        defaultWeightDimensions: [
          {
            axles: 1,
            legal: 9100,
            permittable: 11000,
          },
          {
            axles: 1,
            modifier: {
              category: VEHICLE_CATEGORIES.POWER_UNIT,
              position: RelativePosition.Before,
              axles: 2,
              minInteraxleSpacing: 300,
            },
            legal: 9100,
            permittable: 9100,
          },
          {
            axles: 1,
            modifier: {
              category: VEHICLE_CATEGORIES.MULTI_STEER,
              position: RelativePosition.Before,
              axles: 2,
              minInteraxleSpacing: 300,
            },
            legal: 9100,
            permittable: 9100,
          },
          {
            axles: 1,
            modifier: {
              category: VEHICLE_CATEGORIES.POWER_UNIT,
              position: RelativePosition.Before,
              axles: 3,
              minInteraxleSpacing: 300,
            },
            legal: 9100,
            permittable: 9100,
          },
          {
            axles: 1,
            modifier: {
              category: VEHICLE_CATEGORIES.MULTI_STEER,
              position: RelativePosition.Before,
              axles: 3,
              minInteraxleSpacing: 300,
            },
            legal: 9100,
            permittable: 9100,
          },
          {
            axles: 3,
            legal: 21000,
            permittable: 21000,
          },
          {
            axles: 3,
            modifier: {
              category: VEHICLE_CATEGORIES.POWER_UNIT,
              position: RelativePosition.Before,
              axles: 1,
              minInteraxleSpacing: 300,
            },
            legal: 17000,
            permittable: 17000,
          },
          {
            axles: 3,
            modifier: {
              category: VEHICLE_CATEGORIES.MULTI_STEER,
              position: RelativePosition.Before,
              axles: 1,
              minInteraxleSpacing: 300,
            },
            legal: 17000,
            permittable: 17000,
          },
          {
            axles: 3,
            modifier: {
              category: VEHICLE_CATEGORIES.POWER_UNIT,
              position: RelativePosition.Before,
              axles: 2,
              minInteraxleSpacing: 550,
            },
            legal: 17000,
            permittable: 21000,
          },
          {
            axles: 3,
            modifier: {
              category: VEHICLE_CATEGORIES.MULTI_STEER,
              position: RelativePosition.Before,
              axles: 2,
              minInteraxleSpacing: 550,
            },
            legal: 17000,
            permittable: 21000,
          },
        ],
      },
      {
        id: TRAILER_CODES.READY_MIX_CONCRETE_PUMP_SEMI_TRAILERS,
        name: 'Ready Mix Concrete Pump Semi-Trailers',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS,
        name: 'Semi-Trailers',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_A_TRAINS_C_TRAINS,
        name: 'Semi-Trailers - A-Trains and C-Trains',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_B_TRAINS,
        name: 'Semi-Trailers - B-Trains',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.HIBOYS_EXPANDOS,
        name: 'Semi-Trailers - Hiboys/Expandos',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.HIBOYS_FLAT_DECKS,
        name: 'Semi-Trailers - Hiboys/Flat Decks',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.STEERING_DOLLIES,
        name: 'Steering Dollies',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'B',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_INSULATED_VANS_REEFER,
        name: 'Semi-Trailers - Insulated Vans with Reefer/Refrigeration Units',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_LOGGING,
        name: 'Semi-Trailers - Logging',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_NON_TAC_SHORT_CHASSIS,
        name: 'Semi-Trailers - Non-Tac Short Chassis',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
        name: 'Semi-Trailers - Single Drop, Double Drop, Step Decks, Lowbed, Expandos, etc.',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_SPREAD_TANDEMS,
        name: 'Semi-Trailers - Spread Tandems',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
        defaultWeightDimensions: [
          {
            axles: 2,
            legal: 9100,
            permittable: 18200,
          },
        ],
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
        name: 'Semi-Trailers - Steering Trailers',
        category: VEHICLE_CATEGORIES.STEERING_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_STINGER_STEEERED_AUTOMOBILE_TRANSPORTERS,
        name: 'Semi-Trailers - Stinger Steered Automobile Transporters',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_WALLED_B_TRAINS,
        name: 'Semi-Trailers - Walled B-Trains (Chip Trucks)',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
        name: 'Semi-Trailers - Wheelers',
        category: VEHICLE_CATEGORIES.WHEELER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
        name: 'Semi-Trailers - Wide Wheelers',
        // TODO the category for this trailer has been updated from 'wheeler' to 'wide-wheelers' in accordance with the OWDS. This causes a single test to fail (see TODO in semi-tandem-configured-weight.spec)
        category: VEHICLE_CATEGORIES.WIDE_WHEELERS,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
        name: 'Semi-Trailers with Crane',
        category: VEHICLE_CATEGORIES.SEMI_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.STEERING_TRAILERS_MANNED,
        name: 'Steering Trailers - Manned',
        category: VEHICLE_CATEGORIES.STEERING_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
        name: 'Steering Trailers - Self/Remote',
        category: VEHICLE_CATEGORIES.STEERING_TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.STINGER_STEERED_AUTOMOBILE_TRANSPORTERS,
        name: 'Stinger Steered Automobile Transporters',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.TANDEM_TRIDEM_DRIVE_B_TRAIN,
        name: 'Tandem/Tridem Drive B-Train (Super B-Train)',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.LEGACY_LOGGING_TRAILER_COMBINATIONS,
        name: 'Legacy Logging Trailer Combinations',
        // TODO check category with Michael
        category: VEHICLE_CATEGORIES.TRAILER,
        displayCode: 'T',
      },
      {
        id: TRAILER_CODES.NONE,
        name: 'None',
        category: VEHICLE_CATEGORIES.PSEUDO,
        ignoreForAxleCalculation: true,
      },
    ],
  },
  commodities: [
    {
      id: COMMODITY_CODES.NONE,
      name: 'None',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_COUNTER_FLOW_ASPHALT_DRUM_MIXERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.72,
                  l: 31,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 28000,
                },
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 29000,
                  permittableAxleSpread: {
                    minExclusive: 300,
                    max: 370,
                  },
                },
              ],
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_PORTABLE_ASPHALT_BAGHOUSES,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 4.26,
                  h: 4.72,
                  l: 31,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 28000,
                },
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 29000,
                  permittableAxleSpread: {
                    minExclusive: 300,
                    max: 370,
                  },
                },
              ],
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_CONVEYORS,
              jeep: true,
              booster: false,
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 28000,
                },
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 29000,
                  permittableAxleSpread: {
                    minExclusive: 300,
                    max: 370,
                  },
                },
              ],
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILERS,
              jeep: true,
              booster: true,
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 28000,
                },
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 29000,
                  permittableAxleSpread: {
                    minExclusive: 300,
                    max: 370,
                  },
                },
              ],
            },
            {
              type: TRAILER_CODES.OVERDIMENSIONAL_TRAILERS_FOR_EXPORT,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.65,
                  h: 4.15,
                  l: 23,
                },
              ],
            },
            {
              type: TRAILER_CODES.READY_MIX_CONCRETE_PUMP_SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 23,
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 28000,
                },
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 29000,
                  permittableAxleSpread: {
                    minExclusive: 300,
                    max: 370,
                  },
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.3,
                  l: 31,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
                      l: 23,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.ELK_VALLEY.id,
                      l: 23,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      l: 23,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_INSULATED_VANS_REEFER,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.3,
                  l: 23,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_NON_TAC_SHORT_CHASSIS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 5,
                  rp: 2.25,
                  w: 2.6,
                  h: 4.15,
                  l: 20,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      l: 32,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 40,
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 36,
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 31,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: false,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: false,
              booster: false,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 52000,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
          trailers: [
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 4,
                  w: 3.2,
                  h: 4.3,
                  l: 31,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.5,
                  h: 4.4,
                  l: 12.5,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.ELK_VALLEY.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
          trailers: [
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.3,
                  l: 25,
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.3,
                  l: 14,
                  regions: [
                    {
                      region: 'PCE',
                      l: 15,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
          ],
          canAddAxleUnits: true,
        },
        {
          type: POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.3,
                  l: 25,
                },
              ],
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.RUBBER_TIRED_LOADERS,
          trailers: [
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.3,
                  l: 25,
                },
              ],
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.CRANES_MOBILE,
          trailers: [
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.3,
                  l: 25,
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.3,
                  l: 14,
                  regions: [
                    {
                      region: 'PCE',
                      l: 15,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 4,
                  w: 3.2,
                  h: 4.3,
                  l: 31,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.FULL_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.MANUFACTURED_HOMES_UNDER_5M,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.9,
                  w: 5,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.MANUFACTURED_HOMES_OVER_5M,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.9,
                  w: 6,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      w: 6.1,
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 16,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.4,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.OVERDIMENSIONAL_TRAILERS_FOR_EXPORT,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.65,
                  h: 4.15,
                  l: 23,
                },
              ],
            },
            {
              type: TRAILER_CODES.PARK_MODEL_HOMES,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.9,
                  w: 4.4,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_CONVEYORS,
              jeep: false,
              booster: false,
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 28000,
                },
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 29000,
                  permittableAxleSpread: {
                    minExclusive: 300,
                    max: 370,
                  },
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TELESCOPIC_CONVEYOR_TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 15.5,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 15.5,
                },
              ],
              weightPermittable: true,
            },
          ],
          canAddAxleUnits: true,
        },
        {
          type: POWER_UNIT_CODES.DOUBLE_DECKER_BUSES,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.42,
                  l: 12.5,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.ELK_VALLEY.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      h: 4.3,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 16,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 25,
                },
              ],
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 40,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 36,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_WITH_PME,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 16,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 25,
                },
              ],
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 40,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 36,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 16,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 25,
                },
              ],
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 40,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 36,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.SCRAPERS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 12.5,
                },
              ],
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCKS_FRONT_OR_UNDERBODY_PLOW_BLADES,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.2,
                  h: 4.15,
                  l: 12.5,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.INTERCITY_BUSES_PULLING_PONY_TRAILERS,
          trailers: [
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 20,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 32,
                  regions: [
                    {
                      region: 'PCE',
                      l: 31,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 41,
                },
              ],
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.LOGGING_TRUCKS_OFF_HIGHWAY,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS_LOGGING,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 4.4,
                  h: 4.15,
                  l: 23,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.PICKER_TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              weightPermittable: true,
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.DOGLOGGER_SJOSTRUM_TRAILERS_DECKED,
      name: 'Doglogger/Sjostrum Trailers (decked)',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 5,
                  w: 2.6,
                  h: 4.15,
                  l: 13.5,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.GRADER_TRACTOR_BLADES_BUCKETS,
      name: 'Grader, Tractor Blades, Buckets',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 0,
                  rp: 0,
                  w: 4.4,
                  h: 4.15,
                  l: 12.5,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.HAYRACK_SEMI_TRAILER_WITH_A_FOLDED_CHASSIS_EMPTY_PIGGYBACK,
      name: 'Hayrack Semi-Trailer with a Folded Chassis/Empty Piggyback',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS_LOGGING,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 5,
                  w: 2.6,
                  h: 4.15,
                  l: 23,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.INTERMODAL_CONTAINERS,
      name: 'Intermodal Containers',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.4,
                  l: 12.5,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS_A_TRAINS_C_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.4,
                  l: 26,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_B_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.4,
                  l: 27.5,
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.4,
                  l: 23,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.INTERMODAL_CONTAINERS_WITHOUT_SIDES,
      name: 'Intermodal Containers without Sides',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 4.4,
                  h: 4.72,
                  l: 23,
                },
              ],
              weightPermittable: true,
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.LOGS_POLES_AND_BOOMSTICKS_UP_TO_20_1,
      name: 'Logs, Poles And Boomsticks (Up To 20.1)',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.FULL_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.9,
                  h: 4.15,
                  l: 27.5,
                },
              ],
            },
            {
              type: TRAILER_CODES.LEGACY_LOGGING_TRAILER_COMBINATIONS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 5,
                  w: 2.6,
                  h: 4.15,
                  l: 25,
                },
              ],
            },
            {
              type: TRAILER_CODES.POLE_TRAILERS,
              jeep: true,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.9,
                  h: 4.15,
                  l: 27.5,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_A_TRAINS_C_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.9,
                  h: 4.15,
                  l: 26,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_B_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.9,
                  h: 4.15,
                  l: 27.5,
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.9,
                  h: 4.15,
                  l: 25,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_LOGGING,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.9,
                  h: 4.15,
                  l: 25,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.LOGS_POLES_AND_BOOMSTICKS_OVER_20_1,
      name: 'Logs, Poles And Boomsticks (Over 20.1)',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.LOGGING_FULL_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 10,
                  w: 2.6,
                  h: 4.15,
                  l: 40,
                },
              ],
            },
            {
              type: TRAILER_CODES.POLE_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 8,
                  rp: 9,
                  w: 2.6,
                  h: 4.15,
                  l: 40,
                },
              ],
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 10,
                  w: 2.6,
                  h: 4.15,
                  l: 40,
                },
              ],
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 10,
                  w: 2.6,
                  h: 4.15,
                  l: 36,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.MANUFACTURED_HOMES_MODULAR_BUILDINGS_STRUCTURES_AND_HOUSEBOATS_LESS_THAN_5M_OAW,
      name: 'Manufactured Homes, Modular Buildings, Structures and Houseboats (<= 5.0 m OAW)',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.9,
                  w: 5,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.FLOAT_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.9,
                  w: 5,
                  h: 4.57,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.9,
                  w: 5,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 7.5,
                  w: 5,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 7.5,
                  w: 5,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.MANUFACTURED_HOMES_MODULAR_BUILDINGS_STRUCTURES_AND_HOUSEBOATS_GREATER_THAN_5M_OAW,
      name: 'Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW)',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.9,
                  w: 6,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      w: 6.1,
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.FLOAT_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.9,
                  w: 6,
                  h: 4.57,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      w: 6.1,
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.9,
                  w: 6,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      w: 6.1,
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 7.5,
                  w: 6,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      w: 6.1,
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 7.5,
                  w: 6,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      w: 6.1,
                      h: 5.33,
                      l: 36,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: false,
              booster: false,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
              jeep: false,
              booster: false,
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 28000,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: false,
              booster: false,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 28000,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.PARK_MODEL_HOMES,
      name: 'Park Model Homes',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.9,
                  w: 4.4,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.FLOAT_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.9,
                  w: 4.4,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.9,
                  w: 4.4,
                  h: 4.88,
                  l: 31.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.PIPE_AND_STEEL_PRODUCTS_REBAR_PILINGS_REINFORCING_STEEL_ETC,
      name: 'Pipe And Steel Products (Rebar, Pilings, Reinforcing Steel, Etc.)',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 31,
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 36,
                },
              ],
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 40,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.REDUCIBLE_LOADS,
      name: 'Reducible Loads',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_A_TRAINS_C_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 26,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_B_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_LOGGING,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 40,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 36,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.4,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.FULL_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.4,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 16,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.4,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.4,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_WITH_PME,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1.2,
                  w: 2.6,
                  h: 4.3,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STINGER_STEEERED_AUTOMOBILE_TRANSPORTERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1.2,
                  w: 2.6,
                  h: 4.3,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: POWER_UNIT_CODES.SCRAPERS,
      name: 'Scraper on Dollies',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: true,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.2,
                  h: 4.3,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.4,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.OIL_FIELD_EQUIPMENT,
      name: 'Oil Field Equipment',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.EXPANDO_SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.3,
                  l: 27.5,
                },
              ],
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 5,
                  w: 3.3,
                  h: 4.3,
                  l: 14,
                },
              ],
            },
            {
              type: TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.3,
                  h: 4.3,
                  l: 23,
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 28000,
                },
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 29000,
                  permittableAxleSpread: {
                    minExclusive: 300,
                    max: 370,
                  },
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 5,
                  w: 3.2,
                  h: 4.3,
                  l: 15,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 25,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.3,
                  l: 15,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.3,
                  l: 23,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 6.5,
                  w: 2.9,
                  h: 4.15,
                  l: 15.5,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 10,
                  rp: 6.5,
                  w: 2.9,
                  h: 4.15,
                  l: 23,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.3,
                  h: 4.3,
                  l: 23,
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 28000,
                },
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 29000,
                  permittableAxleSpread: {
                    minExclusive: 300,
                    max: 370,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.TANDEM_JEEP_POLE_TRAILER_LOADED_ON_LOGGING_TRUCK,
      name: 'Tandem Jeep/Pole Trailer Loaded on Logging Truck',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 5,
                  w: 2.9,
                  h: 4.3,
                  l: 12.5,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 5,
                  w: 2.9,
                  h: 4.3,
                  l: 12.5,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.TOW_TRUCKS_AND_DISABLED_VEHICLES,
      name: 'Tow Trucks And Disabled Vehicles',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TOW_VEHICLES,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.3,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.TRI_AXLE_OR_QUAD_AXLE_FULL_TRAILER_LOADED_ON_LOGGING_TRUCK,
      name: 'Tri-Axle or Quad Axle Full Trailer Loaded on Logging Truck',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 5,
                  w: 2.6,
                  h: 4.3,
                  l: 13.5,
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 5,
                  w: 2.6,
                  h: 4.3,
                  l: 13.5,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.WOODCHIPS_RESIDUALS,
      name: 'Wood Chips, Residuals',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS_B_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.45,
                  l: 27.5,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.EMPTY,
      name: 'Empty',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.LOGGING_OVERWIDTH_BUNKS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 0,
                  rp: 0,
                  w: 3.2,
                  h: 4.15,
                  l: 23,
                },
              ],
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.4,
                  l: 31,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
                      h: 4.15,
                    },
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.4,
                  l: 27.5,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
                      h: 4.15,
                    },
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.4,
                  l: 31,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
                      h: 4.15,
                    },
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
                      h: 4.15,
                    },
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 40000,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
                      h: 4.15,
                    },
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 52000,
                },
              ],
            },
            {
              type: TRAILER_CODES.EXPANDO_SEMI_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 23,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      l: 27.5,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 52000,
                },
              ],
            },
            {
              type: TRAILER_CODES.EXPANDO_SEMI_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_WITH_PME,
          trailers: [
            {
              type: TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 23,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      l: 27.5,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 52000,
                },
              ],
            },
            {
              type: TRAILER_CODES.EXPANDO_SEMI_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
          trailers: [
            {
              type: TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 23,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      l: 27.5,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.15,
                  l: 27.5,
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 52000,
                },
              ],
            },
            {
              type: TRAILER_CODES.EXPANDO_SEMI_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: false,
              booster: true,
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.PICKER_TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 0,
                  rp: 0,
                  w: 2.6,
                  h: 4.15,
                  l: 23,
                },
              ],
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              weightPermittable: true,
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.GARBAGE_BINS,
      name: 'Garbage Bins',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.FULL_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 23,
                },
              ],
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 12.5,
                },
              ],
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 23,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.LAMINATED_BEAMS,
      name: 'Laminated Beams',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.POLE_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 40,
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 31,
                },
              ],
              weightPermittable: true,
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.HAY_BALES_LARGE_RECTANGULAR,
      name: 'Hay Bales Large Rectangular',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.FULL_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 4,
                  w: 3.05,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.05,
                  h: 4.3,
                  l: 12.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 4,
                  w: 3.05,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS_A_TRAINS_C_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.05,
                  h: 4.3,
                  l: 26,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_B_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.05,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.05,
                  h: 4.4,
                  l: 23,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.ELK_VALLEY.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.05,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.HAY_BALES_ROUND,
      name: 'Hay Bales Round',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.FULL_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 4,
                  w: 3.5,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.8,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      w: 3.84,
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.5,
                  h: 4.3,
                  l: 12.5,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.8,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      w: 3.84,
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 4,
                  w: 3.5,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.8,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      w: 3.84,
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS_A_TRAINS_C_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.5,
                  h: 4.3,
                  l: 26,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.8,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      w: 3.84,
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_B_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.5,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.8,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      w: 3.84,
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.5,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.8,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      w: 3.84,
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.5,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.8,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      w: 3.84,
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.HAY_BALES_SMALL_RECTANGULAR,
      name: 'Hay Bales Small Rectangular',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.FULL_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 4,
                  w: 3.05,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.05,
                  h: 4.3,
                  l: 12.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 4,
                  w: 3.05,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS_A_TRAINS_C_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.05,
                  h: 4.3,
                  l: 26,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_B_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 3.05,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.05,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.05,
                  h: 4.3,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      h: 4.8,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.BRIDGE_BEAMS,
      name: 'Bridge Beams',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.POLE_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 31,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 31,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.STEERING_DOLLIES,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 36,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.NON_REDUCIBLE_LOADS,
      name: 'Non-Reducible Loads',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.DOLLIES,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.FULL_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 16,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
          weightDimensions: [
            {
              axles: 11,
              saLegal: 9100,
              saPermittable: 9100,
              daLegal: 9100,
              daPermittable: 11000,
            },
            {
              axles: 13,
              saLegal: 9100,
              saPermittable: 9100,
              daLegal: 24000,
              daPermittable: 28000,
            },
          ],
          trailers: [
            {
              type: TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.3,
                  h: 4.3,
                  l: 23,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.4,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.4,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 40,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 36,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 52000,
                },
              ],
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_WITH_PME,
          weightDimensions: [
            {
              axles: 11,
              saLegal: 9100,
              saPermittable: 9100,
              daLegal: 9100,
              daPermittable: 11000,
            },
            {
              axles: 13,
              saLegal: 9100,
              saPermittable: 9100,
              daLegal: 24000,
              daPermittable: 28000,
            },
          ],
          trailers: [
            {
              type: TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.3,
                  h: 4.3,
                  l: 23,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.4,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.4,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 40,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 36,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 52000,
                },
              ],
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
          weightDimensions: [
            {
              axles: 11,
              saLegal: 9100,
              saPermittable: 9100,
              daLegal: 9100,
              daPermittable: 11000,
            },
            {
              axles: 13,
              saLegal: 9100,
              saPermittable: 9100,
              daLegal: 24000,
              daPermittable: 28000,
            },
          ],
          trailers: [
            {
              type: TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.3,
                  h: 4.3,
                  l: 23,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.4,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.4,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 40,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 36,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 52000,
                },
              ],
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              weightPermittable: true,
              canAddAxleUnits: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS,
              jeep: true,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 1,
                  legal: 17000,
                  permittable: 21000,
                },
                {
                  axles: 2,
                  legal: 21000,
                  permittable: 21000,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_A_TRAINS_C_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.4,
                  l: 26,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_B_TRAINS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.4,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.HIBOYS_EXPANDOS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.4,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.HIBOYS_FLAT_DECKS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.4,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_LOGGING,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.15,
                  l: 27.5,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STEERING_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 40000,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_MANNED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 40,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 36,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              canAddAxleUnits: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 5,
                  h: 4.88,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
              weightDimensions: [
                {
                  axles: 3,
                  legal: 24000,
                  permittable: 52000,
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SPREAD_TANDEMS,
              jeep: false,
              booster: false,
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1.2,
                  w: 2.6,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STINGER_STEEERED_AUTOMOBILE_TRANSPORTERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1.2,
                  w: 2.6,
                  h: 4.88,
                  l: 25,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.PICKER_TRUCKS,
          weightDimensions: [
            {
              axles: 11,
              saLegal: 9100,
              saPermittable: 9100,
              daLegal: 9100,
              daPermittable: 11000,
            },
            {
              axles: 13,
              saLegal: 9100,
              saPermittable: 9100,
              daLegal: 24000,
              daPermittable: 28000,
            },
          ],
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              weightPermittable: true,
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.AUTO_CARRIER_CAMPERS_AND_BOATS_STINGER_STEERED_TRANSPORTERS_ONLY,
      name: 'Auto Carrier, Campers And Boats (Stinger Steered Transporters Only)',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS_STINGER_STEERED,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS_STINGER_STEEERED_AUTOMOBILE_TRANSPORTERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1.2,
                  w: 2.6,
                  h: 4.4,
                  l: 25,
                  regions: [
                    {
                      region: GEOGRAPHIC_REGIONS.LOWER_MAINLAND.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.ELK_VALLEY.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.YOHO.id,
                      h: 4.3,
                    },
                    {
                      region: GEOGRAPHIC_REGIONS.PEACE.id,
                      h: 4.88,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.HAY_BALES_ROUND_PEACE_RIVER_ONLY,
      name: 'Hay Bales (Round) Peace River Only',
      powerUnits: [],
    },
    {
      id: COMMODITY_CODES.BRUSHCUTTERS,
      name: 'Brushcutters (Peace Only)',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.NONE,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 12.5,
                  regions: [
                    {
                      region: 'PCE',
                      w: 4.57,
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 1,
                  w: 2.6,
                  h: 4.15,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      w: 3.8,
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.SEMI_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      w: 4.57,
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 2.6,
                  h: 4.15,
                  l: 23,
                  regions: [
                    {
                      region: 'PCE',
                      w: 4.57,
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: COMMODITY_CODES.FIXED_EQUIPMENT,
      name: 'Fixed Equipment',
      powerUnits: [
        {
          type: POWER_UNIT_CODES.TRUCK_TRACTORS,
          trailers: [
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILER_PEACE_RIVER,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.2,
                  h: 4.3,
                  l: 27.5,
                  regions: [
                    {
                      region: 'PCE',
                      w: 3.8,
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_CONVEYORS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 4,
                  rp: 9.5,
                  w: 3.8,
                  h: 4.72,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_COUNTER_FLOW_ASPHALT_DRUM_MIXERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.72,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_PORTABLE_ASPHALT_BAGHOUSES,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 4.26,
                  h: 4.72,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.72,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS,
              jeep: true,
              booster: true,
              selfIssue: false,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.72,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.SEMI_TRAILERS_SPREAD_TANDEMS,
              jeep: false,
              booster: false,
              weightPermittable: true,
            },
          ],
        },
        {
          type: POWER_UNIT_CODES.TRUCKS,
          trailers: [
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_CONVEYORS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 4,
                  rp: 9.5,
                  w: 3.2,
                  h: 4.3,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_COUNTER_FLOW_ASPHALT_DRUM_MIXERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 3.8,
                  h: 4.72,
                  regions: [
                    {
                      region: 'PCE',
                      h: 5.33,
                    },
                  ],
                },
              ],
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 1,
                  rp: 4,
                  w: 3.2,
                  h: 4.3,
                },
              ],
              weightPermittable: true,
            },
            {
              type: TRAILER_CODES.FIXED_EQUIPMENT_PORTABLE_ASPHALT_BAGHOUSES,
              jeep: false,
              booster: false,
              selfIssue: true,
              sizePermittable: true,
              sizeDimensions: [
                {
                  fp: 3,
                  rp: 6.5,
                  w: 4.26,
                  h: 4.72,
                },
              ],
            },
            {
              type: TRAILER_CODES.PONY_TRAILERS,
              jeep: false,
              booster: false,
              weightPermittable: true,
            },
          ],
        },
      ],
    },
  ],
  globalSizeDefaults: {
    fp: 3,
    rp: 6.5,
    w: 2.6,
    h: 4.15,
    l: 31,
  },
  conditions: [
    {
      description: 'General Permit Conditions',
      condition: 'CVSE-1000',
      conditionLink: 'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251',
    },
    {
      description: 'Permit Scope and Limitation',
      condition: 'CVSE-1070',
      conditionLink: 'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261',
    },
    {
      description: 'Supplement for Structures',
      condition: 'CVSE-1000S',
      conditionLink: 'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1255',
    },
    {
      description: 'Log Permit Conditions',
      condition: 'CVSE-1000L',
      conditionLink: 'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1250',
    },
    {
      description: 'Highways and Restrictive Load Limits',
      condition: 'CVSE-1011',
      conditionLink: 'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1258',
    },
    {
      description: 'Routes Pre-Approved for 5.0 m OAW',
      condition: 'CVSE-1001',
      conditionLink: '',
    },
    {
      description: 'General Permit Conditions to 6.1 m in the Peace River Area',
      condition: 'CVSE-1002',
      conditionLink: '',
    },
    {
      description: 'East-West Overheight Corridors in the Lower Mainland',
      condition: 'CVSE-1010',
      conditionLink: '',
    },
    {
      description: 'Routes - Woods Chips & Residual',
      condition: 'CVSE-1012',
      conditionLink: 'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1259',
    },
    {
      description: 'Restricted Routes for Hauling Wood on Wide Bunks',
      condition: 'CVSE-1013',
      conditionLink: 'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1254',
    },
    {
      description: 'LCV Operating Conditions & Routes',
      condition: 'CVSE-1014',
      conditionLink: 'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1260',
    },
  ],
  standardTireSizes: [
    {
      name: '254 (10")',
      size: 254,
    },
    {
      name: '279.4 (11")',
      size: 279,
    },
    {
      name: '304.8 (12")',
      size: 305,
    },
    {
      name: '315 (12.4")',
      size: 315,
    },
    {
      name: '325 (12.8")',
      size: 325,
    },
    {
      name: '330 (13")',
      size: 330,
    },
    {
      name: '355 (14")',
      size: 355,
    },
    {
      name: '365 (14.4")',
      size: 365,
    },
    {
      name: '368 (14.5")',
      size: 368,
    },
    {
      name: '381 (15")',
      size: 381,
    },
    {
      name: '385 (15.2")',
      size: 385,
    },
    {
      name: '393 (15.5")',
      size: 393,
    },
    {
      name: '406 (16")',
      size: 406,
    },
    {
      name: '425 (16.7")',
      size: 425,
    },
    {
      name: '431 (17")',
      size: 431,
    },
    {
      name: '445 (17.5")',
      size: 445,
    },
    {
      name: '457 (18")',
      size: 457,
    },
    {
      name: '502 (19.8")',
      size: 502,
    },
    {
      name: '508 (20")',
      size: 508,
    },
    {
      name: '520 (20.5")',
      size: 520,
    },
    {
      name: '525 (20.7")',
      size: 525,
    },
    {
      name: '550 (21.7")',
      size: 550,
    },
    {
      name: '609 (24")',
      size: 609,
    },
    {
      name: '622 (24.5")',
      size: 622,
    },
    {
      name: '636 (25")',
      size: 636,
    },
    {
      name: '711.2 (28")',
      size: 711.2,
    },
  ],
  vehicleDisplayCodeDefaults: {
    prefixStandard: '',
    prefixUniversal: '=',
    paddingStandard: '-',
    paddingUniversal: '=',
    spacingUniversalDefault: 'MU',
    spacingUniversalSmall: 'SU',
    spacingUniversalLarge: 'LU',
    spacingUniversalSmallMax: 2,
    spacingUniversalLargeMin: 5,
    extraAxleUniversal: 'XU',
    endAxleUniversal: 'EU',
    maxAxlesStandard: 4,
    thresholdAxlesUniversal: 4,
    overAxlesCodeUniversal: '+',
    universalAxleCode: 'U',
    multiDigitPrefix: '.',
  },
};
