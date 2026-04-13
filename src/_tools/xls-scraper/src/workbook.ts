import ExcelJS from 'exceljs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WORKBOOK_FILE_NAME = 'Over Weight Dimension Set.xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PACKAGE_ROOT = path.resolve(__dirname, '..');

export function resolvePackagePath(...segments: string[]): string {
  return path.resolve(PACKAGE_ROOT, ...segments);
}

export async function loadWorkbook(): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.readFile(resolvePackagePath(WORKBOOK_FILE_NAME));
  } catch (error) {
    if (isMissingFileError(error)) {
      throw new Error(`Workbook not found: ${WORKBOOK_FILE_NAME}`);
    }

    throw error;
  }

  return workbook;
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}
