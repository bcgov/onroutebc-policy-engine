import { Policy } from 'onroute-policy-engine';
import weightConfig from '../policy-config/weight-dimensions.sample.json';
import testStow from '../permit-app/test-stow.json';
import { PowerUnitWeightDimension, TrailerWeightDimension } from '../../types';
import { getVehicleRelatives } from '../../helper/dimensions.helper';

describe('Weight Default Tests', () => {
  const policy: Policy = new Policy(weightConfig);

  it('should retrieve the correct power unit weight from global default', () => {
    const dim: Array<PowerUnitWeightDimension> =
      policy.getDefaultPowerUnitWeight('DDCKBUS', 11);
    expect(dim).toHaveLength(1);
    expect(dim[0].axles).toBe(11);
    expect(dim[0].daLegal).toBe(9011);
    expect(dim[0].daPermittable).toBe(11011);
    expect(dim[0].saLegal).toBe(6011);
    expect(dim[0].saPermittable).toBe(9011);
    expect(dim[0].modifier).toBeFalsy();
  });

  it('should retrieve the correct trailer weight from global default', () => {
    const dim: Array<TrailerWeightDimension> = policy.getDefaultTrailerWeight(
      'STROPRT',
      2,
    );
    expect(dim).toHaveLength(1);
    expect(dim[0].axles).toBe(2);
    expect(dim[0].legal).toBe(17002);
    expect(dim[0].permittable).toBe(23002);
    expect(dim[0].modifier).toBeFalsy();
  });

  it('should retrieve the correct power unit weight from category default', () => {
    const dim: Array<PowerUnitWeightDimension> =
      policy.getDefaultPowerUnitWeight('CRANEAT', 11);
    expect(dim).toHaveLength(1);
    expect(dim[0].axles).toBe(11);
    expect(dim[0].daLegal).toBe(9511);
    expect(dim[0].daPermittable).toBe(11511);
    expect(dim[0].saLegal).toBe(9511);
    expect(dim[0].saPermittable).toBe(9511);
    expect(dim[0].modifier).toBeFalsy();
  });

  it('should retrieve the correct trailer weight from category default', () => {
    const dim: Array<TrailerWeightDimension> = policy.getDefaultTrailerWeight(
      'FEWHELR',
      2,
    );
    expect(dim).toHaveLength(1);
    expect(dim[0].axles).toBe(2);
    expect(dim[0].legal).toBe(17402);
    expect(dim[0].permittable).toBe(31402);
    expect(dim[0].modifier).toBeFalsy();
  });

  it('should retrieve the correct trailer weight when axles not permitted (zero weight)', () => {
    const dim: Array<TrailerWeightDimension> = policy.getDefaultTrailerWeight(
      'FEWHELR',
      1,
    );
    expect(dim).toHaveLength(1);
    expect(dim[0].axles).toBe(1);
    expect(dim[0].legal).toBe(0);
    expect(dim[0].permittable).toBe(0);
    expect(dim[0].modifier).toBeFalsy();
  });

  it('should retrieve no weights for an invalid number of axles', () => {
    const dim: Array<TrailerWeightDimension> = policy.getDefaultTrailerWeight(
      'FEWHELR',
      4,
    );
    expect(dim).toHaveLength(0);
  });

  it('should retrieve the correct power unit weight from type specific', () => {
    const dim: Array<PowerUnitWeightDimension> =
      policy.getDefaultPowerUnitWeight('GRADERS', 11);
    expect(dim).toHaveLength(1);
    expect(dim[0].axles).toBe(11);
    expect(dim[0].daLegal).toBe(9611);
    expect(dim[0].daPermittable).toBe(11611);
    expect(dim[0].saLegal).toBe(9611);
    expect(dim[0].saPermittable).toBe(9611);
    expect(dim[0].modifier).toBeFalsy();
  });

  it('should retrieve the correct power unit weight from global with unconfigured type axle number', () => {
    const dim: Array<PowerUnitWeightDimension> =
      policy.getDefaultPowerUnitWeight('GRADERS', 22);
    expect(dim).toHaveLength(1);
    expect(dim[0].axles).toBe(22);
    expect(dim[0].daLegal).toBe(17022);
    expect(dim[0].daPermittable).toBe(23022);
    expect(dim[0].saLegal).toBe(17022);
    expect(dim[0].saPermittable).toBe(17022);
    expect(dim[0].modifier).toBeFalsy();
  });

  it('should retrieve the correct trailer weight from type specific', () => {
    const dim: Array<TrailerWeightDimension> = policy.getDefaultTrailerWeight(
      'FEBGHSE',
      2,
    );
    expect(dim).toHaveLength(1);
    expect(dim[0].axles).toBe(2);
    expect(dim[0].legal).toBe(17702);
    expect(dim[0].permittable).toBe(21702);
    expect(dim[0].modifier).toBeFalsy();
  });

  it('should retrieve the correct trailer weight with modifiers', () => {
    const dim: Array<TrailerWeightDimension> = policy.getDefaultTrailerWeight(
      'BOOSTER',
      1,
    );
    expect(dim).toHaveLength(2);
  });
});

