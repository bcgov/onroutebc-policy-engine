const base = require('../shared/jest.base.config.cjs');

module.exports = {
  ...base,
  rootDir: __dirname,
  testMatch: [
    '<rootDir>/trailer-weight-limits.spec.ts',
    '<rootDir>/source-geometry.spec.ts',
    '<rootDir>/trailer-fixture.spec.ts',
  ],
  globalSetup: '<rootDir>/load-trailer-rows.cjs',
  reporters: [
    'default',
    [
      '<rootDir>/../shared/row-summary-reporter.cjs',
      { dataEnvVar: 'POLICY_TRAILER_XLS_TEST_DATA' },
    ],
  ],
};
