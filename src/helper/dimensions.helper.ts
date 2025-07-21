import { RelativePosition } from '../enum';
import { Policy } from '../policy-engine';
import {
  AxleConfiguration,
  PowerUnitWeightDimension,
  RegionSizeOverride,
  SizeDimension,
  TrailerSize,
  TrailerWeightDimension,
  VehicleRelatives,
  WeightDimension,
} from '../types';
import { SingleAxleDimension } from '../types/weight-dimension';

/**
 * Gets the maximum size dimensions for a given permit type, commodity,
 * and vehicle configuration. A vehicle configuration's size dimension is
 * dictated by the configuration on the trailer. For configurations that
 * are just a power unit, a pseudo trailer type 'NONE' is used and the
 * size dimension is configured on that. Accessory category trailers
 * (e.g. jeeps and boosters) are not used for configuration since they
 * do not impact the size dimension in policy.
 * @param permitTypeId ID of the permit type to get size dimension for
 * @param commodityId ID of the commodity to get size dimension for
 * @param currentConfiguration Current vehicle configuration to get size dimension for
 * @param regions List of regions the vehicle will be traveling in. If not
 * supplied this defaults to the most restrictive size dimension (if multiple
 * are configured).
 * @returns SizeDimension for the given permit type, commodity, and configuration
 */
export function getSizeDimensionHelper(
  policy: Policy,
  permitTypeId: string,
  commodityId: string,
  configuration: Array<string>,
  regions?: Array<string>,
): SizeDimension | null {
  // Initialize the sizeDimension with global defaults
  let sizeDimension: SizeDimension | null = null;

  // Validate that the configuration is permittable
  if (policy.isConfigurationValid(permitTypeId, commodityId, configuration)) {
    // Get the power unit that has the size configuration
    const commodity = policy.getCommodityDefinition(commodityId);
    const powerUnit = commodity?.size?.powerUnits?.find(
      (pu) => pu.type == configuration[0],
    );
    if (!powerUnit) {
      throw new Error(
        `Configuration error: could not find power unit '${configuration[0]}'`,
      );
    }

    // Get the last trailer in the configuration that can be used for size calculations
    const sizeTrailer: string | undefined = Array.from(configuration)
      .reverse()
      .find((vehicleId) => {
        const trailerType =
          policy.policyDefinition.vehicleTypes.trailerTypes?.find(
            (v) => v.id == vehicleId,
          );
        return !trailerType?.ignoreForSizeDimensions;
      });

    if (sizeTrailer) {
      // Get the trailer size dimension array for the commodity
      const trailer: TrailerSize | undefined = powerUnit.trailers?.find(
        (t) => t.type == sizeTrailer,
      );

      let sizeDimensions: Array<SizeDimension>;

      if (
        trailer &&
        trailer.sizeDimensions &&
        trailer.sizeDimensions.length > 0
      ) {
        sizeDimensions = trailer.sizeDimensions;
      } else {
        sizeDimensions = new Array<SizeDimension>();
      }

      const sizeDimensionConfigured = selectCorrectSizeDimension(
        sizeDimensions,
        configuration,
        sizeTrailer,
      );

      if (sizeDimensionConfigured) {
        // Adjust the size dimensions for the regions travelled, if needed
        if (!regions) {
          // If we are not provided a list of regions, assume we are
          // traveling through all regions (will take the most restrictive
          // of all dimensions in all cases).
          console.log('Assuming all regions for size dimension lookup');
          regions = policy.policyDefinition.geographicRegions.map((g) => g.id);
        } else {
          console.log(`Using '${regions}' as regions for size lookup`);
        }
        const valueOverrides: Array<RegionSizeOverride> = [];
        regions?.forEach((r) => {
          let valueOverride: RegionSizeOverride;
          // Check to see if this region has specific size dimensions
          const regionOverride = sizeDimensionConfigured.regions?.find(
            (cr) => cr.region == r,
          );
          if (!regionOverride) {
            // The region travelled does not have an override, so it assumes
            // the dimensions of the bc default.
            valueOverride = {
              region: r,
              h: sizeDimensionConfigured.h,
              w: sizeDimensionConfigured.w,
              l: sizeDimensionConfigured.l,
            };
          } else {
            // There is a region override with one or more dimensions. Use this
            // value preferentially, using default dimension if not supplied
            valueOverride = {
              region: r,
              h: regionOverride.h ?? sizeDimensionConfigured.h,
              w: regionOverride.w ?? sizeDimensionConfigured.w,
              l: regionOverride.l ?? sizeDimensionConfigured.l,
            };
          }
          valueOverrides.push(valueOverride);
        });

        // At this point we have a complete set of size dimensions for each of
        // the regions that will be traversed. Take the minimum value of each
        // dimension for the final value.
        const minimumOverrides = valueOverrides.reduce(
          (accumulator, currentValue) => {
            if (typeof currentValue.h !== 'undefined') {
              if (typeof accumulator.h === 'undefined') {
                accumulator.h = currentValue.h;
              } else {
                accumulator.h = Math.min(accumulator.h, currentValue.h);
              }
            }
            if (typeof currentValue.w !== 'undefined') {
              if (typeof accumulator.w === 'undefined') {
                accumulator.w = currentValue.w;
              } else {
                accumulator.w = Math.min(accumulator.w, currentValue.w);
              }
            }
            if (typeof currentValue.l !== 'undefined') {
              if (typeof accumulator.l === 'undefined') {
                accumulator.l = currentValue.l;
              } else {
                accumulator.l = Math.min(accumulator.l, currentValue.l);
              }
            }
            return accumulator;
          },
          { region: '' },
        );

        sizeDimension = {
          rp: sizeDimensionConfigured.rp,
          fp: sizeDimensionConfigured.fp,
          h: minimumOverrides.h,
          w: minimumOverrides.w,
          l: minimumOverrides.l,
        };
      } else {
        console.log('Size dimension not configured for trailer');
      }
    } else {
      console.log('Could not locate trailer to use for size dimension');
    }
  } else {
    console.log('Configuration is invalid, returning null size dimension');
  }

  return sizeDimension;
}

