import { Policy } from '../../policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum/policy-check';

const reportedTrailerCrashInput = {
  currentFormData: {
    permitType: 'STOW',
    permitId: '35',
    originalPermitId: '35',
    applicationNumber: 'A2-00010029-791-A00',
    permitNumber: '',
    permitStatus: 'IN_PROGRESS',
    permitData: {
      companyName: 'Parisian LLC Trucking',
      doingBusinessAs: '',
      clientNumber: 'B3-000005-722',
      contactDetails: {
        firstName: 'Red',
        lastName: 'Stevenson',
        phone1: '778-555-2907',
        phone1Extension: '',
        phone2: '778-555-2447',
        phone2Extension: '',
        email: 'noreply@gov.bc.ca',
        additionalEmail: 'noreply@gov.bc.ca',
      },
      mailingAddress: {
        addressLine1: '415 Schiller Road',
        addressLine2: '',
        city: 'Ballylinan',
        provinceCode: 'BC',
        countryCode: 'CA',
        postalCode: 'B4P 1O2',
      },
      startDate: '2026-05-14T07:00:00.000Z',
      permitDuration: 1,
      expiryDate: '2026-05-15T06:59:59.999Z',
      commodities: [
        {
          description: 'Permit Scope and Limitation',
          condition: 'CVSE-1070',
          conditionLink:
            'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261',
          checked: true,
          disabled: true,
        },
      ],
      vehicleDetails: {
        vehicleId: '101',
        unitNumber: 'LCV1',
        vin: '657854',
        plate: 'TTH199',
        make: 'Western Star',
        year: 2020,
        countryCode: 'CA',
        provinceCode: 'BC',
        vehicleType: 'powerUnit',
        vehicleSubType: 'CONCRET',
        licensedGVW: 20000,
        saveVehicle: false,
      },
      feeSummary: '',
      loas: [],
      permittedRoute: {
        manualRoute: {
          origin: 'Victoria, BC',
          destination: 'Sooke, BC',
          highwaySequence: ['1', '2', '3'],
          exitPoint: null,
          totalDistance: 1000,
        },
        routeDetails: 'A to B',
      },
      applicationNotes: '',
      permittedCommodity: {
        commodityType: 'XXXXXXX',
        loadDescription: 'NA',
      },
      vehicleConfiguration: {
        axleConfiguration: [
          {
            numberOfAxles: 1,
            numberOfTires: 2,
            tireSize: 279,
            axleSpread: null,
            axleUnitWeight: 5000,
            interaxleSpacing: null,
          },
          {
            interaxleSpacing: 2,
          },
          {
            numberOfAxles: 1,
            numberOfTires: 2,
            tireSize: 279,
            axleSpread: null,
            axleUnitWeight: 5000,
            interaxleSpacing: null,
          },
        ],
        trailers: [
          {
            vehicleSubType: 'XXXXXXX',
            axleConfiguration: null,
          },
          {
            vehicleSubType: 'BOOSTER',
            axleConfiguration: [
              {
                interaxleSpacing: 2,
              },
              {
                numberOfAxles: 1,
                numberOfTires: 2,
                tireSize: 279,
                axleSpread: null,
                axleUnitWeight: 5000,
                interaxleSpacing: null,
              },
            ],
          },
        ],
        loadedGVW: null,
        netWeight: null,
      },
      thirdPartyLiability: null,
      conditionalLicensingFee: null,
    },
    comment: '',
  },
};

