import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  parseAuditEntries,
  type AuditEntry,
} from './commodityWorksheet.js';
import {
  correlateBoosterPlacements,
  type CorrelatedTrailerWeightBoosterGroup,
} from './boosterPlacementCorrelation.js';
import {
  classifyStandaloneJeepRows,
  type CoveredStandaloneJeepRow,
} from './standaloneJeepAudit.js';
import {
  classifyForceSubmitRows,
  type CoveredForceSubmitRow,
} from './forceSubmitAudit.js';
import type {
  CompareConfigMode,
  PolicyConfig,
} from './policyConfig.js';
import {
  readPolicyConfigSync,
  resolvePolicyConfigPath,
} from './policyConfig.js';
import { readWorksheetRowEntries } from './readWorksheet.js';
import {
  COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET,
  TRAILER_WEIGHT_DIM_SETS_SHEET,
} from './sheets.js';
import {
  parseBoosterExpectationEntries,
  type BoosterExpectationEntry,
} from './trailerWeightWorksheet.js';
import { loadWorkbook } from './workbook.js';

export type { CorrelatedTrailerWeightBoosterGroup } from './boosterPlacementCorrelation.js';
export type { CoveredStandaloneJeepRow } from './standaloneJeepAudit.js';
export type { CoveredForceSubmitRow } from './forceSubmitAudit.js';

const BOOSTER_ID = 'BOOSTER';

interface PolicyLike {
  getPermittablePowerUnitTypes(
    permitTypeId: string,
    commodityId: string,
  ): Map<string, string>;
  getNextPermittableVehicles(
    permitTypeId: string,
    commodityId: string,
    currentConfiguration: string[],
  ): Map<string, string>;
}

interface AuditContext {
  compareConfig: CompareConfigMode;
  config: PolicyConfig;
  configPath: string;
  permitType: string;
  policy: PolicyLike;
  commodityEntries: AuditEntry[];
  boosterEntries: BoosterExpectationEntry[];
}

export interface ExpectedPowerUnitGroup {
  commodityName: string;
  powerUnitName: string;
  powerUnitId: string | null;
  rows: number[];
}

export interface ExpectedTrailerGroup {
  commodityName: string;
  powerUnitName: string;
  powerUnitId: string | null;
  trailerLabel: string;
  trailerId: string | null;
  rows: number[];
  reasonTags: string[];
}

export interface ExpectedBoosterGroup {
  commodityName: string;
  powerUnitName: string;
  powerUnitId: string;
  trailerName: string;
  trailerId: string;
  rows: number[];
  reasonTags: string[];
}

export interface CurrentTrailerGroup {
  powerUnitId: string;
  powerUnitName: string;
  trailers: Map<string, string>;
}

export interface CurrentBoosterGroup {
  powerUnitId: string;
  powerUnitName: string;
  trailerId: string;
  trailerName: string;
  nextVehicles: Map<string, string>;
}

export interface ExtraTrailerGroup {
  powerUnitName: string;
  trailerName: string;
}

export interface IgnoredAuditEntry {
  rowNumber: number;
  commodityName: string;
  powerUnitName: string;
  trailerLabel: string;
  reasonTags: string[];
}

export interface CoveredStandaloneBoosterRow {
  rowNumber: number;
  commodityName: string;
  powerUnitName: string;
  reason:
    | 'resolved-via-direct-rows'
    | 'blocked-by-missing-direct-path'
    | 'represented-by-missing-boosters';
}

export interface CommodityAuditResult {
  commodityId: string;
  commodityName: string;
  compareConfig: CompareConfigMode;
  configPath: string;
  permitType: string;
  rowsConsidered: number;
  expectedPowerUnits: ExpectedPowerUnitGroup[];
  currentPowerUnits: Map<string, string>;
  missingPowerUnits: ExpectedPowerUnitGroup[];
  deferredPowerUnits: ExpectedPowerUnitGroup[];
  extraPowerUnits: Array<[string, string]>;
  expectedDirectTrailers: ExpectedTrailerGroup[];
  currentDirectTrailers: Map<string, CurrentTrailerGroup>;
  missingDirectTrailers: ExpectedTrailerGroup[];
  extraDirectTrailers: ExtraTrailerGroup[];
  expectedBoosters: ExpectedBoosterGroup[];
  currentBoosters: CurrentBoosterGroup[];
  missingBoosters: ExpectedBoosterGroup[];
  extraBoosters: ExpectedBoosterGroup[];
  safeTrailerWeightBoosters: CorrelatedTrailerWeightBoosterGroup[];
  ambiguousTrailerWeightBoosters: CorrelatedTrailerWeightBoosterGroup[];
  contradictoryTrailerWeightBoosters: CorrelatedTrailerWeightBoosterGroup[];
  directBoostersWithoutSafePlacement: ExpectedBoosterGroup[];
  unmatchedTrailerWeightBoosters: CorrelatedTrailerWeightBoosterGroup[];
  coveredStandaloneBoosterRows: CoveredStandaloneBoosterRow[];
  coveredStandaloneJeepRows: CoveredStandaloneJeepRow[];
  coveredForceSubmitRows: CoveredForceSubmitRow[];
  ignoredRows: IgnoredAuditEntry[];
}

