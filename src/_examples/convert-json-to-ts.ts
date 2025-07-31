// Converts the _current-config.json to a TypeScript file of type
// PolicyDefinition to validate the .json against the actual type
// to catch errors.
import fs from 'fs';
import path from 'path';

const jsonPath = path.resolve(
  __dirname,
  '../_test/policy-config/_current-config.json',
);
const tsPath = path.resolve(
  __dirname,
  '../_test/policy-config/_current-config.ts',
);

const raw = fs.readFileSync(jsonPath, 'utf-8');

// Wrap the JSON in a TypeScript export
const tsContent = `import { PolicyDefinition } from "onroute-policy-engine/types";\n\nexport const data: PolicyDefinition = ${raw}`;

fs.writeFileSync(tsPath, tsContent);

console.log('Converted JSON to TypeScript module');
