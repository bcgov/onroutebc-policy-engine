import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { Engine } from 'json-rules-engine';
import {
  PermitAppInfo,
  PolicyFacts,
  CostFacts,
  PolicyCheckResultType,
} from 'onroute-policy-engine/enum';
import { Policy } from 'onroute-policy-engine';
import {
  AxleConfiguration,
  PermitType,
  PermitVehicleDetails,
  RangeMatrix,
  VehicleConfiguration,
  VehicleInConfiguration,
} from 'onroute-policy-engine/types';
import { policyCheckMap } from './policy-check.helper';

dayjs.extend(quarterOfYear);

/**
 * Adds runtime facts for the validation. For example, adds the
 * validation date for comparison against startDate of the permit.
 * @param engine json-rules-engine Engine instance to add facts to.
 */
export function addRuntimeFacts(engine: Engine, policy: Policy): void {
  const today: string = dayjs().format(PermitAppInfo.PermitDateFormat);
  engine.addFact(PolicyFacts.ValidationDate, today);

  /**
   * Add runtime fact for number of days in the permit year.
   * Will be either 365 or 366, for use when comparing against
   * duration for 1 year permits.
   */
  engine.addFact(
    PolicyFacts.DaysInPermitYear,
    async function (params, almanac) {
      const startDate: string = await almanac.factValue(
        PermitAppInfo.PermitData,
        {},
        PermitAppInfo.PermitStartDate,
      );
      const dateFrom = dayjs(startDate, PermitAppInfo.PermitDateFormat);
      const daysInPermitYear = dateFrom.add(1, 'year').diff(dateFrom, 'day');
      return daysInPermitYear;
    },
  );

  /**
   * Add runtime fact to get the last day of the quarter
   * that the permit start date falls in. Returns the date
   * formatted as a string in the standard permit date format.
   */
  engine.addFact(
    PolicyFacts.EndOfPermitQuarter,
    async function (params, almanac) {
      const startDate: string = await almanac.factValue(
        PermitAppInfo.PermitData,
        {},
        PermitAppInfo.PermitStartDate,
      );

      const dateFrom = dayjs(startDate, PermitAppInfo.PermitDateFormat);
      const endOfQuarter = dateFrom.endOf('quarter');

      return endOfQuarter.format(PermitAppInfo.PermitDateFormat);
    },
  );

  /**
   * Adds a runtime fact specifying whether the vehicle configuration
   * in the permit application is valid for the permit type and
   * commodity. Will return true or false.
   */
  engine.addFact(
    PolicyFacts.ConfigurationIsValid.toString(),
    async function (params, almanac) {
      let isValid: boolean;
      try {
        const powerUnit: string = await almanac.factValue(
          PermitAppInfo.PermitData,
          {},
          PermitAppInfo.PowerUnitType,
        );
        const trailerList: Array<any> = await almanac.factValue(
          PermitAppInfo.PermitData,
          {},
          PermitAppInfo.TrailerList,
        );
        let fullVehicleConfiguration = [];
        fullVehicleConfiguration.push(powerUnit);
        fullVehicleConfiguration = fullVehicleConfiguration.concat(
          trailerList.map((t) => t.vehicleSubType),
        );

        const permitType: string = await almanac.factValue(
          PermitAppInfo.PermitType,
        );
        const commodity: string = await almanac.factValue(
          PermitAppInfo.PermitData,
          {},
          PermitAppInfo.Commodity,
        );

        isValid = policy.isConfigurationValid(
          permitType,
          commodity,
          fullVehicleConfiguration,
        );
      } catch (e: any) {
        console.log(`Error validating vehicle configuration: '${e.message}'`);
        isValid = false;
      }
      return isValid;
    },
  );

  /**
   * Add runtime fact to get the list of allowed vehicles taking into
   * consideration a client special authorization lcv flag.
   */
  engine.addFact(
    PolicyFacts.AllowedVehicles.toString(),
    async function (params, almanac) {
      let allowedVehicles: Array<string> = [];
      const permitTypeId: string = (await almanac.factValue(
        PermitAppInfo.PermitType,
      )) as string;
      const permitType: PermitType | null =
        policy.getPermitTypeDefinition(permitTypeId);

      if (permitType) {
        if (
          permitType.allowedVehicles &&
          permitType.allowedVehicles.length > 0
        ) {
          allowedVehicles = permitType.allowedVehicles;
          // Filter out long combination vehcles if necessary
          if (
            !policy.specialAuthorizations ||
            !policy.specialAuthorizations.isLcvAllowed
          ) {
            allowedVehicles =
              policy.filterOutLongCombinationVehicles(allowedVehicles);
          }
        }
      }

      return allowedVehicles;
    },
  );

  /**
   * Add runtime fact to calculate the complete vehicle configuration
   * by combining the power unit type with any attached trailers.
   * Returns an array of vehicle types representing the full configuration.
   */
  engine.addFact(
    PolicyFacts.VehicleConfiguration.toString(),
    async function (params, almanac) {
      // Retrieve the vehicle details from permit data
      const vehicleDetails: PermitVehicleDetails = await almanac.factValue(
        PermitAppInfo.PermitData,
        {},
        PermitAppInfo.VehicleDetails,
      );
      // Retrieve the vehicle configuration from permit data
      const vehicleConfiguration: VehicleConfiguration =
        await almanac.factValue(
          PermitAppInfo.PermitData,
          {},
          PermitAppInfo.VehicleConfiguration,
        );

      return policy.getSimplifiedVehicleConfiguration(
        vehicleDetails,
        vehicleConfiguration,
      );
    },
  );

  /**
   * Add runtime fact to calculate the gross vehicle combination
   * weight by summing the weights of the individual axle units.
   */
  engine.addFact(
    PolicyFacts.GrossVehicleCombinationWeight,
    async function (params, almanac) {
      // Retrieve the axle configuration from permit data
      const axleConfiguration: Array<AxleConfiguration> =
        await almanac.factValue(
          PermitAppInfo.PermitData,
          {},
          PermitAppInfo.AxleConfiguration,
        );
      return axleConfiguration.reduce((w, curr) => w + curr.axleUnitWeight, 0);
    },
  );

  /**
   * Add runtime fact to evaluate whether a specific policy check passes
   * based on the vehicle configuration and axle configuration.
   * Returns true if all policy check results are 'pass', false otherwise.
   */
  engine.addFact(
    PolicyFacts.PolicyCheckPassed.toString(),
    async function (params, almanac) {
      // Retrieve the complete vehicle configuration (power unit + trailers)
      const vehicleConfiguration: Array<string> = await almanac.factValue(
        PolicyFacts.VehicleConfiguration,
      );
      // Retrieve the axle configuration from permit data
      const axleConfiguration: Array<AxleConfiguration> =
        await almanac.factValue(
          PermitAppInfo.PermitData,
          {},
          PermitAppInfo.AxleConfiguration,
        );
      // Get the specific policy check ID from parameters
      const policyCheckId = params.policyId;

      // Look up the policy check function from the policy check map
      const func = policyCheckMap.get(policyCheckId);
      if (!func) {
        return false;
      }
      // Execute the policy check function with vehicle and axle configurations
      const policyCheckResults = func(
        policy,
        vehicleConfiguration,
        axleConfiguration,
      );
      if (!policyCheckResults || policyCheckResults.length === 0) {
        // We did not get any policy check results returned which is an error
        // condition - all policy checks must return at least one result
        return false;
      }
      // Return true only if all policy check results are 'pass'
      return policyCheckResults.every(
        (r) => r.result === PolicyCheckResultType.Pass,
      );
    },
  );

  /**
   * Add runtime fact to calculate the number of days between a from
   * and to date supplied in parameters. Will be positive for a dateTo
   * in the future with respect to dateFrom, negative otherwise.
   */
  engine.addFact(
    PolicyFacts.DaysBetween.toString(),
    async function (params, almanac) {
      const dateFromStr: string = await almanac.factValue(
        params.dateFrom.fact,
        {},
        params.dateFrom.path,
      );
      const dateToStr: string = await almanac.factValue(
        params.dateTo.fact,
        {},
        params.dateTo.path,
      );
      const dateFrom = dayjs(dateFromStr, PermitAppInfo.PermitDateFormat);
      const dateTo = dayjs(dateToStr, PermitAppInfo.PermitDateFormat);
      const daysBetween = dateTo.diff(dateFrom, 'day');
      return daysBetween;
    },
  );

  /**
   * Add runtime fact for a fixed permit cost, the cost supplied
   * as a parameter.
   */
  engine.addFact(CostFacts.FixedCost.toString(), async function (params) {
    return params.cost;
  });

  /**
   * Add runtime fact for a conditional fixed permit cost, where the
   * cost rule applied only when the fact and value supplied as parameters
   * match.
   */
  engine.addFact(
    CostFacts.ConditionalFixedCost.toString(),
    async function (params, almanac) {
      const conditionValue: any = await almanac.factValue(
        PermitAppInfo.PermitData,
        {},
        params.fact,
      );

      if (conditionValue && conditionValue === params.value) {
        return params.cost;
      } else {
        return 0;
      }
    },
  );

  /**
   * Add runtime fact for cost per month, where month is defined by
   * policy as a 30 day period or portion thereof, except in the
   * case of a full year in which case it is 12 months.
   */
  engine.addFact(
    CostFacts.CostPerMonth.toString(),
    async function (params, almanac) {
      const duration: number = await almanac.factValue(
        PermitAppInfo.PermitData,
        {},
        PermitAppInfo.PermitDuration,
      );
      const daysInPermitYear: number = await almanac.factValue(
        PolicyFacts.DaysInPermitYear.toString(),
      );

      let months: number = Math.floor(duration / 30);
      const extraDays: number = duration % 30;

      if (extraDays > 0 && duration !== daysInPermitYear) {
        // Add an extra month for a partial month unless it is
        // a full year. Note this does not handle the case where 2
        // or more years duration is specified, since that is not
        // a valid permit and does not warrant considetation.
        months++;
      }

      return months * params.cost;
    },
  );

  /**
   * Add runtime fact for cost per kilometre driven in the applicant's
   * permitted route. Accepts an optional parameter minValue which
   * specifies the minimum value for the permit if the kilometre cost
   * is less than that value.
   */
  engine.addFact(
    CostFacts.CostPerKilometre.toString(),
    async function (params, almanac) {
      const distance: number = await almanac.factValue(
        PermitAppInfo.PermitData,
        {},
        PermitAppInfo.TotalDistance,
      );

      let cost = distance * params.cost;
      if (typeof params.minValue === 'number') {
        cost = Math.max(cost, params.minValue);
      }
      if (typeof params.maxValue === 'number') {
        cost = Math.min(cost, params.maxValue);
      }

      return Math.round(cost);
    },
  );

  /**
   * Add runtime fact to look up the permit cost from a matrix of
   * value ranges configured in policy json. This is most commonly
   * used for a permit cost that is based on the vehicle weight.
   */
  engine.addFact(
    CostFacts.RangeMatrixCostLookup.toString(),
    async function (params, almanac) {
      // Get the parameter from the permit application whose
      // value will be used to select the correct range matrix key
      const rangeLookupKey: any = await almanac.factValue(
        PermitAppInfo.PermitData,
        {},
        params.rangeLookupKey,
      );

      // Initialize cost to zero, if we are unable to find
      // a matching value or matrix for whatever reason, the
      // cost will default to zero (no matrix applicable)
      let cost = 0;

      // Get the ID of the matrix to look up
      const matrixRef = (params.matrixMap as Array<any>)?.find(
        (r) => r.key === rangeLookupKey,
      );

      if (matrixRef) {
        // If a matrix ID was returned, retrieve the matrix from the
        // policy configuration that we need to use for cost lookup
        // (for example, the 'annualFeeIndustrial' matrix)
        const matrix: RangeMatrix | undefined =
          policy.policyDefinition.rangeMatrices?.find(
            (m) => m.id === matrixRef.value,
          );

        if (matrix) {
          // if the matrix exists in policy configuration
          // Retrieve the numeric value for the matrix lookup
          // (for example, may be loaded GVW)
          const matrixFactValue: number = await almanac.factValue(
            PermitAppInfo.PermitData,
            {},
            params.matrixFactValue,
          );

          // Look up the correct entry in the matrix, where the lookup
          // value falls within the min/max range
          const matrixMatch = matrix.matrix.find((m) => {
            let min = m.min;
            if (typeof min !== 'number') {
              min = Number.MIN_SAFE_INTEGER;
            }
            let max = m.max;
            if (typeof max !== 'number') {
              max = Number.MAX_SAFE_INTEGER;
            }
            return matrixFactValue >= min && matrixFactValue <= max;
          });

          if (matrixMatch) {
            // If we got a hit from the matrix
            cost = matrixMatch.value;

            // If the cost rule includes a divisor, apply it here. A divisor
            // may be used if, for example, the value from the lookup matrix
            // is an annual fee but the permit is just a month or quarter.
            if (typeof params.divisor === 'number' && params.divisor > 0) {
              cost = Math.round(cost / params.divisor);
            }
          }
        } else {
          console.log(
            `No range matrix with id ${matrixRef} found in the policy configuration`,
          );
        }
      }

      return cost;
    },
  );
}
