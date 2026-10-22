// Jest settings that the power unit and trailer suites share.
const path = require('node:path');

const engineRoot = path.resolve(__dirname, '..', '..');

module.exports = {
  testEnvironment: 'node',
  verbose: false,
  // The engine source imports itself as "onroute-policy-engine/...".
  // Point those imports at src/, not at the built dist/ folder.
  moduleNameMapper: {
    '^onroute-policy-engine$': `${engineRoot}/src/index.ts`,
    '^onroute-policy-engine/(.*)$': `${engineRoot}/src/$1`,
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // The policy engine tsconfig.json only allows files in src/,
        // so these tests use their own compiler options.
        tsconfig: {
          target: 'es2019',
          module: 'commonjs',
          esModuleInterop: true,
          resolveJsonModule: true,
          isolatedModules: true,
          strict: true,
          types: ['jest', 'node'],
          baseUrl: engineRoot,
          paths: {
            'onroute-policy-engine': ['src/index.ts'],
            'onroute-policy-engine/*': ['src/*'],
          },
        },
      },
    ],
  },
};