export interface AuditOptions {
  commodityType: string;
  compareConfig: CompareConfigMode;
  permitType?: string;
}

export interface AllCommodityAuditOptions {
  compareConfig: CompareConfigMode;
  permitType?: string;
}

export async function buildCommodityAuditResult(
  options: AuditOptions,
): Promise<CommodityAuditResult> {
  const context = await createAuditContext({
    compareConfig: options.compareConfig,
    permitType: options.permitType ?? 'STOW',
  });
  return buildCommodityAuditResultFromContext(options.commodityType, context);
}

export async function buildAllCommodityAuditResults(
  options: AllCommodityAuditOptions,
): Promise<CommodityAuditResult[]> {
  const context = await createAuditContext({
    compareConfig: options.compareConfig,
    permitType: options.permitType ?? 'STOW',
  });
  const commodityNames = Array.from(
    new Set(context.commodityEntries.map((entry) => entry.commodityName)),
  ).sort((left, right) => left.localeCompare(right));

  return commodityNames.map((commodityName) =>
    buildCommodityAuditResultFromContext(commodityName, context),
  );
}

async function createAuditContext({
  compareConfig,
  permitType,
}: {
  compareConfig: CompareConfigMode;
  permitType: string;
}): Promise<AuditContext> {
  const workbook = await loadWorkbook();
  const commodityRows = readWorksheetRowEntries(
    workbook,
    COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET,
  );
  const trailerWeightRows = readWorksheetRowEntries(
    workbook,
    TRAILER_WEIGHT_DIM_SETS_SHEET,
  );
  const configPath = resolvePolicyConfigPath(compareConfig);
  const config = readPolicyConfigSync(configPath);

  return {
    compareConfig,
    config,
    configPath,
    permitType,
    policy: await loadPolicy(configPath),
    commodityEntries: parseAuditEntries(commodityRows, config),
    boosterEntries: parseBoosterExpectationEntries(trailerWeightRows, config),
  };
}

