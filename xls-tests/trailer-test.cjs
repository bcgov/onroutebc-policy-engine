// Runs the trailer workbook tests, and the unit tests for the trailer helpers.
// Extra arguments go to Jest, for example:
//   node xls-tests/trailer-test.cjs -t "J42"
const path = require('node:path');

process.argv.splice(
  2,
  0,
  '--config',
  path.join(__dirname, 'trailers', 'jest.config.cjs'),
  '--runInBand',
);
require('jest/bin/jest');
