import path from 'node:path';

import { resolvePackagePath } from './workbook.js';

export const CANONICAL_CONFIG_PATH = path.resolve(
  resolvePackagePath('..', '..'),
  '_test',
  'policy-config',
  '_current-config.json',
);

export const GENERATED_CONFIG_PATH = path.resolve(
  resolvePackagePath('..', '..'),
  '_test',
  'policy-config',
  '_current-config.generated.json',
);

export const BACKEND_EXAMPLE_CONFIG_PATH = path.resolve(
  resolvePackagePath('..', '..'),
  '_examples',
  'usage',
  'node-backend-example',
  'src',
  'config',
  '_current-config.json',
);
