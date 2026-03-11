import ExcelJS from 'exceljs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { readWorksheetRows, type SheetConfig } from './readWorksheet.js';

const WORKBOOK_FILE_NAME = 'Over Weight Dimension Set.xlsx';

const SHEETS = {
  commodityToVehicleToTrailer: {
    sheetName: 'Commodity to Vehicle to Trailer',
    headerRow: 5,
  },
} satisfies Record<string, SheetConfig>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workbookPath = path.resolve(__dirname, '..', WORKBOOK_FILE_NAME);

async function main(): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.readFile(workbookPath);
  } catch (error) {
    if (isMissingFileError(error)) {
      throw new Error(`Workbook not found: ${WORKBOOK_FILE_NAME}`);
    }

    throw error;
  }

  const rows = readWorksheetRows(workbook, SHEETS.commodityToVehicleToTrailer);

  console.log(JSON.stringify(rows, null, 2));
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exit(1);
});