function buildCommodityAuditResultFromContext(
  commodityType: string,
  context: AuditContext,
): CommodityAuditResult {
  const commodityEntries = context.commodityEntries.filter(
    (entry) => entry.commodityName.toLowerCase() === commodityType.toLowerCase(),
  );

  if (commodityEntries.length === 0) {
    throw new Error(`No XLS rows found for commodity type '${commodityType}'`);
  }

  const commodityName = commodityEntries[0]?.commodityName ?? commodityType;
  const commodityId = commodityEntries.find((entry) => entry.commodityId)?.commodityId;

  if (!commodityId) {
    throw new Error(`Unable to map commodity type '${commodityType}' to a config id`);
  }

  const directPowerEntries = commodityEntries.filter(isDirectPowerEntry);
  const directTrailerEntries = commodityEntries.filter(isDirectTrailerEntry);
  const expectedPowerUnits = buildExpectedPowerUnits(directPowerEntries);
  const currentPowerUnits = context.policy.getPermittablePowerUnitTypes(
    context.permitType,
    commodityId,
  );
  const currentPowerUnitIds = new Set(currentPowerUnits.keys());
  const deferredPowerUnits: ExpectedPowerUnitGroup[] = [];
  const missingPowerUnits = expectedPowerUnits
    .filter((entry) => entry.powerUnitId && !currentPowerUnitIds.has(entry.powerUnitId))
    .sort((left, right) => left.rows[0]! - right.rows[0]!);
  const expectedPowerUnitIds = new Set(
    expectedPowerUnits
      .map((entry) => entry.powerUnitId)
      .filter((entry): entry is string => Boolean(entry)),
  );
  const extraPowerUnits = Array.from(currentPowerUnits.entries())
    .filter(([powerUnitId]) => !expectedPowerUnitIds.has(powerUnitId))
    .sort((left, right) => left[1].localeCompare(right[1]));
  const currentDirectTrailers = buildCurrentTrailersByPowerUnit(
    context.policy,
    context.permitType,
    commodityId,
    currentPowerUnits,
  );
  const expectedDirectTrailers = buildExpectedTrailers(directTrailerEntries);
  const comparablePowerUnitIds = new Set(
    Array.from(expectedPowerUnitIds).filter((powerUnitId) =>
      currentPowerUnitIds.has(powerUnitId),
    ),
  );
  const missingDirectTrailers = buildMissingTrailers(
    expectedDirectTrailers,
    currentDirectTrailers,
    comparablePowerUnitIds,
  );
  const extraDirectTrailers = buildExtraTrailers(
    expectedDirectTrailers,
    currentDirectTrailers,
    comparablePowerUnitIds,
  );
  const expectedBoosters = buildExpectedBoosters(
    directTrailerEntries.filter((entry) => entry.canAddBooster),
  );
  const currentBoosters = buildCurrentBoosters(
    context.policy,
    context.permitType,
    commodityId,
    currentDirectTrailers,
  );
  const comparableBoosterKeys = new Set(
    expectedBoosters
      .filter((entry) =>
        currentDirectTrailers.get(entry.powerUnitId)?.trailers.has(entry.trailerId),
      )
      .map((entry) => buildBoosterKey(entry.powerUnitId, entry.trailerId)),
  );
  const missingBoosters = expectedBoosters
    .filter((entry) =>
      comparableBoosterKeys.has(buildBoosterKey(entry.powerUnitId, entry.trailerId)),
    )
    .filter((entry) => {
      const current = currentBoosters.find(
        (group) =>
          group.powerUnitId === entry.powerUnitId && group.trailerId === entry.trailerId,
      );
      return !current?.nextVehicles.has(BOOSTER_ID);
    });
  const extraBoosters = currentBoosters
    .filter((group) => group.nextVehicles.has(BOOSTER_ID))
    .filter(
      (group) =>
        !expectedBoosters.some(
          (entry) =>
            entry.powerUnitId === group.powerUnitId &&
            entry.trailerId === group.trailerId,
        ),
    )
    .map((group) => ({
      commodityName,
      powerUnitName: group.powerUnitName,
      powerUnitId: group.powerUnitId,
      trailerName: group.trailerName,
      trailerId: group.trailerId,
      rows: [],
      reasonTags: [],
    }))
    .sort((left, right) => {
      const powerUnitCompare = left.powerUnitName.localeCompare(right.powerUnitName);
      if (powerUnitCompare !== 0) {
        return powerUnitCompare;
      }

      return left.trailerName.localeCompare(right.trailerName);
    });
  const trailerWeightCorrelation = correlateBoosterPlacements({
    commodityName,
    directTrailerEntries,
    trailerWeightEntries: context.boosterEntries.filter(
      (entry) => entry.commodityId === commodityId,
    ),
  });
  const directBoostersWithoutSafePlacement = expectedBoosters.filter(
    (entry) => !trailerWeightCorrelation.safeTrailerIds.has(entry.trailerId),
  );
  const coveredStandaloneBoosterRows = buildCoveredStandaloneBoosterRows({
    commodityEntries,
    expectedBoosters,
    currentPowerUnits,
    currentDirectTrailers,
    missingBoosters,
  });
  const coveredStandaloneBoosterRowNumbers = new Set(
    coveredStandaloneBoosterRows.map((entry) => entry.rowNumber),
  );
  const coveredStandaloneJeepRows = classifyStandaloneJeepRows({
    commodityEntries,
    currentPowerUnits,
    currentDirectTrailers,
  });
  const coveredForceSubmitRows = classifyForceSubmitRows({
    commodityEntries,
    currentPowerUnits,
    currentDirectTrailers,
    coveredStandaloneBoosterRows,
    coveredStandaloneJeepRows,
  });
  const coveredStandaloneJeepRowsByNumber = new Map(
    coveredStandaloneJeepRows.map((entry) => [entry.rowNumber, entry]),
  );
  const coveredForceSubmitRowsByNumber = new Map(
    coveredForceSubmitRows.map((entry) => [entry.rowNumber, entry]),
  );
  const ignoredRows = commodityEntries
    .map((entry) => ({
      rowNumber: entry.rowNumber,
      commodityName: entry.commodityName,
      powerUnitName: entry.powerUnitName,
      trailerLabel: entry.trailerLabel,
      reasonTags: filterIgnoredReasonTags(
        entry.reasonTags,
        coveredStandaloneJeepRowsByNumber.has(entry.rowNumber),
        coveredForceSubmitRowsByNumber.has(entry.rowNumber),
      ),
    }))
    .filter((entry) => entry.reasonTags.length > 0)
    .filter(
      (entry) =>
        !(
          entry.reasonTags.includes('booster-row') &&
          coveredStandaloneBoosterRowNumbers.has(entry.rowNumber)
        ),
    )
    .sort((left, right) => left.rowNumber - right.rowNumber);

  return {
    commodityId,
    commodityName,
    compareConfig: context.compareConfig,
    configPath: context.configPath,
    permitType: context.permitType,
    rowsConsidered: commodityEntries.length,
    expectedPowerUnits,
    currentPowerUnits,
    missingPowerUnits,
    deferredPowerUnits,
    extraPowerUnits,
    expectedDirectTrailers,
    currentDirectTrailers,
    missingDirectTrailers,
    extraDirectTrailers,
    expectedBoosters,
    currentBoosters,
    missingBoosters,
    extraBoosters,
    safeTrailerWeightBoosters: trailerWeightCorrelation.safeGroups,
    ambiguousTrailerWeightBoosters: trailerWeightCorrelation.ambiguousGroups,
    contradictoryTrailerWeightBoosters: trailerWeightCorrelation.contradictoryGroups,
    directBoostersWithoutSafePlacement,
    unmatchedTrailerWeightBoosters: trailerWeightCorrelation.unmatchedGroups,
    coveredStandaloneBoosterRows,
    coveredStandaloneJeepRows,
    coveredForceSubmitRows,
    ignoredRows,
  };
}

