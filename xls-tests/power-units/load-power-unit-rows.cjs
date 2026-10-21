// Jest globalSetup for the power unit suite.
// Reads the power unit rows from the workbook before the tests start.
// Put only workbook values here. Never put values from the policy engine here.
const {
  FIRST_DATA_ROW,
  openWorksheet,
  shouldIncludeHiddenRows,
  checkHeaders,
  cellText,
  cellValue,
} = require('../shared/workbook.cjs');

// The worksheet name has two spaces before the dash.
const SHEET_NAME = 'Power Unit  - Weight Dim. Sets';

const EXPECTED_HEADERS = {
  A: 'Commodity Type',
  B: 'Vehicle Type',
  C: 'Axle Unit 1 Type',
  D: 'Legal Max (kg)',
  E: 'Permittable Max (kg)',
  H: 'Axle Unit 2 Type',
  I: 'Legal Max (kg)',
  J: 'Permittable Max (kg)',
};

module.exports = async function loadPowerUnitRows() {
  const includeHidden = shouldIncludeHiddenRows();
  const { file, sheet } = await openWorksheet(SHEET_NAME);
  checkHeaders(sheet, EXPECTED_HEADERS);

  const rows = [];
  let hiddenRowCount = 0;
  for (
    let rowNumber = FIRST_DATA_ROW;
    rowNumber <= sheet.rowCount;
    rowNumber++
  ) {
    const row = sheet.getRow(rowNumber);
    if (row.hidden && !includeHidden) {
      hiddenRowCount++;
      continue;
    }

    // Keep rows that have missing or unknown values.
    // Their tests fail, so the problem is easy to see.
    rows.push({
      row: rowNumber,
      hidden: !!row.hidden,
      commodity: cellText(row, 'A'),
      vehicle: cellText(row, 'B'),
      steer: cellText(row, 'C'),
      drive: cellText(row, 'H'),
      limits: {
        D: cellValue(row, 'D'), // Steer legal
        E: cellValue(row, 'E'), // Steer permittable
        I: cellValue(row, 'I'), // Drive legal
        J: cellValue(row, 'J'), // Drive permittable
      },
    });
  }
  if (rows.length === 0) {
    throw new Error('No spreadsheet rows selected');
  }

  // The test files read the rows from this environment variable.
  // The workbook is read again on each run, so the data is never out of date.
  process.env.POLICY_XLS_TEST_DATA = JSON.stringify({
    file,
    sheet: sheet.name,
    rows,
  });
  console.log(
    `XLS: ${file}\n${sheet.name}!A${FIRST_DATA_ROW}:J${sheet.rowCount}: ${rows.length} included, ${hiddenRowCount} hidden excluded; ${rows.length * 8} boundary cases`,
  );
};
