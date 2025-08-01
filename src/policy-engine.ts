import {
  PolicyDefinition,
  PermitType,
  Commodity,
  VehicleType,
  SizeDimension,
  AxleConfiguration,
  BridgeCalculationResult,
  ConditionForPermit,
  TrailerType,
  PowerUnitType,
  TrailerWeightDimension,
  PowerUnitWeightDimension,
  WeightDimension,
  SingleAxleDimension,
  StandardTireSize,
  TrailerDimensions,
} from 'onroute-policy-engine/types';
import {
  extractIdentifiedObjects,
  intersectIdMaps,
} from './helper/lists.helper';
import { Engine, EngineResult } from 'json-rules-engine';
import { getRulesEngines } from './helper/rules-engine.helper';
import { ValidationResults } from './validation-results';
import { ValidationResult } from './validation-result';
import { addRuntimeFacts } from './helper/facts.helper';
import {
  AccessoryVehicleType,
  ValidationResultType,
  ValidationResultCode,
  VehicleTypes,
  VehicleCategory,
} from 'onroute-policy-engine/enum';
import { runBridgeFormula } from './helper/bridge-calculation.helper';
import { version } from './version';
import semverValid from 'semver/functions/valid';
import semverLt from 'semver/functions/lt';
import semverMajor from 'semver/functions/major';
import { SpecialAuthorizations } from './types/special-authorizations';
import { filterOutLcv, filterVehiclesByType } from './helper/vehicles.helper';
import { getConditionsForPermitHelper } from './helper/conditions.helper';
import {
  getSizeDimensionHelper,
  selectCorrectWeightDimensionHelper,
} from './helper/dimensions.helper';
import {
  getDefaultPowerUnitWeightHelper,
  getDefaultTrailerWeightHelper,
} from './helper/dimensions.helper';

/** Class representing commercial vehicle policy. */
export class Policy {
  /** Object representation of policy definition and rules. */
  policyDefinition: PolicyDefinition;

  /**
   * Special authorizations granted to a client, used
   * to adjust validations and allowed vehicles for permit types.
   */
  specialAuthorizations?: SpecialAuthorizations | null;

  /**
   * Map of json-rules-engine instances, one for each
   * permit type defined in the permit definition. Keyed
   * on permit type id.
   */
  rulesEngines: Map<string, Engine>;

  /**
   * Creates a new Policy object.
   * @param definition Policy definition to validate permits against
   */
  constructor(
    definition: PolicyDefinition,
    authorizations?: SpecialAuthorizations,
  ) {
    const cleanVersion = semverValid(version);
    // Check compatibility of the policy engine with the policy config
    if (!cleanVersion) {
      throw new Error(
        `Cannot determine the version of the policy engine for compatibility: invalid semver: ${version}`,
      );
    } else if (!semverValid(definition.minPEVersion)) {
      throw new Error(
        `Cannot determine the minimum PE version for the configuration: invalid semver: ${definition.minPEVersion}`,
      );
    } else if (semverLt(cleanVersion, definition.minPEVersion)) {
      throw new Error(
        `Current policy engine version is less than minimum version required for policy config: ${cleanVersion} > ${definition.minPEVersion}`,
      );
    } else if (semverMajor(cleanVersion) > semverMajor(definition.minPEVersion)) {
      throw new Error(
        `Current policy config minimum version is at least one major version behind policy engine: major(${definition.minPEVersion}) < major(${cleanVersion}))`,
      );
    }

    this.policyDefinition = definition;
    this.setSpecialAuthorizations(authorizations);

    this.rulesEngines = getRulesEngines(this);
  }

  /**
   * Sets a client's special authorizations to modify the policy validations
   * and permittable vehicles for permit types.
   * @param authorizations Special authorizations for a client
   */
  setSpecialAuthorizations(authorizations?: SpecialAuthorizations | null) {
    this.specialAuthorizations = authorizations;
  }

