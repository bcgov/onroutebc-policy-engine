import { readFile, writeFile } from 'node:fs/promises';

import {
  BACKEND_EXAMPLE_CONFIG_PATH,
  CANONICAL_CONFIG_PATH,
  GENERATED_CONFIG_PATH,
} from './configPaths.js';

async function main(): Promise<void> {
  const generatedConfig = await readGeneratedConfig();

  await writeFile(CANONICAL_CONFIG_PATH, generatedConfig, 'utf8');
  await writeFile(BACKEND_EXAMPLE_CONFIG_PATH, generatedConfig, 'utf8');

  console.log(
    JSON.stringify(
      {
        sourceFile: GENERATED_CONFIG_PATH,
        writtenFiles: [CANONICAL_CONFIG_PATH, BACKEND_EXAMPLE_CONFIG_PATH],
      },
      null,
      2,
    ),
  );
}

async function readGeneratedConfig(): Promise<string> {
  try {
    return await readFile(GENERATED_CONFIG_PATH, 'utf8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      throw new Error(
        `Generated config not found at ${GENERATED_CONFIG_PATH}. Run npm run scrape:update-json first.`,
      );
    }

    throw error;
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exit(1);
});
