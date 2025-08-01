import completePolicyConfig from '../_test/policy-config/_current-config.json';
import { Policy } from '../policy-engine';
import { TrailerDimensions } from '../types';
import { toCsv } from '@iwsio/json-csv-core';

// json-csv-core options object
const options = {
  fields: [
    {
      name: 'noSelfIssue',
      label: 'No Self Issue',
      transform: (v: any) => (v ? 'X' : ''),
    },
    { name: 'commodity', label: 'Commodity' },
    { name: 'powerUnit', label: 'Power Unit' },
    { name: 'trailer', label: 'Trailer' },
    {
      name: 'jeep',
      label: 'Allow Jeep',
      transform: (v: any) => (v ? 'X' : ''),
    },
    {
      name: 'booster',
      label: 'Allow Booster',
      transform: (v: any) => (v ? 'X' : ''),
    },
    { name: 'lmn.width', label: 'LMN - Width' },
    { name: 'lmn.height', label: 'LMN - Height' },
    { name: 'lmn.length', label: 'LMN - Length' },
    { name: 'elk.width', label: 'ELK - Width' },
    { name: 'elk.height', label: 'ELK - Height' },
    { name: 'elk.length', label: 'ELK - Length' },
    { name: 'yho.width', label: 'YHO - Width' },
    { name: 'yho.height', label: 'YHO - Height' },
    { name: 'yho.length', label: 'YHO - Length' },
    { name: 'pce.width', label: 'PCE - Width' },
    { name: 'pce.height', label: 'PCE - Height' },
    { name: 'pce.length', label: 'PCE - Length' },
    { name: 'bcd.width', label: 'BCD - Width' },
    { name: 'bcd.height', label: 'BCD - Height' },
    { name: 'bcd.length', label: 'BCD - Length' },
    { name: 'fp', label: 'ORBC FP' },
    { name: 'rp', label: 'ORBC RP' },
  ],
};

/**
 * Converts the size dimensions stored in the complete policy json to csv
 * format matching the format used by business SMEs to verify the size
 * dimensions match official policy.
 * @param pol Policy with the size dimension set to convert
 * @returns CSV string matching input size dimension set format
 */
function sizeDimensionSestToCsv(pol: Policy): string | null {
  const sizeDimensionSet: Array<any> = [];

  pol.policyDefinition.commodities.forEach((commodity) => {
    const commodityName = commodity.name;
    commodity.powerUnits
      .filter((p) => {
        p.trailers.some((t) => t.sizePermittable);
      })
      .forEach((powerUnit) => {
        const powerUnitName = pol.getPowerUnitTypes().get(powerUnit.type);
        powerUnit.trailers.forEach((trailer) => {
          const trailerName = pol.getTrailerTypes().get(trailer.type);

          let bcDefaultDimensions;
          if (trailer.sizeDimensions && trailer.sizeDimensions.length > 0) {
            const dim = trailer.sizeDimensions[0];
            bcDefaultDimensions = {
              bcd: {
                width: dim.w,
                height: dim.h,
                length: dim.l,
              },
              fp: dim.fp,
              rp: dim.rp,
            };
          }

          const dimensionSetEntry = {
            noSelfIssue: !trailer.selfIssue,
            commodity: commodityName,
            powerUnit: powerUnitName,
            trailer: trailerName,
            jeep: trailer.jeep,
            booster: trailer.booster,
            lmn: getDimensionsForRegion(trailer, 'LMN'),
            elk: getDimensionsForRegion(trailer, 'ELK'),
            yho: getDimensionsForRegion(trailer, 'YHO'),
            pce: getDimensionsForRegion(trailer, 'PCE'),
            ...bcDefaultDimensions,
          };

          sizeDimensionSet.push(dimensionSetEntry);
        });
      });
  });

  const csvString = toCsv(sizeDimensionSet, options);
  return csvString;
}

/**
 * Extracts the dimensions for the trailer as it applies to the supplied
 * region, supplying BC Default values if no region configuration is available.
 * @param trailer Trailer size dimensions for the region
 * @param dimRegion Region the size dimensions are for - must match a region
 * id as stored in the policy configuration JSON
 * @returns object with width, height, and length for policy specific to the
 * region. Defaults to width, height, and length for bc default if no specific
 * region values are configured for the trailer.
 */
function getDimensionsForRegion(
  trailer: TrailerDimensions,
  dimRegion: string,
): any {
  if (trailer.sizeDimensions && trailer.sizeDimensions.length > 0) {
    const dim = trailer.sizeDimensions[0];
    if (dim.regions && dim.regions.length > 0) {
      const region = dim.regions.find((r) => r.region == dimRegion);
      if (region) {
        return {
          width: region.w ?? dim.w,
          height: region.h ?? dim.h,
          length: region.l ?? dim.l,
        };
      }
    }

    // Use BC Default if region not configured
    return {
      width: dim.w,
      height: dim.h,
      length: dim.l,
    };
  }

  // No dimensions in the input, return nothing
  return null;
}

const policy = new Policy(completePolicyConfig);
const csv = sizeDimensionSestToCsv(policy);

console.log(csv);