  /**
   * Validates a permit application against the policy definition.
   * @param permit The permit application to validate against policy
   * @returns Results of the validation of the permit application
   */
  async validate(permit: any): Promise<ValidationResults> {
    const engine = this.rulesEngines.get(permit.permitType);
    if (!engine) {
      // If the permit type being validated has no configuration in the
      // policy definition, there will be no engine for it. Return with
      // a single violation result.
      const validationResult: ValidationResults = new ValidationResults();
      validationResult.violations.push(
        new ValidationResult(
          ValidationResultType.Violation,
          ValidationResultCode.PermitTypeUnknown,
          `Permit type ${permit.permitType} unknown`,
        ),
      );
      return validationResult;
    } else {
      // Add facts specific to this run of the validation (e.g. validation
      // date for comparison against start date of the permit).
      addRuntimeFacts(engine, this);

      // Run the json-rules-engine against the permit facts
      const engineResult: EngineResult = await engine.run(permit);

      // Wrap the json-rules-engine result in a ValidationResult object
      const validationResults = new ValidationResults(engineResult);

      // Include an informational message if the client is an LCV carrier
      if (this.specialAuthorizations?.isLcvAllowed) {
        validationResults.information.push(
          new ValidationResult(
            ValidationResultType.Information,
            ValidationResultCode.IsLcvCarrier,
            `Policy validation allowing long combination vehicle permitting for client '${this.specialAuthorizations.companyId}'`,
          ),
        );
      }

      // Include an informational message and adjust the cost if the client
      // has a no fee flag set.
      if (this.specialAuthorizations?.noFeeType) {
        const originalPermitCost = validationResults?.cost.reduce(
          (accumulator, { cost }) => accumulator + (cost ?? 0),
          0,
        );

        // Clear the cost array and replace with zero cost
        validationResults.cost.length = 0;
        const newPermitCostResult = new ValidationResult(
          ValidationResultType.Cost,
          ValidationResultCode.CostValue,
          'Calculated permit cost',
        );
        newPermitCostResult.cost = 0;
        validationResults.cost.push(newPermitCostResult);

        // Add an informational message to the results
        validationResults.information.push(
          new ValidationResult(
            ValidationResultType.Information,
            ValidationResultCode.NoFeeClient,
            `Client '${this.specialAuthorizations.companyId}' has no fee flag, original permit cost would otherwise be '${originalPermitCost}'`,
          ),
        );
      }

      return validationResults;
    }
  }

  /**
   * Gets a list of conditions that are applicable for the supplied permit
   * application. The conditions may be driven by those applicable for the
   * permit type, or the vehicle type, or other aspects of the permit application.
   * @param permit The in-progress permit application
   * @returns Array of conditions that apply to the specific permit application
   */
  getConditionsForPermit(permit: any): Array<ConditionForPermit> {
    return getConditionsForPermitHelper(permit, this);
  }

  /**
   * Gets a list of all configured permit types in the policy definition.
   * @returns Map of permit type IDs to permit type names.
   */
  getPermitTypes(): Map<string, string> {
    const permitTypes = extractIdentifiedObjects(
      this.policyDefinition.permitTypes,
    );
    return permitTypes;
  }

  /**
   * Gets a list of all configured geographic regions in the policy definition.
   * @returns Map of geographic region IDs to region names.
   */
  getGeographicRegions(): Map<string, string> {
    const geographicRegions = extractIdentifiedObjects(
      this.policyDefinition.geographicRegions,
    );
    return geographicRegions;
  }

  /**
   * Filters out all long combination vehicles from the list of supplied
   * vehicle IDs, based on policy configuration.
   * @param vehicleList List of vehicles to filter
   * @returns Filtered list of vehicles without LCVs
   */
  filterOutLongCombinationVehicles(vehicleList: Array<string>): Array<string> {
    return filterOutLcv(vehicleList, this.policyDefinition.vehicleTypes);
  }

  /**
   * Gets a list of all configured commodities in the policy definition.
   * @param permitTypeId Return only commodities valid for this permit type.
   *   If not supplied, return all commodities configured in policy. If permit
   *   type does not require commodity (e.g. 'TROS'), return empty map.
   * @returns Map of commodity IDs to commodity names.
   */
  getCommodities(permitTypeId?: string): Map<string, string> {
    const permitType = this.getPermitTypeDefinition(permitTypeId);
    if (!permitTypeId) {
      // Permit type not supplied, return all commodities
      return extractIdentifiedObjects(this.policyDefinition.commodities);
    } else if (!permitType) {
      // Permit type invalid, throw error
      throw new Error(`Invalid permit type supplied: '${permitTypeId}'`);
    } else if (!permitType.commodityRequired) {
      return new Map<string, string>();
    } else {
      const commoditiesForOS = extractIdentifiedObjects(
        this.policyDefinition.commodities.filter((c) => {
          // Return true if any of the power units has any size
          // permittable trailers
          return c.powerUnits.some((p) =>
            p.trailers.some((t) => t.sizePermittable),
          );
        }),
      );

      const commoditiesForOW = extractIdentifiedObjects(
        this.policyDefinition.commodities.filter((c) => {
          // Return true if any of the power units has any size
          // permittable trailers
          return c.powerUnits.some((p) =>
            p.trailers.some((t) => t.weightPermittable),
          );
        }),
      );

      if (
        permitType.sizeDimensionRequired &&
        permitType.weightDimensionRequired
      ) {
        return intersectIdMaps(commoditiesForOS, commoditiesForOW);
      } else if (permitType.sizeDimensionRequired) {
        return commoditiesForOS;
      } else if (permitType.weightDimensionRequired) {
        return commoditiesForOW;
      } else {
        // This permit type requires commodity selection, but does not
        // require size or weight dimensions. For these permit types, the
        // allowedCommodities must be configured in policy. Return these.
        const commodities = extractIdentifiedObjects(
          this.policyDefinition.commodities,
          permitType.allowedCommodities,
        );
        return commodities;
      }
    }
  }

