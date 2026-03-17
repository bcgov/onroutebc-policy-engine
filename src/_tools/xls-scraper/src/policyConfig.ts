import { existsSync, readFileSync } from 'node:fs';

import {
  CANONICAL_CONFIG_PATH,
  GENERATED_CONFIG_PATH,
} from './configPaths.js';

export type CompareConfigMode = 'canonical' | 'generated' | 'prefer-generated';

export interface NamedDefinition {
  id: string;
  name: string;
  category?: string;
}

export interface TrailerEntry {
  type: string;
  booster?: boolean;
  jeep?: boolean;
  weightPermittable?: boolean;
  [key: string]: unknown;
}

export interface PowerUnitEntry {
  type: string;
  trailers: TrailerEntry[];
}

export interface CommodityEntry {
  id: string;
  name: string;
  powerUnits?: PowerUnitEntry[];
}

export interface PolicyConfig {
  vehicleTypes: {
    powerUnitTypes: NamedDefinition[];
    trailerTypes: NamedDefinition[];
  };
  commodities: CommodityEntry[];
}

export function readPolicyConfigSync(configPath: string): PolicyConfig {
  return JSON.parse(readFileSync(configPath, 'utf8')) as PolicyConfig;
}

export function resolveGeneratedPreferredConfigPath(): string {
  return existsSync(GENERATED_CONFIG_PATH)
    ? GENERATED_CONFIG_PATH
    : CANONICAL_CONFIG_PATH;
}

export function resolvePolicyConfigPath(
  mode: CompareConfigMode = 'generated',
): string {
  if (mode === 'canonical') {
    return CANONICAL_CONFIG_PATH;
  }

  if (mode === 'prefer-generated') {
    return resolveGeneratedPreferredConfigPath();
  }

  if (!existsSync(GENERATED_CONFIG_PATH)) {
    throw new Error(
      `Generated config not found: ${GENERATED_CONFIG_PATH}. Run npm run scrape:update-json or use --compare-config=canonical`,
    );
  }

  return GENERATED_CONFIG_PATH;
}
