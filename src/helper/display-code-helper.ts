import { Policy } from 'onroute-policy-engine';
import { AxleConfiguration } from 'onroute-policy-engine/types';

/**
 * Helper function to generate a vehicle display code based on the vehicle configuration and axle configuration.
 *
 * This function determines whether to generate a standard display code (for known vehicle types with
 * configured display codes) or a universal display code (for complex or unknown configurations).
 *
 * @param policy The Policy instance containing vehicle definitions and display code defaults.
 * @param configuration Array of vehicle type identifiers representing the vehicle configuration.
 *                      The first element should be a power unit type, followed by trailer types.
 * @param axleConfiguration Array of axle configurations corresponding to each vehicle in the configuration.
 *                          Each axle configuration contains details like number of axles, spacing, etc.
 * @returns A string representing the vehicle display code, or an empty string if the configuration is empty.
 *
 * @throws {Error} If vehicleDisplayCodeDefaults is not configured in the policy definition.
 */
export function getVehicleDisplayCodeHelper(
  policy: Policy,
  configuration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): string {
  if (!policy.policyDefinition.vehicleDisplayCodeDefaults) {
    throw new Error(
      'Unable to construct vehicle display code; missing vehicleDisplayCodeDefaults in policy configuration',
    );
  }

  // Empty configuration, empty display code
  if (configuration.length === 0) {
    return '';
  }

  if (canCreateStandardCode(policy, configuration, axleConfiguration)) {
    const defs = policy.policyDefinition.vehicleDisplayCodeDefaults;
    const displayCodeTokens: Array<string> = [];
    displayCodeTokens.push(defs.prefixStandard || '');

    const powerUnit = policy.getPowerUnitDefinition(configuration[0]);
    // Add the power unit display code, e.g. TT
    displayCodeTokens.push(powerUnit?.displayCodePrefix || '');
    // Add the number of axles in the steer axle unit
    displayCodeTokens.push(axleConfiguration[0].numberOfAxles.toString());
    // Add the power unit steer axle display code, e.g. S
    displayCodeTokens.push(powerUnit?.displayCodeSteerAxle || '');
    // Add the steer axle unit index label (first axle unit)
    displayCodeTokens.push('1');
    // Add the padding if necessary. Padding is added once for
    // every axle above 1 in the steer axle unit.
    displayCodeTokens.push(
      defs.paddingStandard.repeat(axleConfiguration[0].numberOfAxles - 1),
    );
    // Add the number of axles in the drive axle unit
    displayCodeTokens.push(axleConfiguration[1].numberOfAxles.toString());
    // Add the power unit drive axle display code, e.g. D
    displayCodeTokens.push(powerUnit?.displayCodeDriveAxle || '');
    // Add the drive axle unit index label (second axle unit)
    displayCodeTokens.push('2');
    // Add the padding if necessary. Padding is added once for
    // every axle above 1 in the drive axle unit.
    if (axleConfiguration.length > 2) {
      displayCodeTokens.push(
        defs.paddingStandard.repeat(axleConfiguration[1].numberOfAxles - 1),
      );
    }

    let currentAxleIndex = 2;
    configuration.slice(1).forEach((v) => {
      const trailer = policy.getTrailerDefinition(v);
      if (!trailer?.ignoreForAxleCalculation) {
        // Add the number of axles of the trailer
        displayCodeTokens.push(
          axleConfiguration[currentAxleIndex].numberOfAxles.toString(),
        );
        // Add the trailer display code, e.g. T
        displayCodeTokens.push(trailer?.displayCode || '');

        // Add the axle unit index label, with prefix if axle unit
        // number is more than a single digit, e.g. '.10'
        if (currentAxleIndex >= 9) {
          displayCodeTokens.push(defs.multiDigitPrefix);
        }
        displayCodeTokens.push((currentAxleIndex + 1).toString());
        // Add the padding if necessary. Padding is added once for
        // every axle above 1 in the drive axle unit.
        if (axleConfiguration.length > currentAxleIndex + 1) {
          displayCodeTokens.push(
            defs.paddingStandard.repeat(
              axleConfiguration[currentAxleIndex].numberOfAxles - 1,
            ),
          );
        }
        currentAxleIndex++;
      }
    });

    return displayCodeTokens.join('');
  } else {
    return getUniversalDisplayCode(policy, axleConfiguration);
  }
}