async function loadPolicy(
  configPath: string,
): Promise<PolicyLike> {
  const policyModuleUrl = pathToFileURL(
    path.resolve(process.cwd(), '..', '..', 'index.ts'),
  ).href;
  const importedModule = await import(policyModuleUrl);
  const policyModule = (importedModule.default ?? importedModule) as {
    Policy: new (definition: unknown, authorizations?: unknown) => PolicyLike;
  };
  // Audit comparisons opt into LCV so XLS-backed LCV rows are checked against
  // the authorized policy surface rather than reported as false-positive gaps.
  return new policyModule.Policy(
    readPolicyConfigSync(configPath),
    { companyId: -1, isLcvAllowed: true, noFeeType: null },
  );
}

function buildExpectedPowerUnits(entries: AuditEntry[]): ExpectedPowerUnitGroup[] {
  const grouped = new Map<string, ExpectedPowerUnitGroup>();

  for (const entry of entries) {
    const key = `${entry.commodityName}:${entry.powerUnitName}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.rows.push(entry.rowNumber);
      continue;
    }

    grouped.set(key, {
      commodityName: entry.commodityName,
      powerUnitName: entry.powerUnitName,
      powerUnitId: entry.powerUnitId,
      rows: [entry.rowNumber],
    });
  }

  return Array.from(grouped.values()).sort(
    (left, right) => left.rows[0]! - right.rows[0]!,
  );
}

function buildExpectedTrailers(entries: AuditEntry[]): ExpectedTrailerGroup[] {
  const grouped = new Map<string, ExpectedTrailerGroup>();

  for (const entry of entries) {
    const key = `${entry.commodityName}:${entry.powerUnitName}:${entry.trailerLabel}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.rows.push(entry.rowNumber);
      existing.reasonTags = mergeTags(existing.reasonTags, entry.reasonTags);
      continue;
    }

    grouped.set(key, {
      commodityName: entry.commodityName,
      powerUnitName: entry.powerUnitName,
      powerUnitId: entry.powerUnitId,
      trailerLabel: entry.trailerLabel,
      trailerId: entry.trailerId,
      rows: [entry.rowNumber],
      reasonTags: [...entry.reasonTags],
    });
  }

  return Array.from(grouped.values()).sort(
    (left, right) => left.rows[0]! - right.rows[0]!,
  );
}