  /**
   * Gets a list of all allowable vehicle types for the given permit type
   * and commodity. Includes all power units and trailers.
   * @param permitTypeId ID of the permit type to get vehicles for
   * @param commodityId ID of the commodity to get vehicles for
   * @returns Map of two separate maps, one keyed on 'powerUnits' and the
   * other keyed on 'trailers'. Each map consists of a string id for the
   * vehicle, and a string common name for the vehicle.
   */
  getPermittableVehicleTypes(
    permitTypeId: string,
    commodityId?: string | null,
  ): Map<string, Map<string, string>> {
    if (!permitTypeId) {
      throw new Error('Missing permitTypeId');
    }

    const permitType = this.getPermitTypeDefinition(permitTypeId);
    if (!permitType) {
      throw new Error(`Invalid permit type: '${permitTypeId}'`);
    }

    if (!permitType.commodityRequired) {
      // If commodity is not required, get the permittable vehicle types
      // from the permit allowedVehicles list.
      return this.getAllowedVehicles(permitType);
    }

    let puTypes: Map<string, string>;
    let trTypes: Map<string, string>;
    const allowableCommodities = this.getCommodities(permitTypeId);

    if (!commodityId) {
      throw new Error('Missing commodityId, permit type requires it');
    }

    if (!allowableCommodities.has(commodityId)) {
      // If the commodity is not allowed for the permit type, no power
      // units or trailers are allowed.
      puTypes = new Map<string, string>();
      trTypes = new Map<string, string>();
    } else {
      const commodity = this.getCommodityDefinition(commodityId);
      if (!commodity) {
        throw new Error(
          `Commodity id '${commodityId}' is not correctly configured in the policy definition`,
        );
      }

      // Extract the permittable power unit and trailer IDs. If the permit
      // type requires both size and weight dimension, only extract the
      // power units that have at least one trailer that is both size and
      // weight permittable.
      const permittablePowerUnits = commodity.powerUnits.filter((p) => {
        return p.trailers.some((t) => {
          return this.isTrailerPermittable(permitType, t);
        });
      });
      let puTypeIds = permittablePowerUnits.map((p) => p.type);
      let trTypeIds: Array<string> = [];
      permittablePowerUnits.forEach((pu) => {
        trTypeIds = trTypeIds.concat(
          pu.trailers
            .filter((t) => {
              return this.isTrailerPermittable(permitType, t);
            })
            .map((t) => t.type),
        );
      });
      // Remove duplicate trailer IDs
      trTypeIds = [...new Set(trTypeIds)];

      // Remove long combination vehicles if needed
      if (!this.specialAuthorizations?.isLcvAllowed) {
        puTypeIds = this.filterOutLongCombinationVehicles(puTypeIds);
        trTypeIds = this.filterOutLongCombinationVehicles(trTypeIds);
      }

      if (
        !(
          permitType.sizeDimensionRequired || permitType.weightDimensionRequired
        )
      ) {
        // This permit type requires commodity selection, but does not
        // require size or weight dimensions. For these permit types, the
        // allowedVehicles must be configured in policy. Return all power
        // units and trailers from this list.
        puTypeIds = permitType.allowedVehicles || [];
        trTypeIds = permitType.allowedVehicles || [];
      }

      puTypes = extractIdentifiedObjects(
        this.policyDefinition.vehicleTypes.powerUnitTypes,
        puTypeIds,
      );
      trTypes = extractIdentifiedObjects(
        this.policyDefinition.vehicleTypes.trailerTypes,
        trTypeIds,
      );
    }

    const vehicleTypes = new Map<string, Map<string, string>>();
    vehicleTypes.set(VehicleTypes.PowerUnits, puTypes);
    vehicleTypes.set(VehicleTypes.Trailers, trTypes);

    return vehicleTypes;
  }

