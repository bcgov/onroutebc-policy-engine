const base = require('../shared/jest.base.config.cjs');

module.exports = {
  ...base,
  rootDir: __dirname,
  roots: ['<rootDir>', '<rootDir>/../helpers'],
  testMatch: [
    '<rootDir>/../helpers/getPowerUnitCode.helper.spec.ts',
    '<rootDir>/power-unit-weight-limits.spec.ts',
  ],
  globalSetup: '<rootDir>/load-power-unit-rows.cjs',
  reporters: [
    'default',
    [
      '<rootDir>/../shared/row-summary-reporter.cjs',
      { dataEnvVar: 'POLICY_XLS_TEST_DATA' },
    ],
  ],
};