function buildExpectedBoosters(entries: AuditEntry[]): ExpectedBoosterGroup[] {
  const grouped = new Map<string, ExpectedBoosterGroup>();

  for (const entry of entries) {
    if (!entry.powerUnitId || !entry.trailerId) {
      continue;
    }

    const key = buildBoosterKey(entry.powerUnitId, entry.trailerId);
    const existing = grouped.get(key);

    if (existing) {
      existing.rows.push(entry.rowNumber);
      existing.reasonTags = mergeTags(existing.reasonTags, entry.reasonTags);
      continue;
    }

    grouped.set(key, {
      commodityName: entry.commodityName,
      powerUnitName: entry.powerUnitName,
      powerUnitId: entry.powerUnitId,
      trailerName: entry.trailerLabel,
      trailerId: entry.trailerId,
      rows: [entry.rowNumber],
      reasonTags: [...entry.reasonTags],
    });
  }

  return Array.from(grouped.values()).sort((left, right) => {
    const powerUnitCompare = left.powerUnitName.localeCompare(right.powerUnitName);
    if (powerUnitCompare !== 0) {
      return powerUnitCompare;
    }

    return left.trailerName.localeCompare(right.trailerName);
  });
}

function buildCurrentTrailersByPowerUnit(
  policy: PolicyLike,
  permitType: string,
  commodityId: string,
  currentPowerUnits: Map<string, string>,
): Map<string, CurrentTrailerGroup> {
  const trailersByPowerUnit = new Map<string, CurrentTrailerGroup>();

  for (const [powerUnitId, powerUnitName] of currentPowerUnits.entries()) {
    trailersByPowerUnit.set(powerUnitId, {
      powerUnitId,
      powerUnitName,
      trailers: policy.getNextPermittableVehicles(permitType, commodityId, [powerUnitId]),
    });
  }

  return trailersByPowerUnit;
}

function buildCurrentBoosters(
  policy: PolicyLike,
  permitType: string,
  commodityId: string,
  currentTrailersByPowerUnit: Map<string, CurrentTrailerGroup>,
): CurrentBoosterGroup[] {
  const groups: CurrentBoosterGroup[] = [];

  for (const [powerUnitId, currentGroup] of currentTrailersByPowerUnit.entries()) {
    for (const [trailerId, trailerName] of currentGroup.trailers.entries()) {
      groups.push({
        powerUnitId,
        powerUnitName: currentGroup.powerUnitName,
        trailerId,
        trailerName,
        nextVehicles: policy.getNextPermittableVehicles(permitType, commodityId, [
          powerUnitId,
          trailerId,
        ]),
      });
    }
  }

  return groups;
}

function buildMissingTrailers(
  expectedTrailers: ExpectedTrailerGroup[],
  currentTrailersByPowerUnit: Map<string, CurrentTrailerGroup>,
  comparablePowerUnitIds: Set<string>,
): ExpectedTrailerGroup[] {
  return expectedTrailers
    .filter((entry) => entry.powerUnitId && comparablePowerUnitIds.has(entry.powerUnitId))
    .filter((entry) => entry.trailerId)
    .filter((entry) => {
      const current = currentTrailersByPowerUnit.get(entry.powerUnitId as string);
      return !current?.trailers.has(entry.trailerId as string);
    })
    .sort((left, right) => left.rows[0]! - right.rows[0]!);
}

function buildExtraTrailers(
  expectedTrailers: ExpectedTrailerGroup[],
  currentTrailersByPowerUnit: Map<string, CurrentTrailerGroup>,
  comparablePowerUnitIds: Set<string>,
): ExtraTrailerGroup[] {
  const expectedTrailerIdsByPowerUnit = new Map<string, Set<string>>();

  for (const entry of expectedTrailers) {
    if (!entry.powerUnitId || !entry.trailerId || !comparablePowerUnitIds.has(entry.powerUnitId)) {
      continue;
    }

    const existing = expectedTrailerIdsByPowerUnit.get(entry.powerUnitId) ?? new Set<string>();
    existing.add(entry.trailerId);
    expectedTrailerIdsByPowerUnit.set(entry.powerUnitId, existing);
  }

  const extras: ExtraTrailerGroup[] = [];

  for (const [powerUnitId, current] of currentTrailersByPowerUnit.entries()) {
    if (!comparablePowerUnitIds.has(powerUnitId)) {
      continue;
    }

    const expectedIds = expectedTrailerIdsByPowerUnit.get(powerUnitId) ?? new Set<string>();

    for (const [trailerId, trailerName] of current.trailers.entries()) {
      if (!expectedIds.has(trailerId)) {
        extras.push({
          powerUnitName: current.powerUnitName,
          trailerName,
        });
      }
    }
  }

  return extras.sort((left, right) => {
    const powerUnitCompare = left.powerUnitName.localeCompare(right.powerUnitName);
    if (powerUnitCompare !== 0) {
      return powerUnitCompare;
    }

    return left.trailerName.localeCompare(right.trailerName);
  });
}