  /**
   * Given a trailer dimensions object from the commodities
   * configuration and a permit type, return whether or not the
   * trailer is permittable - this will depend on whether the trailer
   * is size and/or weight permittable, and whether the permit
   * type requires size and/or weight dimensions.
   * @param permitType The permit type object
   * @param trailer The trailer dimensions object for a specific commodity
   * @returns true if the trailer is permittable, false otherwise
   */
  isTrailerPermittable(permitType: PermitType, trailer: TrailerDimensions) {
    if (
      permitType.sizeDimensionRequired &&
      permitType.weightDimensionRequired
    ) {
      return trailer.sizePermittable && trailer.weightPermittable;
    } else {
      return (
        (trailer.sizePermittable && permitType.sizeDimensionRequired) ||
        (trailer.weightPermittable && permitType.weightDimensionRequired)
      );
    }
  }

  /**
   * Gets a list of all allowable power unit types for the given permit type
   * and commodity.
   * @param permitTypeId ID of the permit type to get power units for
   * @param commodityId ID of the commodity to get power units for
   * @returns Map of power unit IDs to power unit names.
   */
  getPermittablePowerUnitTypes(
    permitTypeId: string,
    commodityId: string,
  ): Map<string, string> {
    const vehicleTypes = this.getPermittableVehicleTypes(
      permitTypeId,
      commodityId,
    );
    const puTypes = vehicleTypes.get(VehicleTypes.PowerUnits);
    return puTypes ?? new Map<string, string>();
  }

