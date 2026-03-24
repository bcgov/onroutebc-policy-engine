export type BoosterRowAuditStatus =
  | 'resolved_via_trailer_weight_sheet'
  | 'blocked_by_missing_direct_power_unit'
  | 'blocked_by_missing_direct_trailer'
  | 'missing_booster_behavior'
  | 'unmapped_booster_row';

export interface BoosterRowLike {
  rowNumber: number;
  powerUnitId: string | null;
}

export interface PowerUnitWithIdLike {
  powerUnitId: string | null;
}

export interface TrailerWithPowerUnitLike {
  powerUnitId: string | null;
}

export interface BoosterWithPowerUnitLike {
  powerUnitId: string;
}

export interface ClassifiedBoosterRow {
  rowNumber: number;
  powerUnitId: string | null;
  status: BoosterRowAuditStatus;
}

export function classifyBoosterRows({
  boosterRows,
  missingPowerUnits,
  missingDirectTrailers,
  expectedBoosters,
  missingBoosters,
}: {
  boosterRows: BoosterRowLike[];
  missingPowerUnits: PowerUnitWithIdLike[];
  missingDirectTrailers: TrailerWithPowerUnitLike[];
  expectedBoosters: BoosterWithPowerUnitLike[];
  missingBoosters: BoosterWithPowerUnitLike[];
}): ClassifiedBoosterRow[] {
  const missingPowerUnitIds = new Set(
    missingPowerUnits
      .map((entry) => entry.powerUnitId)
      .filter((entry): entry is string => Boolean(entry)),
  );
  const missingDirectTrailerPowerUnitIds = new Set(
    missingDirectTrailers
      .map((entry) => entry.powerUnitId)
      .filter((entry): entry is string => Boolean(entry)),
  );
  const expectedBoostersByPowerUnitId = groupBoostersByPowerUnitId(expectedBoosters);
  const missingBoostersByPowerUnitId = groupBoostersByPowerUnitId(missingBoosters);

  return boosterRows.map((entry) => {
    if (!entry.powerUnitId) {
      return {
        rowNumber: entry.rowNumber,
        powerUnitId: null,
        status: 'unmapped_booster_row',
      };
    }

    if (missingPowerUnitIds.has(entry.powerUnitId)) {
      return {
        rowNumber: entry.rowNumber,
        powerUnitId: entry.powerUnitId,
        status: 'blocked_by_missing_direct_power_unit',
      };
    }

    const missingBoosterEntriesForPowerUnit =
      missingBoostersByPowerUnitId.get(entry.powerUnitId) ?? [];
    if (missingBoosterEntriesForPowerUnit.length > 0) {
      return {
        rowNumber: entry.rowNumber,
        powerUnitId: entry.powerUnitId,
        status: 'missing_booster_behavior',
      };
    }

    const expectedBoosterEntriesForPowerUnit =
      expectedBoostersByPowerUnitId.get(entry.powerUnitId) ?? [];
    if (expectedBoosterEntriesForPowerUnit.length > 0) {
      return {
        rowNumber: entry.rowNumber,
        powerUnitId: entry.powerUnitId,
        status: 'resolved_via_trailer_weight_sheet',
      };
    }

    if (missingDirectTrailerPowerUnitIds.has(entry.powerUnitId)) {
      return {
        rowNumber: entry.rowNumber,
        powerUnitId: entry.powerUnitId,
        status: 'blocked_by_missing_direct_trailer',
      };
    }

    return {
      rowNumber: entry.rowNumber,
      powerUnitId: entry.powerUnitId,
      status: 'unmapped_booster_row',
    };
  });
}

function groupBoostersByPowerUnitId<T extends BoosterWithPowerUnitLike>(
  entries: T[],
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  for (const entry of entries) {
    const existing = grouped.get(entry.powerUnitId) ?? [];
    existing.push(entry);
    grouped.set(entry.powerUnitId, existing);
  }

  return grouped;
}
