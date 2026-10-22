// Axle unit types as the workbook writes them, and their number of axles.
const AXLE_COUNTS: Record<string, number> = {
  Single: 1,
  Tandem: 2,
  Tridem: 3,
};

export const AXLE_TYPES = Object.keys(AXLE_COUNTS);

export function isAxleType(axleType: string): boolean {
  return AXLE_TYPES.includes(axleType);
}

export function getAxleCount(axleType: string): number {
  if (!isAxleType(axleType)) {
    throw new Error(`Unknown axle type: '${axleType}'`);
  }
  return AXLE_COUNTS[axleType];
}