  /**
   * Gets the next permittable vehicles based on the supplied permit type,
   * commodity, and current configuration.
   * If the permit type does not require commodity or if the commodity
   * is not valid for the permit type, this will return an empty map
   * (meaning no vehicles are permittable).
   * @param permitTypeId ID of the permit type to get vehicles for
   * @param commodityId ID of the commodity to get vehicles for
   * @param currentConfiguration Current vehicle configuration to which will be
   * added the next permittable vehicle
   * @returns Map of vehicle ID to vehicle name. Includes both power units and
   * trailers in a single return value (if applicable).
   */
  getNextPermittableVehicles(
    permitTypeId: string,
    commodityId: string,
    currentConfiguration: Array<string>,
  ): Map<string, string> {
    if (!permitTypeId || !commodityId || !currentConfiguration) {
      throw new Error(
        'Missing permitTypeId and/or commodityId and/or currentConfiguration',
      );
    }

    const permitType = this.getPermitTypeDefinition(permitTypeId);
    if (!permitType) {
      throw new Error(`Invalid permit type: '${permitTypeId}'`);
    }

    if (!permitType.commodityRequired) {
      // If commodity is not required, this method cannot calculate the
      // permittable vehicle types since they will not be configured.
      throw new Error(
        `Permit type '${permitTypeId}' does not require a commodity`,
      );
    }

    const commodity = this.getCommodityDefinition(commodityId);
    if (!commodity) {
      throw new Error(`Invalid commodity type: '${commodityId}'`);
    }

    if (
      !this.isConfigurationValid(
        permitTypeId,
        commodityId,
        currentConfiguration,
        true,
      )
    ) {
      // Invalid configuration, no vehicles permitted
      return new Map<string, string>();
    }

    let vehicleTypes = new Map<string, string>();
    let vehicleTypeIds: Array<string> | undefined;
    const allVehicles: Array<VehicleType> =
      this.policyDefinition.vehicleTypes.powerUnitTypes.concat(
        this.policyDefinition.vehicleTypes.trailerTypes,
      );

    if (currentConfiguration.length == 0) {
      // The current configuration is empty, so return only the
      // allowable power units.
      vehicleTypeIds = Array.from(
        this.getPermittablePowerUnitTypes(permitTypeId, commodityId).keys(),
      );
    } else {
      const powerUnit = commodity.powerUnits.find(
        (p) => p.type == currentConfiguration[0],
      );

      let validTrailers;
      // ORV2-3953
      // If a jeep has been added, only add trailers that
      // permit jeeps from the trailer list
      if (currentConfiguration.includes(AccessoryVehicleType.Jeep)) {
        validTrailers = powerUnit?.trailers.filter((t) => t.jeep);
      } else {
        validTrailers = powerUnit?.trailers;
      }

      // Filter trailer list down to those permittable for the permit
      // type (size and/or weight dimensions required)
      validTrailers = validTrailers?.filter((t) =>
        this.isTrailerPermittable(permitType, t),
      );

      const trailerIds = validTrailers?.map((t) => t.type);
      const lastVehicleId =
        currentConfiguration[currentConfiguration.length - 1];

      const powerUnitType = this.getPowerUnitDefinition(powerUnit?.type);
      if (
        currentConfiguration.length == 1 ||
        lastVehicleId === powerUnitType?.additionalAxleSubType
      ) {
        // Just a power unit, optionally with one or more additional
        // axles. Return the list of trailerIds for the
        // power unit, plus jeep if any of the trailer Ids allow
        // a jeep.
        if (
          powerUnit?.trailers &&
          powerUnit?.trailers.filter((t) => t.jeep).length > 0
        ) {
          trailerIds?.push(AccessoryVehicleType.Jeep);
        }
        vehicleTypeIds = trailerIds;
      } else {
        switch (lastVehicleId) {
          case AccessoryVehicleType.Jeep:
            // If there is one jeep, there can be more
            trailerIds?.push(AccessoryVehicleType.Jeep);
            vehicleTypeIds = trailerIds;
            break;
          case AccessoryVehicleType.Booster:
            // If there is one booster, there can be more
            vehicleTypeIds = [AccessoryVehicleType.Booster];
            break;
          default:
            {
              // The last vehicle is either a trailer, or an
              // additional axle on the trailer. We need to
              // identify the actual trailer type to determine
              // if a booster is allowed.
              let trailer = powerUnit?.trailers.find(
                (t) => t.type == lastVehicleId,
              );
              if (!trailer) {
                // The last vehicle is not a trailer or a booster,
                // so must be an additional axle of the trailer since
                // we know this is a valid configuration at this point.
                // Work our way backwards through the configuration
                // to find the trailer.
                let i = currentConfiguration.length - 1;
                while (!trailer && i > 0) {
                  const prevVehicleId = currentConfiguration[--i];
                  trailer = powerUnit?.trailers.find(
                    (t) => t.type == prevVehicleId,
                  );
                }
              }

              if (trailer && trailer.booster) {
                vehicleTypeIds = [AccessoryVehicleType.Booster];
              } else {
                // Either the trailer does not permit a booster, or
                // we did not find the trailer which would be
                // unexpected. Either way, no more vehicles are
                // permittable.
                vehicleTypeIds = new Array<string>();
              }
            }
            break;
        }
      }
    }

    // Remove long combination vehicles if required
    if (!this.specialAuthorizations?.isLcvAllowed) {
      if (vehicleTypeIds) {
        vehicleTypeIds = this.filterOutLongCombinationVehicles(vehicleTypeIds);
      }
    }

    vehicleTypes = extractIdentifiedObjects(allVehicles, vehicleTypeIds);

    return vehicleTypes;
  }