function buildBoosterKey(powerUnitId: string, trailerId: string): string {
  return `${powerUnitId}:${trailerId}`;
}

function buildCoveredStandaloneBoosterRows({
  commodityEntries,
  expectedBoosters,
  currentPowerUnits,
  currentDirectTrailers,
  missingBoosters,
}: {
  commodityEntries: AuditEntry[];
  expectedBoosters: ExpectedBoosterGroup[];
  currentPowerUnits: Map<string, string>;
  currentDirectTrailers: Map<string, CurrentTrailerGroup>;
  missingBoosters: ExpectedBoosterGroup[];
}): CoveredStandaloneBoosterRow[] {
  return commodityEntries
    .filter((entry) => entry.reasonTags.includes('booster-row'))
    .filter((entry) => entry.powerUnitId)
    .map((entry) => {
      const matchingExpectedBoosters = expectedBoosters.filter(
        (booster) => booster.powerUnitId === entry.powerUnitId,
      );

      if (matchingExpectedBoosters.length === 0) {
        return null;
      }

      if (!currentPowerUnits.has(entry.powerUnitId as string)) {
        return {
          rowNumber: entry.rowNumber,
          commodityName: entry.commodityName,
          powerUnitName: entry.powerUnitName,
          reason: 'blocked-by-missing-direct-path' as const,
        };
      }

      const currentTrailers =
        currentDirectTrailers.get(entry.powerUnitId as string)?.trailers ?? new Map();
      const hasMissingBooster = matchingExpectedBoosters.some((booster) =>
        missingBoosters.some(
          (missing) =>
            missing.powerUnitId === booster.powerUnitId &&
            missing.trailerId === booster.trailerId,
        ),
      );

      if (hasMissingBooster) {
        return {
          rowNumber: entry.rowNumber,
          commodityName: entry.commodityName,
          powerUnitName: entry.powerUnitName,
          reason: 'represented-by-missing-boosters' as const,
        };
      }

      const hasMissingDirectTrailer = matchingExpectedBoosters.some(
        (booster) => !currentTrailers.has(booster.trailerId),
      );

      return {
        rowNumber: entry.rowNumber,
        commodityName: entry.commodityName,
        powerUnitName: entry.powerUnitName,
        reason: hasMissingDirectTrailer
          ? 'blocked-by-missing-direct-path'
          : 'resolved-via-direct-rows',
      };
    })
    .filter(
      (entry): entry is CoveredStandaloneBoosterRow => entry !== null,
    )
    .sort((left, right) => left.rowNumber - right.rowNumber);
}

function isDirectPowerEntry(entry: AuditEntry): boolean {
  return !entry.reasonTags.includes('jeep-row') && !entry.reasonTags.includes('booster-row');
}

function isDirectTrailerEntry(entry: AuditEntry): boolean {
  return (
    !entry.reasonTags.includes('jeep-row') &&
    !entry.reasonTags.includes('booster-row') &&
    entry.canCompareTrailer
  );
}

function filterIgnoredReasonTags(
  reasonTags: string[],
  suppressStandaloneJeepTags: boolean,
  suppressForceSubmitTag: boolean,
): string[] {
  if (!suppressStandaloneJeepTags && !suppressForceSubmitTag) {
    return reasonTags;
  }

  return reasonTags.filter(
    (tag) =>
      !(suppressStandaloneJeepTags && (tag === 'jeep-row' || tag === 'missing-trailer-mapping')) &&
      !(suppressForceSubmitTag && tag === 'force-submit-to-queue'),
  );
}

function mergeTags(existing: string[], next: string[]): string[] {
  return Array.from(new Set([...existing, ...next])).sort();
}
