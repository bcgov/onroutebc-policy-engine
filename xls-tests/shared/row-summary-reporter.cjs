// Jest reporter that prints how many workbook rows pass.
// A row passes only when all of its tests pass.
module.exports = class RowSummaryReporter {
  constructor(_globalConfig, options) {
    // The globalSetup file puts the workbook rows in this environment variable.
    this.dataEnvVar = options.dataEnvVar;
  }

  onRunComplete(_contexts, results) {
    const data = process.env[this.dataEnvVar];
    if (!data) return;

    const { rows, sheet } = JSON.parse(data);
    const statusesByRow = new Map(rows.map(({ row }) => [row, []]));

    // Weight test titles start with the cell reference, for example
    // "Trailer - Weight Dim. Sets!J42 | ...". Other tests do not.
    const cellReference = /^![A-Z]+(\d+) \|/;
    for (const suite of results.testResults) {
      for (const test of suite.testResults) {
        if (!test.title.startsWith(`${sheet}!`)) continue;

        const match = test.title.slice(sheet.length).match(cellReference);
        if (!match) continue;

        const rowNumber = Number(match[1]);
        statusesByRow.get(rowNumber)?.push(test.status);
      }
    }

    // A row with no tests (for example, all skipped) does not pass.
    const passedRowCount = [...statusesByRow.values()].filter(
      (statuses) =>
        statuses.length > 0 && statuses.every((status) => status === 'passed'),
    ).length;
    const percent = ((passedRowCount / rows.length) * 100).toFixed(1);
    console.log(
      `\nXLS rows: ${passedRowCount} of ${rows.length} passing (${percent}%) — all tests for a row must pass.`,
    );
  }
};