  /**
   * Returns whether the supplied configuration is valid for the given permit type
   * and commodity. If the permit type does not require a commodity, or if this
   * method is called with a commodity not permitted for the permit type, this method
   * will return false.
   * @param permitTypeId ID of the permit type to validate the configuration against
   * @param commodityId ID of the commodity used for the configuration
   * @param currentConfiguration Current vehicle configuration to validate
   * @param validatePartial Whether to validate a partial configuration (e.g. one
   * that does not include a trailer). This will just return whether or not there
   * are any invalid vehicles in the configuration. If true, an empty current
   * configuration will return true from this method provided the commodity is
   * allowable for the permit type.
   */
  isConfigurationValid(
    permitTypeId: string,
    commodityId: string,
    currentConfiguration: Array<string>,
    validatePartial: boolean = false,
  ): boolean {
    if (!permitTypeId || !commodityId || !currentConfiguration) {
      throw new Error(
        'Missing permitTypeId and/or commodityId and/or currentConfiguration',
      );
    }

    const permitType = this.getPermitTypeDefinition(permitTypeId);
    if (!permitType) {
      throw new Error(`Invalid permit type: '${permitTypeId}'`);
    }

    if (!permitType.commodityRequired) {
      // If commodity is not required, this method cannot calculate the
      // permittable vehicle types since they will not be configured.
      throw new Error(
        `Permit type '${permitTypeId}' does not require a commodity`,
      );
    }

    const commodity = this.getCommodityDefinition(commodityId);
    if (!commodity) {
      throw new Error(`Invalid commodity type: '${commodityId}'`);
    }

    if (currentConfiguration.length == 0) {
      // The current configuration is empty. Fine for partial, but
      // invalid as a complete configuration.
      return validatePartial;
    }

    if (
      !this.specialAuthorizations ||
      !this.specialAuthorizations.isLcvAllowed
    ) {
      // No provision for allowing long combination vehicles
      const filteredConfiguration =
        this.filterOutLongCombinationVehicles(currentConfiguration);
      if (filteredConfiguration.length !== currentConfiguration.length) {
        // There is an LCV in the configuration, but we are not allowing
        // LCV permitting. Return false.
        return false;
      }
    }

    const permittablePowerUnits = this.getPermittablePowerUnitTypes(
      permitTypeId,
      commodityId,
    );
    if (!permittablePowerUnits.has(currentConfiguration[0])) {
      // The power unit is not permitted
      return false;
    }
    const powerUnit = commodity.powerUnits.find(
      (p) => p.type === currentConfiguration[0],
    );

    let trailerIds: Array<string> =
      powerUnit?.trailers
        .filter((t) => this.isTrailerPermittable(permitType, t))
        .map((t) => t.type) || [];

    let jeepAllowed: boolean = true;
    let trailerAllowed: boolean = true;
    let boosterAllowed: boolean = false;
    const powerUnitType = this.getPowerUnitDefinition(powerUnit?.type);
    let additionalAxleType: string = powerUnitType?.additionalAxleSubType || '';

    for (let i = 1; i < currentConfiguration.length; i++) {
      switch (currentConfiguration[i]) {
        case AccessoryVehicleType.Jeep:
          if (!jeepAllowed) {
            return false;
          }
          // Filter allowed trailers to only those that allow jeeps
          trailerIds =
            powerUnit?.trailers
              .filter((t) => this.isTrailerPermittable(permitType, t))
              .filter((t) => t.jeep)
              .map((t) => t.type) || [];

          if (trailerIds.length === 0) {
            // The configuration has a jeep, but no trailers allow jeeps
            // for this power unit and commodity. Return false.
            return false;
          }
          additionalAxleType = '';
          break;
        case AccessoryVehicleType.Booster:
          if (!boosterAllowed) {
            return false;
          }
          additionalAxleType = '';
          break;
        default:
          // This is a trailer (not a booster or jeep).
          // Check to see if it is an additional axle pseudo trailer
          // which is valid for the previous vehicle and let it
          // pass if so.
          if (currentConfiguration[i] === additionalAxleType) {
            break;
          }

          if (!trailerAllowed) {
            return false;
          }

          if (!trailerIds.includes(currentConfiguration[i])) {
            // Trailer not in our list of permittable trailers
            return false;
          }

          jeepAllowed = false;
          trailerAllowed = false;
          {
            const trailer = powerUnit?.trailers.find(
              (t) => t.type === currentConfiguration[i],
            );
            // This is a trailer, set the additional axle type so it can be
            // checked on the next vehicle in the configuration
            const trailerType = this.getTrailerDefinition(trailer?.type);
            additionalAxleType = trailerType?.additionalAxleSubType || '';

            // Set the boosterAllowed flag based on whether the trailer allows
            // a booster for the commodity in the configuration
            boosterAllowed = trailer?.booster || false;
          }
          break;
      }
    }
    // We are still here, so configuration is valid. If there is a trailer
    // it is a valid final configuration, otherwise it is a valid partial
    // configuration.
    return !trailerAllowed || validatePartial;
  }

  /**
   * Gets the maximum size dimensions for a given permit type, commodity,
   * and vehicle configuration. Delegates to helper method.
   * @param permitTypeId ID of the permit type to get size dimension for
   * @param commodityId ID of the commodity to get size dimension for
   * @param configuration Current vehicle configuration to get size dimension for
   * @param regions List of regions the vehicle will be traveling in. If not
   * supplied this defaults to the most restrictive size dimension (if multiple
   * are configured).
   * @returns SizeDimension for the given permit type, commodity, and configuration
   */
  getSizeDimension(
    permitTypeId: string,
    commodityId: string,
    configuration: Array<string>,
    regions?: Array<string>,
  ): SizeDimension | null {
    return getSizeDimensionHelper(
      this,
      permitTypeId,
      commodityId,
      configuration,
      regions,
    );
  }

