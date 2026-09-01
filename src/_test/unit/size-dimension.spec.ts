import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { TRAILER_CODES } from '../../constants/trailer-codes';
import { Policy } from '../../policy-engine';
import stosPolicyConfig from '../policy-config/stos-vehicle-config.sample.json';

describe('Permit Engine Size Dimension Functions', () => {
  const policy: Policy = new Policy(stosPolicyConfig);

  it('should assume all regions if none are supplied', async () => {
    // This configuration has minimum values pulled from multiple regions
    const sizeDimension = policy.getSizeDimension(
      'STOS',
      COMMODITY_CODES.EMPTY,
      [
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.JEEPS,
        TRAILER_CODES.HIBOYS_EXPANDOS,
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
      'STOS',
      COMMODITY_CODES.EMPTY,
      [
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.JEEPS,
        TRAILER_CODES.PLATFORM_TRAILERS,
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
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.JEEPS,
        TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
      ]);
    }).toThrow();
  });

  it('should return null if an invalid configuration is specified', async () => {
    const sizeDimension = policy.getSizeDimension(
      'STOS',
      COMMODITY_CODES.EMPTY,
      ['_INVALID', TRAILER_CODES.JEEPS, TRAILER_CODES.SEMI_TRAILERS_WHEELERS],
    );
    expect(sizeDimension).toBeNull();
  });

  it('should return null if no dimensionable trailer is specified', async () => {
    const sizeDimension = policy.getSizeDimension(
      'STOS',
      COMMODITY_CODES.EMPTY,
      [POWER_UNIT_CODES.TRUCK_TRACTORS, TRAILER_CODES.JEEPS],
    );
    expect(sizeDimension).toBeNull();
  });

  it('should throw an error if an invalid commodity is specified', async () => {
    expect(() => {
      policy.getSizeDimension('STOS', '_INVALID', [
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.JEEPS,
      ]);
    }).toThrow();
  });
});
