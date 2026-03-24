import type { AuditEntry } from './commodityWorksheet.js';
import type { BoosterExpectationEntry } from './trailerWeightWorksheet.js';

export interface CorrelatedTrailerWeightBoosterGroup {
  commodityName: string;
  trailerName: string;
  trailerId: string | null;
  rows: number[];
  reasonTags: string[];
  directRows: string[];
}

export interface BoosterPlacementCorrelationResult {
  safeGroups: CorrelatedTrailerWeightBoosterGroup[];
  ambiguousGroups: CorrelatedTrailerWeightBoosterGroup[];
  contradictoryGroups: CorrelatedTrailerWeightBoosterGroup[];
  unmatchedGroups: CorrelatedTrailerWeightBoosterGroup[];
  safeTrailerIds: Set<string>;
}

export function correlateBoosterPlacements({
  commodityName,
  directTrailerEntries,
  trailerWeightEntries,
}: {
  commodityName: string;
  directTrailerEntries: AuditEntry[];
  trailerWeightEntries: BoosterExpectationEntry[];
}): BoosterPlacementCorrelationResult {
  const groupedDirectEntries = new Map<string, AuditEntry[]>();

  for (const entry of directTrailerEntries) {
    if (!entry.trailerId) {
      continue;
    }

    const key = buildTrailerKey(entry.trailerId);
    const existing = groupedDirectEntries.get(key) ?? [];
    existing.push(entry);
    groupedDirectEntries.set(key, existing);
  }

  const groupedTrailerWeightEntries = new Map<string, BoosterExpectationEntry[]>();

  for (const entry of trailerWeightEntries) {
    const key = entry.trailerId
      ? buildTrailerKey(entry.trailerId)
      : buildUnmappedTrailerKey(entry.trailerName);
    const existing = groupedTrailerWeightEntries.get(key) ?? [];
    existing.push(entry);
    groupedTrailerWeightEntries.set(key, existing);
  }

  const safeGroups: CorrelatedTrailerWeightBoosterGroup[] = [];
  const ambiguousGroups: CorrelatedTrailerWeightBoosterGroup[] = [];
  const contradictoryGroups: CorrelatedTrailerWeightBoosterGroup[] = [];
  const unmatchedGroups: CorrelatedTrailerWeightBoosterGroup[] = [];
  const safeTrailerIds = new Set<string>();

  for (const [key, entries] of Array.from(groupedTrailerWeightEntries.entries()).sort()) {
    const baseGroup = buildCorrelatedGroup(commodityName, entries, []);

    if (!entries[0]?.trailerId) {
      unmatchedGroups.push(baseGroup);
      continue;
    }

    const matchingDirectEntries = groupedDirectEntries.get(key) ?? [];

    if (matchingDirectEntries.length === 0) {
      unmatchedGroups.push(baseGroup);
      continue;
    }

    const enrichedGroup = buildCorrelatedGroup(
      commodityName,
      entries,
      matchingDirectEntries,
    );
    const canAddBoosterFlags = new Set(
      matchingDirectEntries.map((entry) => entry.canAddBooster),
    );

    if (canAddBoosterFlags.size === 1 && canAddBoosterFlags.has(true)) {
      safeGroups.push(enrichedGroup);
      safeTrailerIds.add(entries[0].trailerId as string);
      continue;
    }

    if (canAddBoosterFlags.size === 1 && canAddBoosterFlags.has(false)) {
      contradictoryGroups.push(enrichedGroup);
      continue;
    }

    ambiguousGroups.push(enrichedGroup);
  }

  return {
    safeGroups: sortGroups(safeGroups),
    ambiguousGroups: sortGroups(ambiguousGroups),
    contradictoryGroups: sortGroups(contradictoryGroups),
    unmatchedGroups: sortGroups(unmatchedGroups),
    safeTrailerIds,
  };
}

function buildCorrelatedGroup(
  commodityName: string,
  trailerWeightEntries: BoosterExpectationEntry[],
  directEntries: AuditEntry[],
): CorrelatedTrailerWeightBoosterGroup {
  return {
    commodityName,
    trailerName: trailerWeightEntries[0]?.trailerName ?? '(unknown trailer)',
    trailerId: trailerWeightEntries[0]?.trailerId ?? null,
    rows: trailerWeightEntries.map((entry) => entry.rowNumber),
    reasonTags: Array.from(
      new Set(trailerWeightEntries.flatMap((entry) => entry.reasonTags)),
    ).sort(),
    directRows: directEntries
      .map(
        (entry) =>
          `${entry.rowNumber}:${entry.powerUnitName}:${entry.canAddBooster ? 'Y' : 'N'}`,
      )
      .sort(),
  };
}

function sortGroups(
  groups: CorrelatedTrailerWeightBoosterGroup[],
): CorrelatedTrailerWeightBoosterGroup[] {
  return groups.sort((left, right) => {
    const trailerCompare = left.trailerName.localeCompare(right.trailerName);
    if (trailerCompare !== 0) {
      return trailerCompare;
    }

    return (left.rows[0] ?? 0) - (right.rows[0] ?? 0);
  });
}

function buildTrailerKey(trailerId: string): string {
  return `id:${trailerId}`;
}

function buildUnmappedTrailerKey(trailerName: string): string {
  return `name:${trailerName}`;
}