  /**
   * Gets a list of all configured power unit types in the policy definition.
   * @returns Map of power unit type IDs to power unit type names.
   */
  getPowerUnitTypes(): Map<string, string> {
    const powerUnitTypes = extractIdentifiedObjects(
      this.policyDefinition.vehicleTypes.powerUnitTypes,
    );
    return powerUnitTypes;
  }

  /**
   * Gets a list of all configured trailer types in the policy definition.
   * @returns Map of trailer type IDs to trailer type names.
   */
  getTrailerTypes(includePseudo?: boolean): Map<string, string> {
    let allTypes = this.policyDefinition.vehicleTypes.trailerTypes;
    if (!includePseudo) {
      allTypes = allTypes.filter(
        (t) => t.category !== VehicleCategory.Pseudo.toString(),
      );
    }
    return extractIdentifiedObjects(allTypes);
  }

  /**
   * Gets a full PermitType definition by ID.
   * @param type Type ID of the permit definition to return.
   * @returns PermitType definition for the supplied ID.
   */
  getPermitTypeDefinition(type?: string): PermitType | null {
    let permitType: PermitType | undefined;
    if (this.policyDefinition.permitTypes) {
      permitType = this.policyDefinition.permitTypes.find((p) => p.id === type);
    }

    if (permitType) {
      return permitType;
    } else {
      return null;
    }
  }

  /**
   * Gets a full VehicleType definition by ID (subType)
   * @param subType String id (subType) of the vehicle. Can be either
   * a trailer subtype or a power unit subtype.
   * @returns Vehicle Type (trailer or power unit), or null if none found
   */
  getVehicleDefinition(subType?: string): VehicleType | null {
    return (
      this.getPowerUnitDefinition(subType) ??
      this.getTrailerDefinition(subType) ??
      null
    );
  }

  /**
   * Gets a full PowerUnitType definition by subtype
   * @param subType string subtype of the power unit to return
   * @returns PowerUnitType for the supplied subtype
   */
  getPowerUnitDefinition(subType?: string): PowerUnitType | null {
    const puType = this.policyDefinition.vehicleTypes?.powerUnitTypes?.find(
      (pu) => pu.id == subType,
    );
    if (puType) {
      return puType;
    }

    return null;
  }

  /**
   * Gets a full TrailerType definition by subtype
   * @param subType string subtype of the trailer to return
   * @returns TrailerType for the supplied subtype
   */
  getTrailerDefinition(subType?: string): TrailerType | null {
    const trType = this.policyDefinition.vehicleTypes?.trailerTypes?.find(
      (tr) => tr.id == subType,
    );
    if (trType) {
      return trType;
    }

    return null;
  }

  /**
   * Gets a full Commodity definition by ID
   * @param type Type ID of the commodity to return.
   * @returns Commodity definition for the supplied ID.
   */
  getCommodityDefinition(type?: string): Commodity | null {
    let commodity: Commodity | undefined;
    if (this.policyDefinition.commodities) {
      commodity = this.policyDefinition.commodities.find((c) => c.id === type);
    }

    if (commodity) {
      return commodity;
    } else {
      return null;
    }
  }

  /**
   * Convenience method of policy that delegates the bridge calculation
   * to the helper method.
   * @param axleConfig Vehicle dimensions and weights per axle
   * @returns Array of BridgeCalculationResult objects, one for each
   * axle group in the vehicle configuration
   */
  calculateBridge(
    axleConfig: Array<AxleConfiguration>,
  ): Array<BridgeCalculationResult> {
    let bridgeResults;
    try {
      bridgeResults = runBridgeFormula(axleConfig, this);
    } catch (e: any) {
      console.log(`Error calculating bridge formula: ${e.message}`);
      throw e;
    }
    return bridgeResults;
  }