describe('Single Trip Overweight Policy Configuration Validator', () => {
  const policy: Policy = new Policy(currentConfig);

  const getDatedPermit = () => {
    const permit = JSON.parse(JSON.stringify(testStow));
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    return permit;
  };

  const getReportedPermit = () =>
    JSON.parse(JSON.stringify(reportedTrailerCrashInput.currentFormData));

  const setTruckTractorWheelbaseScenario = (
    permit: any,
    interaxleSpacing: number,
    axleSpread: number,
  ) => {
    permit.permitData.vehicleDetails.vehicleSubType = 'TRKTRAC';
    permit.permitData.vehicleConfiguration.axleConfiguration[0].numberOfAxles = 1;
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfAxles = 2;
    permit.permitData.vehicleConfiguration.axleConfiguration[1].axleSpread =
      axleSpread;
    permit.permitData.vehicleConfiguration.axleConfiguration[1].interaxleSpacing =
      interaxleSpacing;
  };

  const setMinimumSteerWeightScenario = (
    permit: any,
    steerAxleCount: number,
    steerAxleTireCount: number,
    steerAxleWeight: number,
    driveAxleCount: number,
    driveAxleTireCount: number,
    driveAxleWeight: number,
  ) => {
    permit.permitData.vehicleConfiguration.axleConfiguration[0].numberOfAxles =
      steerAxleCount;
    permit.permitData.vehicleConfiguration.axleConfiguration[0].axleSpread =
      steerAxleCount > 1 ? 160 : undefined;
    permit.permitData.vehicleConfiguration.axleConfiguration[0].numberOfTires =
      steerAxleTireCount;
    permit.permitData.vehicleConfiguration.axleConfiguration[0].axleUnitWeight =
      steerAxleWeight;
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfAxles =
      driveAxleCount;
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfTires =
      driveAxleTireCount;
    permit.permitData.vehicleConfiguration.axleConfiguration[1].axleUnitWeight =
      driveAxleWeight;
  };

  const setPickerTruckTractorScenario = (
    permit: any,
    steerAxleWeight: number,
    driveAxleWeight: number,
  ) => {
    permit.permitData.vehicleDetails.vehicleSubType = 'PICKRTT';
    permit.permitData.vehicleConfiguration.trailers = [];
    permit.permitData.vehicleConfiguration.axleConfiguration = [
      {
        numberOfAxles: 2,
        numberOfTires: 4,
        tireSize: 330,
        axleSpread: 100,
        axleUnitWeight: steerAxleWeight,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 3,
        numberOfTires: 12,
        tireSize: 330,
        axleSpread: 240,
        interaxleSpacing: 485,
        axleUnitWeight: driveAxleWeight,
        vehicleIndex: 0,
      },
    ];
  };

  it('should validate STOW successfully', async () => {
    const permit = getDatedPermit();

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should raise STOW axle calculation violation when an axle unit has zero axles', async () => {
    const permit = getDatedPermit();
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfAxles = 0;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'No. of Axles for Axle Unit 2 cannot be 0.',
    );
  });

  it('should raise STOW axle calculation violation when an axle unit exceeds maximum axles', async () => {
    const permit = getDatedPermit();
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfAxles = 5;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'No. of Axles for Axle Unit 2 is not permittable.',
    );
  });

  it('should raise STOW axle calculation violation when steer axle unit has an invalid wheel count', async () => {
    const permit = getDatedPermit();
    permit.permitData.vehicleConfiguration.axleConfiguration[0].numberOfAxles = 1;
    permit.permitData.vehicleConfiguration.axleConfiguration[0].numberOfTires = 4;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'No. of Wheels for Axle Unit 1 is not permittable.',
    );
  });

  it('should raise STOW axle calculation violation when drive axle unit has an invalid wheel count', async () => {
    const permit = getDatedPermit();
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfAxles = 1;
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfTires = 8;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'No. of Wheels for Axle Unit 2 is not permittable.',
    );
  });

  it('should return structured axle calculation results from validate for nested trailer axle configuration', async () => {
    const permit = getDatedPermit();
    const axleConfiguration =
      permit.permitData.vehicleConfiguration.axleConfiguration;
    permit.permitData.vehicleConfiguration.axleConfiguration =
      axleConfiguration.slice(0, 2);
    permit.permitData.vehicleConfiguration.trailers[0].axleConfiguration = [
      {
        ...axleConfiguration[2],
        numberOfTires: 3,
      },
    ];
    permit.permitData.vehicleConfiguration.trailers[1].axleConfiguration = [
      axleConfiguration[3],
    ];
    permit.permitData.vehicleConfiguration.trailers[2].axleConfiguration = [
      axleConfiguration[4],
    ];

    const validationResult = await policy.validate(permit);
    const wheelCountFailure =
      validationResult.axleCalculationResults?.results.find(
        (result) =>
          result.id === PolicyCheckId.NumberOfWheelsPerAxle &&
          result.result === PolicyCheckResultType.Fail,
      );

    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'No. of Wheels for Axle Unit 3 is not permittable.',
    );
    expect(wheelCountFailure).toMatchObject({
      message: 'No. of Wheels for Axle Unit 3 is not permittable.',
      startAxleUnit: 3,
      endAxleUnit: 3,
    });
  });

  it('should raise STOW axle calculation violation when truck tractor wheelbase exceeds 7.2m', async () => {
    const permit = getDatedPermit();
    setTruckTractorWheelbaseScenario(permit, 660, 140);

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'Wheelbase for Axle Unit 1 and Axle Unit 2 is greater than 7.2m.',
    );
  });

  it('should raise STOW axle calculation violation when truck tractor wheelbase is between 6.2m and 7.2m with jeep and booster selected', async () => {
    const permit = getDatedPermit();
    setTruckTractorWheelbaseScenario(permit, 550, 141);

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'Wheelbase for Axle Unit 1 and Axle Unit 2 is between 6.2m and 7.2m. See CTPM 5.3.7.A.',
    );
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should raise STOW axle calculation violation when single steer axle weight is below 27% of tridem drive axle weight', async () => {
    const permit = getDatedPermit();
    setMinimumSteerWeightScenario(permit, 1, 2, 5399, 3, 12, 20000);

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'Single steer axle must be a minimum of 27% of tridem drive axle weight',
    );
  });

  it('should raise STOW axle calculation violation when tandem steer axle weight is below 40% of tridem drive axle weight', async () => {
    const permit = getDatedPermit();
    setMinimumSteerWeightScenario(permit, 2, 4, 7999, 3, 12, 20000);

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'Tandem steer axle must be a minimum of 40% of drive axle weight',
    );
  });

  it('should raise STOW axle calculation violation for the picker truck tractor 50% rule', async () => {
    const permit = getDatedPermit();
    setPickerTruckTractorScenario(permit, 9000, 20000);

    const validationResult = await policy.validate(permit);
    const axleViolation = validationResult.violations.find(
      (violation: any) =>
        violation.message ===
        'Vehicle configuration failed axle calculation policy checks',
    );

    expect(axleViolation?.details).toContain(
      'Axle Unit 1 must carry a minimum 50% of Axle Unit 2 axle unit weight.',
    );
  });

  it('should raise STOW axle calculation violation for the picker truck tractor trailer restriction', async () => {
    const permit = getDatedPermit();
    setPickerTruckTractorScenario(permit, 14000, 24001);
    permit.permitData.vehicleConfiguration.trailers = [
      {
        vehicleSubType: 'STACTRN',
      },
    ];
    permit.permitData.vehicleConfiguration.axleConfiguration.push({
      numberOfAxles: 3,
      numberOfTires: 12,
      tireSize: 330,
      axleSpread: 240,
      interaxleSpacing: 300,
      axleUnitWeight: 18000,
      vehicleIndex: 1,
    });

    const validationResult = await policy.validate(permit);
    const axleViolation = validationResult.violations.find(
      (violation: any) =>
        violation.message ===
        'Vehicle configuration failed axle calculation policy checks',
    );

    expect(axleViolation?.details).toContain(
      'Cannot tow a trailer if Axle Unit 1 and Axle Unit 2 are exceeding legal axle weights.',
    );
  });

  // =========================================================================
  // MAXIMUM TIRE LOAD VALIDATION
  // =========================================================================
  describe('STOW Axle Calculation - Maximum Tire Load', () => {
    const testTireLoadResult = async (
      vehicleSubType: string,
      axleIndex: number,
      tireSize: number,
      numberOfTires: number,
      axleWeight: number,
      shouldFail: boolean,
    ) => {
      const permit = getDatedPermit();
      permit.permitData.vehicleDetails.vehicleSubType = vehicleSubType;

      // Clear trailers to simplify payload and prevent cross-validation structure errors
      permit.permitData.vehicleConfiguration.trailers = [];

      // Create a simplified two-axle unit configuration with valid bridge formula spacing
      permit.permitData.vehicleConfiguration.axleConfiguration = [
        {
          numberOfAxles: 1,
          numberOfTires: 2,
          tireSize: 330,
          axleUnitWeight: 5000,
        },
        {
          numberOfAxles: 2,
          numberOfTires: 4,
          tireSize: 330,
          axleUnitWeight: 10000,
          axleSpread: 150,
          interaxleSpacing: 500,
        },
      ];

      permit.permitData.vehicleConfiguration.axleConfiguration[
        axleIndex
      ].tireSize = tireSize;
      permit.permitData.vehicleConfiguration.axleConfiguration[
        axleIndex
      ].numberOfTires = numberOfTires;
      permit.permitData.vehicleConfiguration.axleConfiguration[
        axleIndex
      ].axleUnitWeight = axleWeight;

      const validationResult = await policy.validate(permit);

      const axleViolation = validationResult.violations.find(
        (v: any) =>
          v.message ===
          'Vehicle configuration failed axle calculation policy checks',
      );

      const targetMessage = `Tire Size for Axle Unit ${axleIndex + 1} exceeds its load capacity.`;

      if (shouldFail) {
        expect(axleViolation).toBeDefined();
        expect(axleViolation?.details).toContain(targetMessage);
      } else {
        if (axleViolation && axleViolation.details) {
          expect(axleViolation.details).not.toContain(targetMessage);
        }
      }
    };

    describe('Standard Vehicle Steer Axle (Rate Limit & Single Steer Cap)', () => {
      it('should pass exactly at 100 kg/cm rate limit - 445mm', async () => {
        await testTireLoadResult('TRKTRAC', 0, 445, 2, 8900, false);
      });
      it('should fail just above 100 kg/cm rate limit - 445mm', async () => {
        await testTireLoadResult('TRKTRAC', 0, 445, 2, 8901, true);
      });
      it('should pass at 9,100 kg/axle single steer cap limit - 457mm', async () => {
        await testTireLoadResult('TRKTRAC', 0, 457, 2, 9100, false);
      });
      it('should fail just above 9,100 kg/axle single steer cap limit - 457mm', async () => {
        await testTireLoadResult('TRKTRAC', 0, 457, 2, 9101, true);
      });
    });

    describe('Standard Vehicle Non-Steering Axle (>=445mm and <=444mm)', () => {
      it('should pass at limit for tires >=445mm (rate limit binding)', async () => {
        await testTireLoadResult('TRKTRAC', 1, 445, 4, 17800, false);
      });
      it('should fail just above limit for tires >=445mm (rate limit binding)', async () => {
        await testTireLoadResult('TRKTRAC', 1, 445, 4, 17801, true);
      });
      it('should pass at limit for tires >=445mm (cap binding - 4,550 kg/tire)', async () => {
        await testTireLoadResult('TRKTRAC', 1, 457, 4, 18200, false);
      });
      it('should fail just above limit for tires >=445mm (cap binding - 4,550 kg/tire)', async () => {
        await testTireLoadResult('TRKTRAC', 1, 457, 4, 18201, true);
      });
      it('should pass at cap limit for tires <=444mm (3,000 kg/tire)', async () => {
        await testTireLoadResult('TRKTRAC', 1, 385, 4, 12000, false);
      });
      it('should fail just above cap limit for tires <=444mm (3,000 kg/tire)', async () => {
        await testTireLoadResult('TRKTRAC', 1, 385, 4, 12001, true);
      });
    });

    describe('Crane - All Terrain (CRANEAT)', () => {
      it('should pass at limit for tires >=520mm', async () => {
        await testTireLoadResult('CRANEAT', 0, 550, 2, 11000, false);
      });
      it('should fail just above limit for tires >=520mm', async () => {
        await testTireLoadResult('CRANEAT', 0, 550, 2, 11001, true);
      });
    });

    describe('Crane - Mobile (CRANEMB)', () => {
      it('should pass at limit for non-steer axle tires >=520mm', async () => {
        await testTireLoadResult('CRANEMB', 1, 550, 2, 11000, false);
      });
      it('should fail just above limit for non-steer axle tires >=520mm', async () => {
        await testTireLoadResult('CRANEMB', 1, 550, 2, 11001, true);
      });
    });

    describe('Rubber Tired Loaders (RBTRLDR)', () => {
      it('should pass at 11,000 kg/axle limit for tires >=520mm and <600mm', async () => {
        await testTireLoadResult('RBTRLDR', 0, 550, 2, 11000, false);
      });
      it('should fail just above 11,000 kg/axle limit for tires >=520mm and <600mm', async () => {
        await testTireLoadResult('RBTRLDR', 0, 550, 2, 11001, true);
      });
      it('should pass at 12,000 kg/axle limit for tires >=600mm', async () => {
        await testTireLoadResult('RBTRLDR', 0, 609, 2, 12000, false);
      });
      it('should fail just above 12,000 kg/axle limit for tires >=600mm', async () => {
        await testTireLoadResult('RBTRLDR', 0, 609, 2, 12001, true);
      });
    });
  });

  // The below four tests were written to validate a reported error by Glen, but unfortunately
  // I'm unable to replicate the error. I've added below tests to ensure we don't regress.
  it('should not crash validating the reported STOW input with trailers', async () => {
    const permit = getReportedPermit();

    await expect(policy.validate(permit)).resolves.toMatchObject({
      violations: expect.any(Array),
    });
  });

  it('should not crash validating the reported STOW input without trailers', async () => {
    const permit = getReportedPermit();
    permit.permitData.vehicleConfiguration.trailers = [];

    await expect(policy.validate(permit)).resolves.toMatchObject({
      violations: expect.any(Array),
    });
  });

  it('should not crash running axle calculation for the reported STOW input with trailers', () => {
    const permit = getReportedPermit();
    const vehicleConfiguration = policy.getSimplifiedVehicleConfiguration(
      permit.permitData.vehicleDetails,
      permit.permitData.vehicleConfiguration,
    );
    const axleConfiguration = policy.combineAxleConfigurations(
      permit.permitData.vehicleConfiguration.axleConfiguration,
      permit.permitData.vehicleConfiguration.trailers,
    );

    expect(() =>
      policy.runAxleCalculation(
        vehicleConfiguration,
        axleConfiguration,
        permit.permitData.vehicleDetails.licensedGVW,
      ),
    ).not.toThrow();
  });

  it('should not crash running axle calculation for the reported STOW input without trailers', () => {
    const permit = getReportedPermit();
    permit.permitData.vehicleConfiguration.trailers = [];
    const vehicleConfiguration = policy.getSimplifiedVehicleConfiguration(
      permit.permitData.vehicleDetails,
      permit.permitData.vehicleConfiguration,
    );
    const axleConfiguration = policy.combineAxleConfigurations(
      permit.permitData.vehicleConfiguration.axleConfiguration,
      permit.permitData.vehicleConfiguration.trailers,
    );

    expect(() =>
      policy.runAxleCalculation(
        vehicleConfiguration,
        axleConfiguration,
        permit.permitData.vehicleDetails.licensedGVW,
      ),
    ).not.toThrow();
  });

  it('should raise STOW axle calculation violation when drive and jeep axle units are not load equalized', async () => {
    const permit = getDatedPermit();
    permit.permitData.vehicleConfiguration.axleConfiguration[1].axleUnitWeight = 12000;
    permit.permitData.vehicleConfiguration.axleConfiguration[2].axleUnitWeight = 10999;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'Axle Unit 2 and Axle Unit 3 must be load equalized within 1000 kg.',
    );
  });
});
