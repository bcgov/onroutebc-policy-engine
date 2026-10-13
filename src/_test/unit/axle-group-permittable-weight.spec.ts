import { Policy } from 'onroute-policy-engine';

import { PolicyCheckId, PolicyCheckResultType } from '../../enum';

import { AxleConfiguration } from '../../types';
import { CheckAxleGroupMaximumPermittableWeightThreshold } from '../../helper/policy-check.helper';

import currentPolicyConfig from '../policy-config/_current-config.json';

describe('Axle group permittable weight with interaxle modifier (BOOSTER)', () => {
  const policy = new Policy(currentPolicyConfig);

  it('emits permittable group failure with interaxle message for axles 3-4', () => {
    const vehicleConfiguration = ['TRKTRAC', 'FESEMTR', 'BOOSTER'];

    const axleConfiguration: Array<AxleConfiguration> = [
      {
        numberOfAxles: 1,
        axleUnitWeight: 6000,
        numberOfTires: 2,
        tireSize: 711.2,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 1,
        interaxleSpacing: 300,
        axleUnitWeight: 7000,
        numberOfTires: 2,
        tireSize: 711.2,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 3,
        axleSpread: 240,
        interaxleSpacing: 300,
        axleUnitWeight: 17000,
        numberOfTires: 6,
        tireSize: 711.2,
        vehicleIndex: 1,
      },
      {
        numberOfAxles: 1,
        interaxleSpacing: 300,
        axleUnitWeight: 9101,
        numberOfTires: 4,
        tireSize: 711.2,
        vehicleIndex: 2,
      },
    ];

    const results = CheckAxleGroupMaximumPermittableWeightThreshold(
      policy,
      vehicleConfiguration,
      axleConfiguration,
    );

    console.log(results);

    // Find any results for axle group 3-4
    // const group34 = results.find(
    //   (r) => r.startAxleUnit === 3 && r.endAxleUnit === 4,
    // );

    // expect(group34).toBeDefined();

    // Expect a permittable failure message referencing interaxle spacing and 9100 kg
    // const hasInteraxleMessage = group34?.message?.includes(
    //   'Interaxle Spacing for Axle Group (Axle Unit 3 - Axle Unit 4) restricts Axle Group Weight to 9100 kg',
    // );

    const failedResult = results.find(
      (result) => result.result === PolicyCheckResultType.Fail,
    );

    expect(
      failedResult?.message?.includes(
        'Interaxle Spacing for Axle Group (Axle Unit 3 - Axle Unit 4) restricts Axle Group Weight to 9100 kg',
      ),
    ).toBe(true);
  });
});
