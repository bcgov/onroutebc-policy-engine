// Jest globalSetup for the trailer suite.
// Reads the trailer rows from the workbook before the tests start.
// Put only workbook values here. Never put values from the policy engine here.
// Missing geometry stays missing. Do not fill in default values.
const {
  FIRST_DATA_ROW,
  openWorksheet,
  shouldIncludeHiddenRows,
  checkHeaders,
  findColumnByHeader,
  cellText,
  cellValue,
} = require('../shared/workbook.cjs');

const SHEET_NAME = 'Trailer - Weight Dim. Sets';

const EXPECTED_HEADERS = {
  B: 'Commodity Type',
  C: 'Trailer Category',
  D: 'Trailer Type',
  E: 'Trailer Axle Unit Type',
  F: 'Trailer Type Before',
  G: 'Trailer Type After',
  H: 'Power Unit/Trailer Category',
  I: 'Power Unit Drive/Trailer Axle Unit Type',
  // Older workbooks use the first header. The latest workbook uses the second.
  J: ['Legal Max Weight (kg)', 'Legal Max Axle Unit Weight (kg)'],
  K: ['Permittable Max Weight (kg)', 'Permittable Max Axle Unit Weight (kg)'],
};

// These columns move between workbook versions, so find them by header.
// The order is important: own spread (min, max), then spacing to the neighbour (min, max).
const GEOMETRY_HEADERS = [
  'Axle Unit Spread Min (m)',
  'Axle Unit Spread Max (m)',
  'Inter-axle Spacing Min (m)',
  'Inter-axle Spacing Max (m)',
];

module.exports = async function loadTrailerRows() {
  const includeHidden = shouldIncludeHiddenRows();
  const { file, sheet } = await openWorksheet(SHEET_NAME);
  checkHeaders(sheet, EXPECTED_HEADERS);

  const geometryColumns = GEOMETRY_HEADERS.map((header) =>
    findColumnByHeader(sheet, header),
  );

  // Business data stops at the "Special Notes" column.
  // The columns after it have formulas (for example "Row Signature")
  // that have values on empty rows too.
  const notesColumn = findColumnByHeader(sheet, 'Special Notes');
  const lastDataColumnNumber = sheet.getColumn(notesColumn).number;

  const rows = [];
  let hiddenRowCount = 0;
  let emptyRowCount = 0;
  for (
    let rowNumber = FIRST_DATA_ROW;
    rowNumber <= sheet.rowCount;
    rowNumber++
  ) {
    const row = sheet.getRow(rowNumber);

    // Skip only rows that are fully empty. Keep rows that are partly filled in.
    if (isEmptyRow(row, lastDataColumnNumber)) {
      emptyRowCount++;
      continue;
    }
    if (row.hidden && !includeHidden) {
      hiddenRowCount++;
      continue;
    }

    rows.push({
      row: rowNumber,
      hidden: !!row.hidden,
      commodity: cellText(row, 'B'),
      category: cellText(row, 'C'),
      vehicle: cellText(row, 'D'),
      axleType: cellText(row, 'E'),
      before: cellText(row, 'F'),
      after: cellText(row, 'G'),
      neighbourCategory: cellText(row, 'H'),
      neighbourAxleType: cellText(row, 'I'),
      limits: {
        J: cellValue(row, 'J'), // Legal
        K: cellValue(row, 'K'), // Permittable
      },
      geometry: Object.fromEntries(
        geometryColumns.map((column) => [column, cellValue(row, column)]),
      ),
      notes: cellText(row, notesColumn),
    });
  }
  if (rows.length === 0) {
    throw new Error('No spreadsheet rows selected');
  }

  // The test files read the rows from this environment variable.
  // The workbook is read again on each run, so the data is never out of date.
  process.env.POLICY_TRAILER_XLS_TEST_DATA = JSON.stringify({
    file,
    sheet: sheet.name,
    geometryColumns,
    rows,
  });
  console.log(
    `XLS: ${file}\n${sheet.name}: ${rows.length} included, ${hiddenRowCount} hidden excluded, ${emptyRowCount} empty excluded; ${rows.length * 4} base weight boundary cases before geometry endpoint expansion`,
  );
};

function isEmptyRow(row, lastColumnNumber) {
  for (let columnNumber = 1; columnNumber <= lastColumnNumber; columnNumber++) {
    if (row.getCell(columnNumber).value !== null) {
      return false;
    }
  }
  return true;
}
