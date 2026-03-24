export interface StandaloneJeepAuditEntryLike {
  rowNumber: number;
  commodityName: string;
  powerUnitName: string;
  powerUnitId: string | null;
  reasonTags: string[];
}

export interface CurrentTrailerGroupLike {
  trailers: Map<string, string>;
}

export interface CoveredStandaloneJeepRow {
  rowNumber: number;
  commodityName: string;
  powerUnitName: string;
  reason: 'resolved-via-current-jeep-option' | 'blocked-by-missing-direct-path';
}

export function classifyStandaloneJeepRows({
  commodityEntries,
  currentPowerUnits,
  currentDirectTrailers,
}: {
  commodityEntries: StandaloneJeepAuditEntryLike[];
  currentPowerUnits: Map<string, string>;
  currentDirectTrailers: Map<string, CurrentTrailerGroupLike>;
}): CoveredStandaloneJeepRow[] {
  return commodityEntries
    .filter((entry) => entry.reasonTags.includes('jeep-row'))
    .filter((entry) => entry.powerUnitId)
    .map((entry) => {
      const powerUnitId = entry.powerUnitId as string;

      if (!currentPowerUnits.has(powerUnitId)) {
        return {
          rowNumber: entry.rowNumber,
          commodityName: entry.commodityName,
          powerUnitName: entry.powerUnitName,
          reason: 'blocked-by-missing-direct-path' as const,
        };
      }

      const currentTrailers = currentDirectTrailers.get(powerUnitId)?.trailers ?? new Map();
      if (!currentTrailers.has('JEEPSRG')) {
        return null;
      }

      return {
        rowNumber: entry.rowNumber,
        commodityName: entry.commodityName,
        powerUnitName: entry.powerUnitName,
        reason: 'resolved-via-current-jeep-option' as const,
      };
    })
    .filter(
      (entry): entry is CoveredStandaloneJeepRow => entry !== null,
    )
    .sort((left, right) => left.rowNumber - right.rowNumber);
}
