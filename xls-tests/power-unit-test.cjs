// Runs the power unit workbook tests.
// Extra arguments go to Jest, for example:
//   node xls-tests/power-unit-test.cjs -t "D90"
const path = require('node:path');

process.argv.splice(
  2,
  0,
  '--config',
  path.join(__dirname, 'power-units', 'jest.config.cjs'),
  '--runInBand',
);
require('jest/bin/jest');
