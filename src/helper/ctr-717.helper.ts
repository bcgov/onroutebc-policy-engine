const CTR_717_WEIGHT_BANDS = [
  { minimumSpreadCm: 800, maximumWeightKg: 34000 },
  { minimumSpreadCm: 760, maximumWeightKg: 33000 },
  { minimumSpreadCm: 720, maximumWeightKg: 32000 },
  { minimumSpreadCm: 690, maximumWeightKg: 31000 },
  { minimumSpreadCm: 650, maximumWeightKg: 30000 },
  { minimumSpreadCm: 610, maximumWeightKg: 29000 },
  { minimumSpreadCm: 570, maximumWeightKg: 28000 },
  { minimumSpreadCm: 530, maximumWeightKg: 27000 },
  { minimumSpreadCm: 500, maximumWeightKg: 26000 },
  { minimumSpreadCm: 460, maximumWeightKg: 25000 },
  { minimumSpreadCm: 420, maximumWeightKg: 24000 },
  { minimumSpreadCm: 380, maximumWeightKg: 23000 },
  { minimumSpreadCm: 340, maximumWeightKg: 22000 },
  { minimumSpreadCm: 300, maximumWeightKg: 21000 },
  { minimumSpreadCm: 260, maximumWeightKg: 20000 },
  { minimumSpreadCm: 230, maximumWeightKg: 19000 },
  { minimumSpreadCm: 190, maximumWeightKg: 18000 },
  { minimumSpreadCm: 120, maximumWeightKg: 17000 },
  { minimumSpreadCm: 100, maximumWeightKg: 16500 },
  { minimumSpreadCm: 0, maximumWeightKg: 9100 },
] as const;

/** Returns the authoritative CTR 7.17 table value for a spread in centimetres. */
export function getCtr717TableValue(spreadCm: number): number | undefined {
  if (!Number.isFinite(spreadCm) || spreadCm < 0) {
    return undefined;
  }

  return CTR_717_WEIGHT_BANDS.find(
    ({ minimumSpreadCm }) => spreadCm >= minimumSpreadCm,
  )?.maximumWeightKg;
}
