import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  parseAuditEntries,
  type AuditEntry,
} from './commodityWorksheet.js';
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
import {
  classifyBoosterRows,
} from './boosterRowAudit.js';
import { loadWorkbook } from './workbook.js';

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
  sourceBoosterRows: number[];
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
  const boosterRowEntries = commodityEntries.filter((entry) =>
    entry.reasonTags.includes('booster-row'),
  );
  const expectedBoosters = buildExpectedBoosters(
    commodityName,
    commodityId,
    currentDirectTrailers,
    context.boosterEntries,
    groupBoosterSourceRowsByPowerUnit(boosterRowEntries),
  );
  const currentBoosters = buildCurrentBoosters(
    context.policy,
    context.permitType,
    commodityId,
    expectedBoosters,
  );
  const missingBoosters = expectedBoosters.filter((entry) => {
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
      sourceBoosterRows: [],
      reasonTags: [],
    }))
    .sort((left, right) => {
      const powerUnitCompare = left.powerUnitName.localeCompare(right.powerUnitName);
      if (powerUnitCompare !== 0) {
        return powerUnitCompare;
      }

      return left.trailerName.localeCompare(right.trailerName);
    });
  const classifiedBoosterRows = classifyBoosterRows({
    boosterRows: boosterRowEntries,
    missingPowerUnits,
    missingDirectTrailers,
    expectedBoosters,
    missingBoosters,
  });
  const boosterRowStatusByRowNumber = new Map(
    classifiedBoosterRows.map((entry) => [entry.rowNumber, entry.status]),
  );
  const ignoredRows = commodityEntries
    .flatMap((entry) => {
      if (!isIgnoredAuditEntry(entry)) {
        return [];
      }

      const boosterRowStatus = boosterRowStatusByRowNumber.get(entry.rowNumber);
      if (boosterRowStatus && boosterRowStatus !== 'unmapped_booster_row') {
        return [];
      }

      const reasonTags = filterIgnoredReasonTags(entry.reasonTags);
      if (reasonTags.length === 0) {
        return [];
      }

      return [{
        rowNumber: entry.rowNumber,
        commodityName: entry.commodityName,
        powerUnitName: entry.powerUnitName,
        trailerLabel: entry.trailerLabel,
        reasonTags,
      }];
    })
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

function buildExpectedBoosters(
  commodityName: string,
  commodityId: string,
  currentTrailersByPowerUnit: Map<string, CurrentTrailerGroup>,
  boosterEntries: BoosterExpectationEntry[],
  boosterSourceRowsByPowerUnit: Map<string, number[]>,
): ExpectedBoosterGroup[] {
  const groupedEntries = groupBoosterEntries(
    boosterEntries.filter((entry) => entry.commodityId === commodityId),
  );
  const expectedBoosters: ExpectedBoosterGroup[] = [];

  for (const [powerUnitId, currentGroup] of currentTrailersByPowerUnit.entries()) {
    for (const [trailerId, trailerName] of currentGroup.trailers.entries()) {
      const groupedEntry = groupedEntries.get(trailerId);
      if (!groupedEntry) {
        continue;
      }

      expectedBoosters.push({
        commodityName,
        powerUnitName: currentGroup.powerUnitName,
        powerUnitId,
        trailerName,
        trailerId,
        rows: groupedEntry.rows,
        sourceBoosterRows: boosterSourceRowsByPowerUnit.get(powerUnitId) ?? [],
        reasonTags: groupedEntry.reasonTags,
      });
    }
  }

  return expectedBoosters.sort((left, right) => {
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
  expectedBoosters: ExpectedBoosterGroup[],
): CurrentBoosterGroup[] {
  return expectedBoosters.map((entry) => ({
    powerUnitId: entry.powerUnitId,
    powerUnitName: entry.powerUnitName,
    trailerId: entry.trailerId,
    trailerName: entry.trailerName,
    nextVehicles: policy.getNextPermittableVehicles(permitType, commodityId, [
      entry.powerUnitId,
      entry.trailerId,
    ]),
  }));
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

function groupBoosterEntries(
  entries: BoosterExpectationEntry[],
): Map<string, { rows: number[]; reasonTags: string[] }> {
  const grouped = new Map<string, { rows: number[]; reasonTags: string[] }>();

  for (const entry of entries) {
    if (!entry.trailerId) {
      continue;
    }

    const existing = grouped.get(entry.trailerId);
    if (existing) {
      existing.rows.push(entry.rowNumber);
      existing.reasonTags = mergeTags(existing.reasonTags, entry.reasonTags);
      continue;
    }

    grouped.set(entry.trailerId, {
      rows: [entry.rowNumber],
      reasonTags: [...entry.reasonTags],
    });
  }

  return grouped;
}

function groupBoosterSourceRowsByPowerUnit(
  entries: AuditEntry[],
): Map<string, number[]> {
  const grouped = new Map<string, number[]>();

  for (const entry of entries) {
    if (!entry.powerUnitId) {
      continue;
    }

    const existing = grouped.get(entry.powerUnitId) ?? [];
    existing.push(entry.rowNumber);
    grouped.set(entry.powerUnitId, existing);
  }

  return grouped;
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

function isIgnoredAuditEntry(entry: AuditEntry): boolean {
  return filterIgnoredReasonTags(entry.reasonTags).length > 0;
}

function filterIgnoredReasonTags(reasonTags: string[]): string[] {
  return reasonTags;
}

function mergeTags(existing: string[], next: string[]): string[] {
  return Array.from(new Set([...existing, ...next])).sort();
}