/**
 * Generates a universal display code for vehicle configurations that cannot use the standard display code format.
 *
 * Universal display codes are used when:
 * - Vehicle types are unknown or don't have configured display codes
 * - Axle configurations exceed the maximum standard axle count
 * - Vehicle configuration doesn't match the expected pattern
 *
 * The universal format uses generic symbols and spacing indicators to represent the axle configuration
 * in a standardized way that can handle complex or unusual vehicle setups.
 *
 * @param policy The Policy instance containing display code defaults configuration.
 * @param axleConfiguration Array of axle configurations representing the vehicle's axle setup.
 *                          Each configuration contains details like number of axles, spacing, etc.
 * @returns A string representing the universal vehicle display code, or an empty string if the axle configuration is empty.
 *
 * @throws {Error} If vehicleDisplayCodeDefaults is not configured in the policy definition.
 *
 * @example
 * // For a complex axle configuration
 * const code = getUniversalDisplayCode(policy, [
 *   { numberOfAxles: 2, interaxleSpacing: 1.8, ... },
 *   { numberOfAxles: 3, interaxleSpacing: 4.2, ... },
 *   { numberOfAxles: 5, interaxleSpacing: 3.0, ... } // Exceeds standard threshold
 * ]);
 * // Returns something like "U2U1MU3U2MU5+U3" where U represents universal axle codes
 */
export function getUniversalDisplayCode(
  policy: Policy,
  axleConfiguration: Array<AxleConfiguration>,
): string {
  const defs = policy.policyDefinition.vehicleDisplayCodeDefaults;
  if (!defs) {
    throw new Error(
      'Unable to construct vehicle display code; missing vehicleDisplayCodeDefaults in policy configuration',
    );
  }

  // Empty axle configuration, empty display code
  if (axleConfiguration.length === 0) {
    return '';
  }

  const displayCodeTokens: Array<string> = [];
  displayCodeTokens.push(defs.prefixUniversal || '');

  let currentAxleIndex = 0;
  axleConfiguration.forEach((a) => {
    if (currentAxleIndex > 0) {
      // Add the universal spacing glyph, e.g. 'MU' , if this is
      // not the first axle unit
      if (
        a.interaxleSpacing &&
        a.interaxleSpacing <= defs.spacingUniversalSmallMax
      ) {
        displayCodeTokens.push(defs.spacingUniversalSmall);
      } else if (
        a.interaxleSpacing &&
        a.interaxleSpacing >= defs.spacingUniversalLargeMin
      ) {
        displayCodeTokens.push(defs.spacingUniversalLarge);
      } else {
        displayCodeTokens.push(defs.spacingUniversalDefault);
      }
    }
    if (a.numberOfAxles > defs.thresholdAxlesUniversal) {
      // The number of axles in this axle unit is above the threshold
      // for the number of axles that can be represented by the simple
      // universal formula
      displayCodeTokens.push(defs.thresholdAxlesUniversal.toString());
      // Add the over axles code, e.g. '+'
      displayCodeTokens.push(defs.overAxlesCodeUniversal);
      // Add the universal axle code, e.g. 'U'
      displayCodeTokens.push(defs.universalAxleCode);

      // Add the axle unit index label, with prefix if axle unit
      // number is more than a single digit, e.g. '.10'
      if (currentAxleIndex >= 9) {
        displayCodeTokens.push(defs.multiDigitPrefix);
      }
      displayCodeTokens.push((currentAxleIndex + 1).toString());
      // Add the padding. Padding is added once for every axle
      // above 1, up to the universal threshold.
      displayCodeTokens.push(
        defs.paddingUniversal.repeat(defs.thresholdAxlesUniversal - 1),
      );
      // Add the extra axle unit glyps, e.g. 'XU', for
      // each axle unit above the universal threshold
      for (let i = defs.thresholdAxlesUniversal + 1; i < a.numberOfAxles; i++) {
        displayCodeTokens.push(defs.extraAxleUniversal);
      }
      // Add the end axle unit glyph, e.g. 'EU'
      displayCodeTokens.push(defs.endAxleUniversal);
    } else {
      // Add the number of axles in the axle unit, e.g. '2'
      displayCodeTokens.push(a.numberOfAxles.toString());
      // Add the universal axle code, e.g. 'U'
      displayCodeTokens.push(defs.universalAxleCode);

      // Add the axle unit index label, with prefix if axle unit
      // number is more than a single digit, e.g. '.10'
      if (currentAxleIndex >= 9) {
        displayCodeTokens.push(defs.multiDigitPrefix);
      }
      displayCodeTokens.push((currentAxleIndex + 1).toString());
      // Add the padding if necessary. Padding is added once for
      // every axle above 1 in the axle unit.
      if (axleConfiguration.length > currentAxleIndex + 1) {
        displayCodeTokens.push(
          defs.paddingUniversal.repeat(
            axleConfiguration[currentAxleIndex].numberOfAxles - 1,
          ),
        );
      }
    }
    currentAxleIndex++;
  });

  return displayCodeTokens.join('');
}

