import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Single Trip Overweight Policy Configuration Validator', () => {
  const policy: Policy = new Policy(currentConfig);
  const evaluationFailurePermit = {
    permitType: 'STOW',
    comment: '',
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
      permitDuration: 1,
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
      feeSummary: '',
      loas: [],
      applicationNotes: '',
      permittedCommodity: {
        commodityType: 'EMPTYXX',
        loadDescription: 'NA',
      },
      thirdPartyLiability: null,
      conditionalLicensingFee: null,
      startDate: '2026-05-12',
      expiryDate: '2026-05-12',
      vehicleDetails: {
        vin: '123456',
        plate: 'ABC123',
        make: 'Volvo',
        year: 2020,
        countryCode: 'CA',
        provinceCode: 'BC',
        vehicleType: 'powerUnit',
        vehicleSubType: 'PICKRTT',
        saveVehicle: false,
        unitNumber: '',
        vehicleId: '',
        licensedGVW: 20000,
      },
      vehicleConfiguration: {
        trailers: [
          {
            vehicleSubType: 'EXPANDO',
            axleConfiguration: [
              {
                numberOfAxles: 1,
                numberOfTires: 1,
                tireSize: 279,
                axleSpread: null,
                axleUnitWeight: 5000,
                interaxleSpacing: 200,
              },
            ],
          },
        ],
        frontProjection: null,
        rearProjection: null,
        overallWidth: null,
        overallHeight: null,
        overallLength: null,
        loadedGVW: null,
        netWeight: null,
        axleConfiguration: [
          {
            numberOfAxles: 2,
            numberOfTires: 1,
            tireSize: 279,
            axleSpread: 256,
            axleUnitWeight: 5000,
            interaxleSpacing: null,
          },
          {
            numberOfAxles: 2,
            numberOfTires: 1,
            tireSize: 330,
            axleSpread: 200,
            axleUnitWeight: 5000,
            interaxleSpacing: 200,
          },
        ],
      },
      permittedRoute: {
        manualRoute: {
          origin: 'A',
          destination: 'B',
          highwaySequence: [],
          exitPoint: null,
          totalDistance: 1000,
        },
        routeDetails: 'A to B',
      },
    },
  };

  const getDatedPermit = () => {
    const permit = JSON.parse(JSON.stringify(testStow));
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    return permit;
  };

  it('should validate STOW successfully', async () => {
    const permit = getDatedPermit();

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should raise STOW axle calculation violation when an axle unit has zero axles', async () => {
    const permit = getDatedPermit();
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfAxles =
      0;

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
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfAxles =
      5;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'No. of Axles for Axle Unit 2 is not permittable.',
    );
  });

  it('should validate submitted STOW evaluation failure payload', async () => {
    const permit = JSON.parse(JSON.stringify(evaluationFailurePermit));

    await expect(policy.validate(permit)).rejects.toThrow(
      'Missing weight dimensions',
    );
  });

  it('should validate submitted STOW evaluation failure payload differently without trailers', async () => {
    const permit = JSON.parse(JSON.stringify(evaluationFailurePermit));
    delete permit.permitData.vehicleConfiguration.trailers;

    const validationResult = await policy.validate(permit);

    expect({
      violations: validationResult.violations,
      warnings: validationResult.warnings,
      requirements: validationResult.requirements,
      information: validationResult.information,
    }).toMatchSnapshot();
  });
});