  /**
   * Gets the list of allowed vehicles separated into two maps, one
   * for trailers and one for power units. This will filter out LCV
   * vehicles unless authorized in special authorizations.
   * @param permitType Permit type definition
   */
  getAllowedVehicles(permitType: PermitType): Map<string, Map<string, string>> {
    if (permitType.commodityRequired) {
      // If commodity is required, this method cannot be used since it
      // requires a fixed set of allowed vehicle types, not commodity-based
      throw new Error(
        `Allowed vehicles not configured for permit type requiring commodity: '${permitType.id}'`,
      );
    }

    let allowedVehicles = permitType.allowedVehicles;

    if (!allowedVehicles) {
      return new Map<string, Map<string, string>>();
    }

    if (!this.specialAuthorizations?.isLcvAllowed) {
      allowedVehicles = this.filterOutLongCombinationVehicles(allowedVehicles);
    }

    const allowedVehicleMap = new Map<string, Map<string, string>>();
    const powerUnitIds = filterVehiclesByType(
      allowedVehicles,
      this.policyDefinition.vehicleTypes,
      VehicleCategory.PowerUnit,
    );
    const trailerIds = filterVehiclesByType(
      allowedVehicles,
      this.policyDefinition.vehicleTypes,
      VehicleCategory.Trailer,
    );

    allowedVehicleMap.set(
      VehicleTypes.PowerUnits,
      extractIdentifiedObjects(
        this.policyDefinition.vehicleTypes.powerUnitTypes,
        powerUnitIds,
      ),
    );
    allowedVehicleMap.set(
      VehicleTypes.Trailers,
      extractIdentifiedObjects(
        this.policyDefinition.vehicleTypes.trailerTypes,
        trailerIds,
      ),
    );
    return allowedVehicleMap;
  }

  /**
   * Gets the default legal and permittable weights for a
   * given trailer type and number of axles in the trailer axle
   * unit.
   * @param subType Trailer subtype
   * @param axles Number of axles in the trailer axle unit
   * @returns Array of trailer weights. Multiple trailer
   * weights may be returned if there are different weights
   * depending on prior / subsequent vehicles in the
   * configuration (weight modifiers). Will return an empty array
   * if the number of axles is not configured in policy.
   */
  getDefaultTrailerWeight(
    subType: string,
    axles: number,
  ): Array<TrailerWeightDimension> {
    return getDefaultTrailerWeightHelper(
      this,
      subType,
      axles,
    ) as Array<TrailerWeightDimension>;
  }

  /**
   * Gets the default legal and permittable weights for a
   * given power unit type and number of axles. The number of
   * axles is supplied as a 2-digit number, with the most
   * significant digit representing the steer axle unit and the
   * least significant digit representing the drive axle unit.
   * @param subType Power unit subtype
   * @param axles Number of axles in the power unit axle units
   * @returns Array of power unit weights. Multiple power unit
   * weights may be returned if there are different weights
   * depending on prior / subsequent vehicles in the
   * configuration (weight modifiers). Will return an empty array
   * if the number of axles is not configured in policy.
   */
  getDefaultPowerUnitWeight(
    subType: string,
    axles: number,
  ): Array<PowerUnitWeightDimension> {
    return getDefaultPowerUnitWeightHelper(
      this,
      subType,
      axles,
    ) as Array<PowerUnitWeightDimension>;
  }

  /**
   * Given a list of default weight dimensions and a vehicle
   * configuration, select the correct weight dimensions for
   * the axle unit at the supplied axleIndex. The weight dimensions
   * may have modifiers (e.g. if a tandem booster follows a tridem
   * semi trailer) - this method will select the correct weights
   * to be used for policy checks.
   * @param weightDimensions Default weight dimensions for the vehicle
   * at the index indicated by axleIndex
   * @param configuration Full vehicle configuration
   * @param axleConfiguration Full axle weights of the vehicle configuration
   * @param axleIndex Index of the axle unit for which weights are
   * to be returned.
   * @returns Single axle dimension representing the legal and permittable
   * weights for the axle unit at the supplied axleIndex.
   */
  selectCorrectWeightDimension(
    weightDimensions: Array<WeightDimension>,
    configuration: Array<string>,
    axleConfiguration: Array<AxleConfiguration>,
    axleIndex: number,
  ): SingleAxleDimension | null {
    return selectCorrectWeightDimensionHelper(
      this,
      weightDimensions,
      configuration,
      axleConfiguration,
      axleIndex,
    );
  }

  /**
   * Get the list of known standard tire sizes, used to populate
   * dropdown lists in front-end interfaces.
   * @returns List of known standard tire sizes, or empty array if
   * none are configured
   */
  getStandardTireSizes(): Array<StandardTireSize> {
    if (this.policyDefinition.standardTireSizes) {
      return this.policyDefinition.standardTireSizes;
    } else {
      return new Array<StandardTireSize>();
    }
  }
}
