const { jest: baseJestConfig } = require('./package.json');

module.exports = {
  ...baseJestConfig,
  rootDir: __dirname,
  moduleNameMapper: {
    ...baseJestConfig.moduleNameMapper,
    '^\\.\\./policy-config/_current-config\\.json$':
      '<rootDir>/src/_test/policy-config/_current-config.generated.json',
  },
};
