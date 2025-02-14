import { Policy } from '../policy-engine';
import {
  ConditionForPermit,
  ConditionRequirement,
  PermitConditionDefinition,
  VehicleType,
} from '../types';

/**
 * Gets a list of conditions that are applicable for the supplied permit
 * application. The conditions may be driven by those applicable for the
 * permit type, or the vehicle type, or other aspects of the permit application.
 * @param permitApp The in-progress permit application
 * @param policy Policy object
 * @returns Array of conditions that apply to the specific permit application
 */
export function getConditionsForPermitHelper(
  permitApp: any,
  policy: Policy,
): Array<ConditionForPermit> {
  let conditionsForPermit: Array<ConditionForPermit> = [];

  if (permitApp.permitType) {
    // Get all conditions applicable to the permit type
    const permitType = policy.getPermitTypeDefinition(permitApp.permitType);
    if (permitType) {
      conditionsForPermit = conditionsForPermit.concat(
        expandConditions(policy, permitType.conditions),
      );
    }

    // Get any conditions specific to the permitted vehicle
    if (permitApp.permitData?.vehicleDetails?.vehicleSubType) {
      const vehicle: VehicleType | null = policy.getVehicleDefinition(
        permitApp.permitData.vehicleDetails.vehicleSubType,
      );
      if (vehicle) {
        conditionsForPermit = conditionsForPermit.concat(
          expandConditions(policy, vehicle.conditions),
        );
      }
    }
  }

  return conditionsForPermit;
}

/**
 * Expand a list of ConditionRequirement to include the full
 * properties of the configured condition in the policy definition
 * @param conditions Array of condition requirements
 * @param policy Policy to use for condition definitions
 * @returns Array of full ConditionForPermit object, or empty array if
 * none found matching.
 */
function expandConditions(
  policy: Policy,
  conditions?: Array<ConditionRequirement>,
): Array<ConditionForPermit> {
  const expandedConditions: Array<ConditionForPermit> = [];

  conditions?.forEach((c) => {
    const condition: PermitConditionDefinition | undefined =
      policy.policyDefinition.conditions?.find(
        (cond) => cond.condition == c.condition,
      );
    if (condition) {
      expandedConditions.push({ ...condition, ...c });
    }
  });

  return expandedConditions;
}