/**
 * Selects the correct size dimension from a list of potential candidates, based
 * on the modifier of each dimension. If none of the modifiers match, returns
 * null.
 * @param sizeDimensions Size dimension options to choose from
 * @param configuration The full vehicle configuration
 * @param sizeTrailer The last trailer in the configuration that can be used
 * for size calculations (e.g. not a booster).
 */
export function selectCorrectSizeDimension(
  sizeDimensions: Array<SizeDimension>,
  configuration: Array<string>,
  sizeTrailer: string,
): SizeDimension | null {
  let matchingDimension: SizeDimension | null = null;

  if (sizeDimensions?.length > 0 && configuration?.length > 0) {
    for (const sizeDimension of sizeDimensions) {
      if (!sizeDimension.modifiers) {
        // This dimension has no modifiers, so it is the default if none of
        // the other specific modifiers match.
        matchingDimension = sizeDimension;
        console.log('Using default size dimension, no modifiers specified');
      } else {
        const sizeTrailerIndex = configuration.findIndex(
          (c) => sizeTrailer == c,
        );
        const isMatch: boolean | undefined = sizeDimension.modifiers?.every(
          (m) => {
            if (!m.type) {
              return false;
            }
            switch (m.position) {
              case RelativePosition.First.toString():
                return configuration[0] == m.type;
              case RelativePosition.Last.toString():
                return configuration[configuration.length - 1] == m.type;
              case RelativePosition.Before.toString():
                return configuration[sizeTrailerIndex - 1] == m.type;
              case RelativePosition.After.toString():
                return configuration[sizeTrailerIndex + 1] == m.type;
              default:
                return false;
            }
          },
        );
        // As soon as we find a dimension with matching modifiers,
        // set it and return it.
        if (isMatch) {
          matchingDimension = sizeDimension;
          break;
        }
      }
    }
  } else {
    console.log(
      'Either size dimensions or configuration array is null, no matching dimension returned',
    );
  }
  return matchingDimension;
}

