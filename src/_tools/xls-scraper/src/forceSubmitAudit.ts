import type { CoveredStandaloneJeepRow } from './standaloneJeepAudit.js';

interface CoveredStandaloneBoosterRowLike {
  rowNumber: number;
  reason:
    | 'resolved-via-direct-rows'
    | 'blocked-by-missing-direct-path'
    | 'represented-by-missing-boosters';
}

export interface ForceSubmitAuditEntryLike {
  rowNumber: number;
  commodityName: string;
  powerUnitName: string;
  powerUnitId: string | null;
  trailerLabel: string;
  trailerId: string | null;
  reasonTags: string[];
}

export interface CurrentTrailerGroupLike {
  trailers: Map<string, string>;
}

export interface CoveredForceSubmitRow {
  rowNumber: number;
  commodityName: string;
  powerUnitName: string;
  trailerLabel: string;
  reason: 'resolved-via-current-path' | 'blocked-by-missing-direct-path';
}

export function classifyForceSubmitRows({
  commodityEntries,
  currentPowerUnits,
  currentDirectTrailers,
  coveredStandaloneBoosterRows,
  coveredStandaloneJeepRows,
}: {
  commodityEntries: ForceSubmitAuditEntryLike[];
  currentPowerUnits: Map<string, string>;
  currentDirectTrailers: Map<string, CurrentTrailerGroupLike>;
  coveredStandaloneBoosterRows: CoveredStandaloneBoosterRowLike[];
  coveredStandaloneJeepRows: CoveredStandaloneJeepRow[];
}): CoveredForceSubmitRow[] {
  const coveredStandaloneBoosterRowsByNumber = new Map(
    coveredStandaloneBoosterRows.map((entry) => [entry.rowNumber, entry]),
  );
  const coveredStandaloneJeepRowsByNumber = new Map(
    coveredStandaloneJeepRows.map((entry) => [entry.rowNumber, entry]),
  );

  return commodityEntries
    .filter((entry) => entry.reasonTags.includes('force-submit-to-queue'))
    .map((entry) => {
      if (entry.reasonTags.includes('booster-row')) {
        return mapStandaloneReason(
          entry,
          coveredStandaloneBoosterRowsByNumber.get(entry.rowNumber)?.reason,
        );
      }

      if (entry.reasonTags.includes('jeep-row')) {
        return mapStandaloneReason(
          entry,
          coveredStandaloneJeepRowsByNumber.get(entry.rowNumber)?.reason,
        );
      }

      if (!entry.powerUnitId) {
        return null;
      }

      if (!currentPowerUnits.has(entry.powerUnitId)) {
        return {
          rowNumber: entry.rowNumber,
          commodityName: entry.commodityName,
          powerUnitName: entry.powerUnitName,
          trailerLabel: entry.trailerLabel,
          reason: 'blocked-by-missing-direct-path' as const,
        };
      }

      if (!entry.trailerId) {
        return null;
      }

      const currentTrailers =
        currentDirectTrailers.get(entry.powerUnitId)?.trailers ?? new Map();
      if (!currentTrailers.has(entry.trailerId)) {
        return {
          rowNumber: entry.rowNumber,
          commodityName: entry.commodityName,
          powerUnitName: entry.powerUnitName,
          trailerLabel: entry.trailerLabel,
          reason: 'blocked-by-missing-direct-path' as const,
        };
      }

      return {
        rowNumber: entry.rowNumber,
        commodityName: entry.commodityName,
        powerUnitName: entry.powerUnitName,
        trailerLabel: entry.trailerLabel,
        reason: 'resolved-via-current-path' as const,
      };
    })
    .filter((entry): entry is CoveredForceSubmitRow => entry !== null)
    .sort((left, right) => left.rowNumber - right.rowNumber);
}

function mapStandaloneReason(
  entry: ForceSubmitAuditEntryLike,
  reason:
    | CoveredStandaloneBoosterRowLike['reason']
    | CoveredStandaloneJeepRow['reason']
    | undefined,
): CoveredForceSubmitRow | null {
  if (!reason) {
    return null;
  }

  return {
    rowNumber: entry.rowNumber,
    commodityName: entry.commodityName,
    powerUnitName: entry.powerUnitName,
    trailerLabel: entry.trailerLabel,
    reason: reason === 'blocked-by-missing-direct-path'
      ? 'blocked-by-missing-direct-path'
      : 'resolved-via-current-path',
  };
}
