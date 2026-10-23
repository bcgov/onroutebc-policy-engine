import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { PERMIT_CODES } from '../../constants/permit-codes';
import { POWER_UNITS } from '../../constants/power-units';
import { TRAILERS } from '../../constants/trailers';
import { Policy } from '../../policy-engine';
import stosPolicyConfig from '../policy-config/stos-vehicle-config.sample.json';

describe('Permit Engine Size Dimension Functions', () => {
  const policy: Policy = new Policy(stosPolicyConfig);

  it('should assume all regions if none are supplied', async () => {
    // This configuration has minimum values pulled from multiple regions
    const sizeDimension = policy.getSizeDimension(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.EMPTY,
      [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.JEEPS.id,
        TRAILERS.HIBOYS_EXPANDOS.id,
      ],
    );
    expect(sizeDimension?.fp).toBe(3);
    expect(sizeDimension?.rp).toBe(6.5);
    expect(sizeDimension?.l).toBe(31);
    expect(sizeDimension?.h).toBe(4.15);
    expect(sizeDimension?.w).toBe(2.6);
  });

  it('should retrieve correct values for a single specified region', async () => {
    const sizeDimension = policy.getSizeDimension(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.EMPTY,
      [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.JEEPS.id,
        TRAILERS.PLATFORM_TRAILERS.id,
      ],
      ['PCE'],
    );
    expect(sizeDimension?.fp).toBe(3);
    expect(sizeDimension?.rp).toBe(6.5);
    expect(sizeDimension?.l).toBe(27.5);
    expect(sizeDimension?.h).toBe(5.33);
    expect(sizeDimension?.w).toBe(3.2);
  });

  it('should throw an error if an invalid permit type is specified', async () => {
    expect(() => {
      policy.getSizeDimension('_INVALID', COMMODITY_CODES.EMPTY, [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.JEEPS.id,
        TRAILERS.SEMI_TRAILERS_WHEELERS.id,
      ]);
    }).toThrow();
  });

  it('should return null if an invalid configuration is specified', async () => {
    const sizeDimension = policy.getSizeDimension(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.EMPTY,
      ['_INVALID', TRAILERS.JEEPS.id, TRAILERS.SEMI_TRAILERS_WHEELERS.id],
    );
    expect(sizeDimension).toBeNull();
  });

  it('should return null if no dimensionable trailer is specified', async () => {
    const sizeDimension = policy.getSizeDimension(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.EMPTY,
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.JEEPS.id],
    );
    expect(sizeDimension).toBeNull();
  });

  it('should throw an error if an invalid commodity is specified', async () => {
    expect(() => {
      policy.getSizeDimension(PERMIT_CODES.SINGLE_TRIP_OVERSIZE, '_INVALID', [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.JEEPS.id,
      ]);
    }).toThrow();
  });
});