/**
 * Determines whether a standard display code can be generated for the given vehicle configuration.
 *
 * A standard display code can be created when:
 * - All vehicle types are known and have configured display codes
 * - The power unit has all required display code properties (prefix, steer axle, drive axle)
 * - All trailers have display codes (unless they're marked to ignore for axle calculation)
 * - No axle configuration exceeds the maximum standard axle count
 * - The number of axle configurations matches the number of non-ignorable vehicles plus one
 *
 * @param policy The Policy instance containing vehicle definitions and display code defaults.
 * @param configuration Array of vehicle type identifiers representing the vehicle configuration.
 *                      The first element should be a power unit type, followed by trailer types.
 * @param axleConfiguration Array of axle configurations corresponding to each vehicle in the configuration.
 *                          Each axle configuration contains details like number of axles, spacing, etc.
 * @returns True if a standard display code can be generated, false if a universal display code is required.
 *
 * @example
 * // Returns true for a standard truck-tractor with semi-trailer
 * canCreateStandardCode(policy, ['TRKTRAC', 'SEMI'], [
 *   { numberOfAxles: 2, ... }, // Steer axle
 *   { numberOfAxles: 3, ... }, // Drive axle
 *   { numberOfAxles: 3, ... }  // Trailer axle
 * ]);
 *
 * // Returns false for unknown vehicle types or complex configurations
 * canCreateStandardCode(policy, ['UNKNOWN'], [
 *   { numberOfAxles: 10, ... } // Exceeds standard threshold
 * ]);
 */
function canCreateStandardCode(
  policy: Policy,
  configuration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): boolean {
  // Check that all of the vehicle types are known,
  // and that all have display codes configured
  const powerUnit = policy.getPowerUnitDefinition(configuration[0]);
  if (
    !powerUnit ||
    !powerUnit.displayCodePrefix ||
    !powerUnit.displayCodeSteerAxle ||
    !powerUnit.displayCodeDriveAxle
  ) {
    return false;
  }

  // Check all the trailers (if there are any)
  for (let i = 1; i < configuration.length; i++) {
    const trailer = policy.getTrailerDefinition(configuration[i]);
    if (
      !trailer ||
      (!trailer.displayCode && !trailer.ignoreForAxleCalculation)
    ) {
      return false;
    }
  }

  // Check that none of the axles exceed the max standard
  const maxAxles =
    policy.policyDefinition.vehicleDisplayCodeDefaults?.maxAxlesStandard || 0;
  for (let j = 0; j < axleConfiguration.length; j++) {
    if (axleConfiguration[j].numberOfAxles > maxAxles) {
      return false;
    }
  }

  // Count all non-ignorable vehicles
  const vehicleCount = configuration.filter((v) => {
    const vehicle = policy.getVehicleDefinition(v);
    if (vehicle && !vehicle.ignoreForAxleCalculation) {
      return true;
    }
    return false;
  }).length;

  // The vehicle list does not correspond with the number of non-
  // ignorable axles, so the universal diagram is the only option
  if (axleConfiguration.length !== vehicleCount + 1) {
    return false;
  }

  return true;
}
