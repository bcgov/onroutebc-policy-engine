import { readWorksheetRows } from './readWorksheet.js';
import { COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET } from './sheets.js';
import { loadWorkbook } from './workbook.js';

async function main(): Promise<void> {
  const workbook = await loadWorkbook();
  const rows = readWorksheetRows(workbook, COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET);

  console.log(JSON.stringify(rows, null, 2));
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exit(1);
});