/**
 * Gets the default legal and permittable weights for a
 * given power unit type and number of axles. The number of
 * axles is supplied as a 2-digit number, with the most
 * significant digit representing the steer axle unit and the
 * least significant digit representing the drive axle unit.
 * @param policy The instantiated policy object with weight config
 * @param subType Power unit subtype
 * @param axles Number of axles in the power unit axle units
 * @returns Array of power unit weights. Multiple power unit
 * weights may be returned if there are different weights
 * depending on prior / subsequent vehicles in the
 * configuration (weight modifiers). Will return an empty array
 * if the number of axles is not configured in policy.
 */
export function getDefaultPowerUnitWeightHelper(
  policy: Policy,
  subType: string,
  axles: number,
): Array<PowerUnitWeightDimension> {
  return getDefaultVehicleWeightHelper(
    policy,
    subType,
    axles,
    true,
  ) as Array<PowerUnitWeightDimension>;
}

/**
 * Gets the default legal and permittable weights for a
 * given trailer type and number of axles in the trailer axle
 * unit.
 * @param policy The instantiated policy object with weight config
 * @param subType Trailer subtype
 * @param axles Number of axles in the trailer axle unit
 * @returns Array of trailer weights. Multiple trailer
 * weights may be returned if there are different weights
 * depending on prior / subsequent vehicles in the
 * configuration (weight modifiers). Will return an empty array
 * if the number of axles is not configured in policy.
 */
export function getDefaultTrailerWeightHelper(
  policy: Policy,
  subType: string,
  axles: number,
): Array<TrailerWeightDimension> {
  return getDefaultVehicleWeightHelper(
    policy,
    subType,
    axles,
    false,
  ) as Array<TrailerWeightDimension>;
}

/**
 * Helper function for getting the default vehicle weight,
 * works for both power units and trailers based on the
 * value of the isPowerUnit flag. Not exported so not intended
 * to be used outside of this helper class.
 * @param policy The instantiated policy object with weight config
 * @param subType Trailer subtype
 * @param axles Number of axles in the vehicle
 * @param isPowerUnit Whether this vehicle is a power unit
 * @returns Array of weight dimensions, either TrailerWeightDimension
 * or PowerUnitWeightDimension based on the value of isPowerUnit
 */
function getDefaultVehicleWeightHelper(
  policy: Policy,
  subType: string,
  axles: number,
  isPowerUnit: boolean,
): Array<WeightDimension> {
  const vehicleDefinition = isPowerUnit
    ? policy.getPowerUnitDefinition(subType)
    : policy.getTrailerDefinition(subType);

  if (!vehicleDefinition) {
    throw new Error(`No definition found for vehicle type '${subType}'`);
  }

  // Prefer specific subtype weight definition
  const weights = vehicleDefinition.defaultWeightDimensions?.filter(
    (w) => w.axles === axles,
  );
  if (weights && weights.length > 0) {
    return JSON.parse(JSON.stringify(weights));
  }

  // Second preference is category weight definition
  const vehicleCategories = isPowerUnit
    ? policy.policyDefinition.vehicleCategories?.powerUnitCategories
    : policy.policyDefinition.vehicleCategories?.trailerCategories;

  const vehicleCategory = vehicleCategories?.find(
    (c) => c.id === vehicleDefinition.category,
  );

  if (vehicleCategory) {
    const overridesForAxle = vehicleCategory.defaultWeightDimensions?.filter(
      (w) => w.axles === axles,
    );
    if (overridesForAxle) {
      return JSON.parse(JSON.stringify(overridesForAxle));
    }
  }

  // Final preference is global weight default
  const globalDefaults = isPowerUnit
    ? policy.policyDefinition.globalWeightDefaults?.powerUnits
    : policy.policyDefinition.globalWeightDefaults?.trailers;

  const vehicleDefaults = globalDefaults?.filter((w) => w.axles === axles);
  if (vehicleDefaults) {
    // Return a copy of the vehicle weights
    return JSON.parse(JSON.stringify(vehicleDefaults));
  } else {
    return new Array<WeightDimension>();
  }
}

