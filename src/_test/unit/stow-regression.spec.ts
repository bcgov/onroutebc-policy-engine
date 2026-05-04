import { Policy } from '../../policy-engine';
import generatedPolicyConfig from '../policy-config/_current-config.generated.json';
import specialAuthLcv from '../policy-config/special-auth-lcv.sample.json';

describe('STOW regression surface', () => {
  const policy = new Policy(generatedPolicyConfig);
  // The audit tools compare against an LCV-authorized policy instance so XLS LCV rows
  // are not reported as missing, but the default engine behavior should still hide them.
  const lcvPolicy = new Policy(generatedPolicyConfig, specialAuthLcv);

  it('should expose the newly added direct STOW cases', () => {
    expect(
      Array.from(policy.getPermittablePowerUnitTypes('STOW', 'MFHOMEL').keys()),
    ).toContain('TRKTRAC');
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'MFHOMEL', ['TRKTRAC']).keys(),
      ),
    ).toEqual(expect.arrayContaining(['DOLLIES', 'STSDBDK', 'STWHELR']));
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC']).keys(),
      ),
    ).toContain('SEMITRL');
  });

  it('should only expose booster cases that are backed by direct booster-capable rows', () => {
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'FIXEDEQ', [
          'TRKTRAC',
          'FEDRMMX',
        ]).keys(),
      ),
    ).toContain('BOOSTER');
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'XXXXXXX', [
          'TRKTRAC',
          'FECVYRX',
        ]).keys(),
      ),
    ).not.toContain('BOOSTER');
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'XXXXXXX', [
          'TRKTRAC',
          'SEMITRL',
        ]).keys(),
      ),
    ).not.toContain('BOOSTER');
  });

  it('should hide LCV power units by default and expose them with LCV auth', () => {
    expect(
      Array.from(policy.getPermittablePowerUnitTypes('STOW', 'XXXXXXX').keys()),
    ).not.toEqual(expect.arrayContaining(['LCVRMDB', 'LCVTPDB']));

    expect(
      Array.from(lcvPolicy.getPermittablePowerUnitTypes('STOW', 'XXXXXXX').keys()),
    ).toEqual(expect.arrayContaining(['LCVRMDB', 'LCVTPDB']));
  });

  it('should require LCV auth before STOW LCV trailers become selectable and should not infer boosters from trailer-weight rows alone', () => {
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'XXXXXXX', ['LCVRMDB']).keys(),
      ),
    ).toEqual([]);

    expect(
      Array.from(
        lcvPolicy.getNextPermittableVehicles('STOW', 'XXXXXXX', ['LCVRMDB']).keys(),
      ),
    ).toEqual(expect.arrayContaining(['SEMITRL']));

    expect(
      Array.from(
        lcvPolicy
          .getNextPermittableVehicles('STOW', 'XXXXXXX', ['LCVRMDB', 'SEMITRL'])
          .keys(),
      ),
    ).not.toContain('BOOSTER');
  });

  it.each([
    // xls row: 17, Empty / Picker Truck Tractors / Jeep
    { commodityId: 'EMPTYXX', powerUnitId: 'PICKRTT' },
    // xls row: 29, Non-Reducible Loads / Picker Truck Tractors / Jeep
    { commodityId: 'NONREDU', powerUnitId: 'PICKRTT' },
    // xls row: 42, None / Picker Truck Tractors / Jeep
    { commodityId: 'XXXXXXX', powerUnitId: 'PICKRTT' },
    // xls row: 50, Bridge Beams / Truck Tractors / Jeep
    { commodityId: 'BRGBEAM', powerUnitId: 'TRKTRAC' },
    // xls row: 54, Empty / Truck Tractors / Jeep
    { commodityId: 'EMPTYXX', powerUnitId: 'TRKTRAC' },
    // xls row: 71, Fixed Equipment / Truck Tractors / Jeep
    { commodityId: 'FIXEDEQ', powerUnitId: 'TRKTRAC' },
    // xls row: 74, Intermodal Containers without Sides / Truck Tractors / Jeep
    { commodityId: 'IMCONWS', powerUnitId: 'TRKTRAC' },
    // xls row: 77, Laminated Beams / Truck Tractors / Jeep
    { commodityId: 'LAMBEAM', powerUnitId: 'TRKTRAC' },
    // xls row: 82, Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW) / Truck Tractors / Jeep
    { commodityId: 'MFHOMEL', powerUnitId: 'TRKTRAC' },
    // xls row: 86, Non-Reducible Loads / Truck Tractors / Jeep
    { commodityId: 'NONREDU', powerUnitId: 'TRKTRAC' },
    // xls row: 105, None / Truck Tractors / Jeep
    { commodityId: 'XXXXXXX', powerUnitId: 'TRKTRAC' },
    // xls row: 110, Oil Field Equipment / Truck Tractors / Jeep
    { commodityId: 'OILFILD', powerUnitId: 'TRKTRAC' },
    // xls row: 113, Reducible Loads / Truck Tractors / Jeep
    { commodityId: 'REDUCBL', powerUnitId: 'TRKTRAC' },
    // xls row: 121, Scrapers on Dollies / Truck Tractors / Jeep
    { commodityId: 'SCRAPER', powerUnitId: 'TRKTRAC' },
  ])(
    'should treat Jeep as a valid STOW trailer option for $commodityId / $powerUnitId',
    ({ commodityId, powerUnitId }) => {
    expect(
      Array.from(
        policy
          .getNextPermittableVehicles('STOW', commodityId, [powerUnitId])
          .keys(),
      ),
    ).toContain('JEEPSRG');

    expect(
      policy.isConfigurationValid('STOW', commodityId, [
        powerUnitId,
        'JEEPSRG',
      ]),
    ).toBe(true);
    },
  );
});
