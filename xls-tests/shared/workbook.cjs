// Helpers to read the "Over Weight Dimension Set" workbook.
// The Jest globalSetup files use these helpers before the tests start.
const fs = require('node:fs');
const path = require('node:path');
const ExcelJS = require('exceljs');

const DEFAULT_WORKBOOK = path.join(
  __dirname,
  '..',
  'Over Weight Dimension Set.xlsx',
);
const HEADER_ROW = 4;
const FIRST_DATA_ROW = 5;

/**
 * Opens one worksheet from the workbook.
 * Set XLS_WORKBOOK to use a workbook at a different path.
 */
async function openWorksheet(sheetName) {
  const file = path.resolve(process.env.XLS_WORKBOOK || DEFAULT_WORKBOOK);
  if (!fs.existsSync(file)) {
    throw new Error(
      `Workbook not found: ${file}. See xls-tests/README.md to get the workbook.`,
    );
  }
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) {
    throw new Error(`Missing worksheet: ${sheetName}`);
  }
  return { file, sheet };
}

/**
 * Hidden rows are not tested by default.
 * Set XLS_INCLUDE_HIDDEN=true to test them.
 */
function shouldIncludeHiddenRows() {
  const includeHidden = process.env.XLS_INCLUDE_HIDDEN || 'false';
  if (includeHidden !== 'true' && includeHidden !== 'false') {
    throw new Error('XLS_INCLUDE_HIDDEN must be true or false');
  }
  return includeHidden === 'true';
}

/**
 * Stops the test run if a column header is not as expected.
 * This prevents the tests from reading the wrong column after a workbook change.
 * A header can be one string or a list of permitted strings.
 */
function checkHeaders(sheet, expectedHeaders) {
  for (const [column, expected] of Object.entries(expectedHeaders)) {
    const permittedHeaders = [expected].flat();
    const actual = sheet.getCell(`${column}${HEADER_ROW}`).text.trim();
    if (!permittedHeaders.includes(actual)) {
      throw new Error(
        `Unexpected header at ${sheet.name}!${column}${HEADER_ROW}: '${actual}'`,
      );
    }
  }
}

/**
 * Returns the column letter of the one header that has this text.
 * Use this for columns that move between workbook versions.
 */
function findColumnByHeader(sheet, header) {
  const columns = [];
  sheet.getRow(HEADER_ROW).eachCell((cell) => {
    if (cell.text.trim() === header) {
      columns.push(cell.address.replace(/\d+/g, ''));
    }
  });
  if (columns.length !== 1) {
    throw new Error(`Expected one '${header}' column in ${sheet.name}`);
  }
  return columns[0];
}

/** Returns the cell as trimmed text, as Excel shows it. */
function cellText(row, column) {
  return row.getCell(column).text.trim();
}

/** Returns the cell value. For a formula cell, returns the calculated result. */
function cellValue(row, column) {
  const cell = row.getCell(column);
  return cell.formula ? cell.result : cell.value;
}

module.exports = {
  FIRST_DATA_ROW,
  HEADER_ROW,
  openWorksheet,
  shouldIncludeHiddenRows,
  checkHeaders,
  findColumnByHeader,
  cellText,
  cellValue,
};