/**
 * Given a list of default weight dimensions and a vehicle
 * configuration, select the correct weight dimensions for
 * the axle unit at the supplied axleIndex. The weight dimensions
 * may have modifiers (e.g. if a tandem booster follows a tridem
 * semi trailer) - this method will select the correct weights
 * to be used for policy checks.
 * @param policy The instantiated policy object with weight config
 * @param weightDimensions Default weight dimensions for the vehicle
 * at the index indicated by axleIndex
 * @param configuration Full vehicle configuration
 * @param axleConfiguration Full axle weights of the vehicle configuration
 * @param axleIndex Index of the axle unit for which weights are
 * to be returned.
 * @returns Single axle dimension representing the legal and permittable
 * weights for the axle unit at the supplied axleIndex.
 */
export function selectCorrectWeightDimensionHelper(
  policy: Policy,
  weightDimensions: Array<WeightDimension>,
  configuration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
  axleIndex: number,
): SingleAxleDimension | null {
  let matchingDimension: SingleAxleDimension | null = null;

  if (!weightDimensions || weightDimensions.length === 0) {
    throw new Error('Missing weight dimensions');
  }

  if (!configuration || configuration.length === 0) {
    throw new Error('Missing configuration');
  }

  if (!axleConfiguration || axleConfiguration.length === 0) {
    throw new Error('Missing axle configuration');
  }

  if (axleIndex > configuration.length) {
    throw new Error('Invalid axle index value');
  }

  if (configuration.length !== axleConfiguration.length - 1) {
    // We expect the axle configuration array length to be one more
    // than the configuration length because the power unit has two
    // axle units.
    throw new Error(
      'Wrong number of axles configured for vehicle configuration',
    );
  }

  const relatives = getVehicleRelatives(policy, configuration, axleIndex);

  for (const weightDimension of weightDimensions) {
    // Just renaming this for conciseness
    const m = weightDimension.modifier;
    if (!m) {
      // This dimension has no modifiers, so it is the default
      if (axleIndex <= 1) {
        const pwd = weightDimension as PowerUnitWeightDimension;
        matchingDimension = {
          legal: axleIndex === 0 ? pwd.saLegal : pwd.daLegal,
          permittable: axleIndex === 0 ? pwd.saPermittable : pwd.daPermittable,
        };
      } else {
        const twd = weightDimension as TrailerWeightDimension;
        const { legal, permittable } = twd;
        matchingDimension = { legal, permittable };
      }
      console.log('Using default weight dimension, no modifiers specified');
    } else {
      let isMatch = false;
      // We can match by vehicle type or vehicle category
      let matcher = m.type;
      let isTypeMatch = true;
      if (!matcher) {
        matcher = m.category;
        isTypeMatch = false;
      }

      if (matcher) {
        switch (m.position) {
          case RelativePosition.First.toString():
            isMatch =
              matcher ==
              (isTypeMatch ? relatives.firstType : relatives.firstCategory);
            break;
          case RelativePosition.Last.toString():
            isMatch =
              matcher ==
              (isTypeMatch ? relatives.lastType : relatives.lastCategory);
            break;
          case RelativePosition.Before.toString(): {
            isMatch =
              matcher ==
              (isTypeMatch ? relatives.prevType : relatives.prevCategory);
            if (isMatch && m.axles) {
              isMatch =
                m.axles == axleConfiguration[axleIndex - 1].numberOfAxles;
            }
            const spacingFromPrev =
              axleConfiguration[axleIndex].interaxleSpacing;
            if (!spacingFromPrev) {
              console.log(
                `Axle configuration incorrect, missing interaxle spacing`,
              );
              isMatch = false;
              break;
            } else if (isMatch && m.minInterAxleSpacing) {
              isMatch = m.minInterAxleSpacing <= spacingFromPrev;
            }
            if (isMatch && m.maxInterAxleSpacing) {
              isMatch = m.maxInterAxleSpacing >= spacingFromPrev;
            }
            break;
          }
          case RelativePosition.After.toString(): {
            isMatch =
              matcher ==
              (isTypeMatch ? relatives.nextType : relatives.nextCategory);
            if (isMatch && m.axles) {
              isMatch =
                m.axles == axleConfiguration[axleIndex + 1].numberOfAxles;
            }
            const spacingToNext =
              axleConfiguration[axleIndex + 1].interaxleSpacing;
            if (!spacingToNext) {
              console.log(
                `Axle configuration incorrect, missing interaxle spacing`,
              );
              isMatch = false;
              break;
            } else if (isMatch && m.minInterAxleSpacing) {
              isMatch = m.minInterAxleSpacing <= spacingToNext;
            }
            if (isMatch && m.maxInterAxleSpacing) {
              isMatch = m.maxInterAxleSpacing >= spacingToNext;
            }
            break;
          }
          default:
            isMatch = false;
            break;
        }
      }

      // As soon as we find a dimension with matching modifiers,
      // set it and return it. The implication is that if there are
      // multiple modifiers that match, the first one will be
      // returned (so modifiers should be configured to be exclusive).
      if (isMatch) {
        const twd = weightDimension as TrailerWeightDimension;
        const { legal, permittable } = twd;
        matchingDimension = { legal, permittable };
        break;
      }
    }
  }

  return matchingDimension;
}

