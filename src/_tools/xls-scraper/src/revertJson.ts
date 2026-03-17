import { readFile, writeFile } from 'node:fs/promises';

import {
  BACKEND_EXAMPLE_CONFIG_PATH,
  CANONICAL_CONFIG_PATH,
  GENERATED_CONFIG_PATH,
} from './configPaths.js';

async function main(): Promise<void> {
  await ensureExistingConfigFiles([
    CANONICAL_CONFIG_PATH,
    BACKEND_EXAMPLE_CONFIG_PATH,
  ]);

  const canonicalConfig = await readFile(CANONICAL_CONFIG_PATH, 'utf8');

  await writeFile(GENERATED_CONFIG_PATH, canonicalConfig, 'utf8');
  await writeFile(BACKEND_EXAMPLE_CONFIG_PATH, canonicalConfig, 'utf8');

  console.log(
    JSON.stringify(
      {
        sourceFile: CANONICAL_CONFIG_PATH,
        writtenFiles: [GENERATED_CONFIG_PATH, BACKEND_EXAMPLE_CONFIG_PATH],
      },
      null,
      2,
    ),
  );
}

async function ensureExistingConfigFiles(paths: string[]): Promise<void> {
  await Promise.all(
    paths.map(async (filePath) => {
      try {
        await readFile(filePath, 'utf8');
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
          throw new Error(`Required config file not found at ${filePath}`);
        }

        throw error;
      }
    }),
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exit(1);
});
