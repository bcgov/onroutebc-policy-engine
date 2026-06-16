import { Policy } from '../../policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

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
    setTruckTractorWheelbaseScenario(permit, 550, 140);

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
    permit.permitData.vehicleConfiguration.axleConfiguration[1].axleUnitWeight =
      12000;
    permit.permitData.vehicleConfiguration.axleConfiguration[2].axleUnitWeight =
      10999;

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