/**
 * Convenience method to get the vehicles in the configuration relative
 * to the axle unit at the indicated axleIndex, to be used when
 * evaluating weight modifiers.
 * @param policy The instantiated policy object with weight config
 * @param configuration Full vehicle configuration
 * @param axleIndex Index of the axle unit for which relatives are
 * to be returned.
 * @returns VehicleRelatives for the axle at the indicated axleIndex
 */
export function getVehicleRelatives(
  policy: Policy,
  configuration: Array<string>,
  axleIndex: number,
): VehicleRelatives {
  const firstType = configuration[0];
  const lastType = configuration[configuration.length - 1];
  const firstVehicle = policy.getVehicleDefinition(firstType);
  const lastVehicle = policy.getVehicleDefinition(lastType);

  // Get relevant nearby vehicle types for the target axle
  const vehicleRelatives: VehicleRelatives = {
    firstType: firstType,
    lastType: lastType,
    firstCategory: firstVehicle?.category,
    lastCategory: lastVehicle?.category,
  };

  if (axleIndex <= 1) {
    // First two axles are for the power unit which has no
    // previous type (it is first in the configuration always)
    vehicleRelatives.prevType = null;
    vehicleRelatives.prevCategory = null;
  } else {
    // Subtract 2 from the configuration index to account for
    // the fact that the power unit has two axles.
    vehicleRelatives.prevType = configuration[axleIndex - 2];
    vehicleRelatives.prevCategory = policy.getVehicleDefinition(
      vehicleRelatives.prevType,
    )?.category;
  }

  if (configuration.length === 1 || axleIndex === configuration.length) {
    // The axleIndex is for the last vehicle in the configuration,
    // so it has no next type.
    vehicleRelatives.nextType = null;
    vehicleRelatives.nextCategory = null;
  } else {
    vehicleRelatives.nextType = configuration[axleIndex];
    vehicleRelatives.nextCategory = policy.getVehicleDefinition(
      vehicleRelatives.nextType,
    )?.category;
  }

  return vehicleRelatives;
}
