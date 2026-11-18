import { RelativePosition } from '../../enum';
import { Policy } from '../../policy-engine';
import { selectCorrectInteraxleSpacingRequirementHelper } from '../../helper/interaxle-spacing.helper';
import currentPolicyConfig from '../policy-config/_current-config.json';
import { POWER_UNITS } from '../../constants/power-units';
import { TRAILERS } from '../../constants/trailers';
import { AxleConfiguration } from '../../types/axle-configuration';
import { InteraxleSpacingRequirement } from '../../types/interaxle-spacing-requirement';

describe('selectCorrectInteraxleSpacingRequirementHelper', () => {
  const policy = new Policy(currentPolicyConfig);
  const vehicleConfiguration = [
    POWER_UNITS.TRUCK_TRACTORS.id,
    TRAILERS.JEEPS.id,
    TRAILERS.SEMI_TRAILERS_WIDE_WHEELERS.id,
  ];
  const axleConfiguration: Array<AxleConfiguration> = [
    { numberOfAxles: 1, axleUnitWeight: 8000, vehicleIndex: 0 },
    { numberOfAxles: 2, axleUnitWeight: 8000, vehicleIndex: 0 },
    { numberOfAxles: 2, axleUnitWeight: 8000, vehicleIndex: 1 },
    { numberOfAxles: 2, axleUnitWeight: 17000, vehicleIndex: 2 },
  ];
  const axleUnitVehicleIndexes = [0, 0, 1, 2];

  it('matches a vehicle type from a modifier type array before the axle unit', () => {
    const requirement: InteraxleSpacingRequirement = {
      min: 700,
      modifier: {
        position: RelativePosition.Before,
        type: [TRAILERS.JEEPS.id, TRAILERS.SEMI_TRAILERS_WIDE_WHEELERS.id],
      },
    };

    expect(
      selectCorrectInteraxleSpacingRequirementHelper(
        policy,
        [requirement],
        vehicleConfiguration,
        axleConfiguration,
        3,
        axleUnitVehicleIndexes,
      ),
    ).toBe(requirement);
  });

  it('matches a vehicle type from a modifier type array after the axle unit', () => {
    const requirement: InteraxleSpacingRequirement = {
      min: 700,
      modifier: {
        position: RelativePosition.After,
        type: [TRAILERS.SEMI_TRAILERS_WIDE_WHEELERS.id],
      },
    };

    expect(
      selectCorrectInteraxleSpacingRequirementHelper(
        policy,
        [requirement],
        vehicleConfiguration,
        axleConfiguration,
        2,
        axleUnitVehicleIndexes,
      ),
    ).toBe(requirement);
  });
});
