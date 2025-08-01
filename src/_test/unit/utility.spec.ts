import { PermitType } from 'onroute-policy-engine/types';
import { Policy } from 'onroute-policy-engine';
import fiveTypes from '../policy-config/five-types.sample.json';
import weightSample from '../policy-config/weight-dimensions.sample.json';
import trosOnly from '../policy-config/tros-only.sample.json';
import specialAuth from '../policy-config/special-auth-lcv.sample.json';

describe('Permit Engine Utility Functions', () => {
  const policy: Policy = new Policy(fiveTypes);

  it('should return the correct number of permit types', async () => {
    const permitTypes: Map<string, string> = policy.getPermitTypes();
    expect(permitTypes.size).toBe(5);
  });

  it('should return the correct number of geographic regions', async () => {
    const geographicRegions: Map<string, string> =
      policy.getGeographicRegions();
    expect(geographicRegions.size).toBe(3);
  });

  it('should return the correct number of commodities', async () => {
    const commodities: Map<string, string> = policy.getCommodities();
    expect(commodities.size).toBe(31);
  });

  it('should return the correct number of commodities for overweight', async () => {
    const policyAlt = new Policy(weightSample);
    const commodities: Map<string, string> = policyAlt.getCommodities('STOW');
    expect(commodities.size).toBe(3);
    expect(commodities.get('XXXXXXX')).toBeTruthy();
    expect(commodities.get('REDUCBL')).toBeTruthy();
    expect(commodities.get('EMPTYXX')).toBeTruthy();
  });

  it('should return the correct number of power unit types', async () => {
    const powerUnitTypes: Map<string, string> = policy.getPowerUnitTypes();
    expect(powerUnitTypes.size).toBe(27);
  });

  it('should return the correct number of trailer types', async () => {
    const trailerTypes: Map<string, string> = policy.getTrailerTypes();
    expect(trailerTypes.size).toBe(50);
  });

  it('should return the correct number of trailer types (complete)', async () => {
    const trailerTypes: Map<string, string> = policy.getTrailerTypes(true);
    expect(trailerTypes.size).toBe(53);
  });

  it('should return a TROS permit type', async () => {
    const permitType: PermitType | null =
      policy.getPermitTypeDefinition('TROS');
    expect(permitType).not.toBeNull();
  });

  it('should return null for an unknown permit type', async () => {
    const permitType: PermitType | null =
      policy.getPermitTypeDefinition('__INVALID');
    expect(permitType).toBeNull();
  });
});

describe('Permit Engine Permittable Vehicle Functions', () => {
  const policy: Policy = new Policy(trosOnly);
  const lcvPolicy: Policy = new Policy(trosOnly, specialAuth);

  it('should return the correct number of permittable vehicles, excluding lcv', async () => {
    const permittableVehicles: Map<
      string,
      Map<string, string>
    > = policy.getPermittableVehicleTypes('TROS');
    expect(permittableVehicles.get('powerUnits')?.size).toBe(2);
    expect(permittableVehicles.get('trailers')?.size).toBe(3);
  });

  it('should return the correct number of permittable vehicles, including lcv', async () => {
    const permittableVehicles: Map<
      string,
      Map<string, string>
    > = lcvPolicy.getPermittableVehicleTypes('TROS');
    expect(permittableVehicles.get('powerUnits')?.size).toBe(3);
    expect(permittableVehicles.get('trailers')?.size).toBe(3);
  });
});