describe('Weight Dimension Modifier Tests', () => {
  const policy: Policy = new Policy(weightConfig);

  // Assuming testStow is for a configuration of:
  // TRKTRAC,JEEPSRG,PLATFRM,BOOSTER
  const configuration = testStow.permitData.vehicleConfiguration.trailers.map(
    (t) => t.vehicleSubType,
  );
  configuration.unshift(testStow.permitData.vehicleDetails.vehicleSubType);
  const axleConfig = testStow.permitData.vehicleConfiguration.axleConfiguration;

  it('should get the correct relatives for the configuration', () => {
    const relatives = getVehicleRelatives(policy, configuration, 3);
    expect(relatives).not.toBeNull();
    expect(relatives.firstCategory).toBe('powerunit');
    expect(relatives.firstType).toBe('TRKTRAC');
    expect(relatives.lastCategory).toBe('accessory');
    expect(relatives.lastType).toBe('BOOSTER');
    expect(relatives.prevCategory).toBe('accessory');
    expect(relatives.prevType).toBe('JEEPSRG');
    expect(relatives.nextCategory).toBe('accessory');
    expect(relatives.nextType).toBe('BOOSTER');
  });

  it('should retrieve the correct semi weight for tandem booster', () => {
    const defaultTrailerWeight = policy.getDefaultTrailerWeight('PLATFRM', 3);
    expect(defaultTrailerWeight).toHaveLength(3);
    expect(axleConfig).toHaveLength(5);

    // Set booster to tandem
    axleConfig[4].numberOfAxles = 2;
    const dim = policy.selectCorrectWeightDimension(
      defaultTrailerWeight,
      configuration,
      axleConfig,
      3,
    );
    expect(dim).not.toBeNull();
    expect(dim?.legal).toBe(24203);
    expect(dim?.permittable).toBe(28203);
  });

  it('should retrieve the correct semi weight for tridem booster', () => {
    const defaultTrailerWeight = policy.getDefaultTrailerWeight('PLATFRM', 3);
    expect(defaultTrailerWeight).toHaveLength(3);
    expect(axleConfig).toHaveLength(5);

    // Set booster to tridem
    axleConfig[4].numberOfAxles = 3;
    const dim = policy.selectCorrectWeightDimension(
      defaultTrailerWeight,
      configuration,
      axleConfig,
      3,
    );
    expect(dim).not.toBeNull();
    expect(dim?.legal).toBe(24303);
    expect(dim?.permittable).toBe(28303);
  });

  it('should retrieve the correct semi weight for single booster', () => {
    const defaultTrailerWeight = policy.getDefaultTrailerWeight('PLATFRM', 3);
    expect(defaultTrailerWeight).toHaveLength(3);
    expect(axleConfig).toHaveLength(5);

    // Set booster to tridem
    axleConfig[4].numberOfAxles = 1;
    const dim = policy.selectCorrectWeightDimension(
      defaultTrailerWeight,
      configuration,
      axleConfig,
      3,
    );
    expect(dim).not.toBeNull();
    expect(dim?.legal).toBe(24103);
    expect(dim?.permittable).toBe(29103);
  });

  it('should retrieve the correct booster weight after semi (close)', () => {
    const defaultTrailerWeight = policy.getDefaultTrailerWeight('BOOSTER', 1);
    expect(defaultTrailerWeight).toHaveLength(2);
    expect(axleConfig).toHaveLength(5);

    // Set booster to single, spacing 410
    axleConfig[4].numberOfAxles = 1;
    axleConfig[4].interaxleSpacing = 410;
    // Set semi to tridem
    axleConfig[3].numberOfAxles = 3;
    const dim = policy.selectCorrectWeightDimension(
      defaultTrailerWeight,
      configuration,
      axleConfig,
      4,
    );
    expect(dim).not.toBeNull();
    expect(dim?.legal).toBe(9198);
    expect(dim?.permittable).toBe(9199);
  });

  it('should retrieve the correct booster weight after semi (far)', () => {
    const defaultTrailerWeight = policy.getDefaultTrailerWeight('BOOSTER', 1);
    expect(defaultTrailerWeight).toHaveLength(2);
    expect(axleConfig).toHaveLength(5);

    // Set booster to single, spacing 410
    axleConfig[4].numberOfAxles = 1;
    axleConfig[4].interaxleSpacing = 420;
    // Set semi to tridem
    axleConfig[3].numberOfAxles = 3;
    const dim = policy.selectCorrectWeightDimension(
      defaultTrailerWeight,
      configuration,
      axleConfig,
      4,
    );
    expect(dim).not.toBeNull();
    expect(dim?.legal).toBe(9100);
    expect(dim?.permittable).toBe(11000);
  });
});
