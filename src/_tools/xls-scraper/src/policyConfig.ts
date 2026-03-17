import { existsSync, readFileSync } from 'node:fs';

import {
  CANONICAL_CONFIG_PATH,
  GENERATED_CONFIG_PATH,
} from './configPaths.js';

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
