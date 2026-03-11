import type { CellValue, Workbook, Worksheet } from 'exceljs';

export interface SheetConfig {
  sheetName: string;
  headerRow: number;
  firstDataRow?: number;
}

export type ScrapedCellValue = string | number | boolean | null;
export type ScrapedRow = Record<string, ScrapedCellValue>;

export function readWorksheetRows(
  workbook: Workbook,
  config: SheetConfig,
): ScrapedRow[] {
  const worksheet = workbook.getWorksheet(config.sheetName);

  if (!worksheet) {
    throw new Error(`Worksheet not found: ${config.sheetName}`);
  }

  const headers = readHeaders(worksheet, config.headerRow);
  const firstDataRow = config.firstDataRow ?? config.headerRow + 1;
  const rows: ScrapedRow[] = [];

  for (let rowNumber = firstDataRow; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const values = headers.map((_, index) =>
      normalizeCellValue(row.getCell(index + 1).value),
    );

    if (values.every(isBlankCellValue)) {
      continue;
    }

    const record: ScrapedRow = {};

    headers.forEach((header, index) => {
      record[header] = values[index] ?? null;
    });

    rows.push(record);
  }

  return rows;
}

function readHeaders(worksheet: Worksheet, headerRowNumber: number): string[] {
  const headerRow = worksheet.getRow(headerRowNumber);
  const headerCount = headerRow.actualCellCount;

  if (headerCount === 0) {
    throw new Error(`Header row ${headerRowNumber} is empty`);
  }

  return Array.from({ length: headerCount }, (_, index) => {
    const headerValue = normalizeCellValue(headerRow.getCell(index + 1).value);

    if (typeof headerValue !== 'string' || headerValue.trim() === '') {
      throw new Error(`Header row ${headerRowNumber} has an empty header in column ${index + 1}`);
    }

    return headerValue;
  });
}

function normalizeCellValue(value: CellValue | undefined): ScrapedCellValue {
  if (value == null) {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value
      .map((part) => normalizeCellValue(part))
      .filter((part): part is string | number | boolean => part !== null)
      .join('');
  }

  if (typeof value === 'object') {
    if ('result' in value) {
      return normalizeCellValue(value.result);
    }

    if ('formula' in value && typeof value.formula === 'string') {
      return value.formula;
    }

    if ('sharedFormula' in value && typeof value.sharedFormula === 'string') {
      return value.sharedFormula;
    }

    if ('text' in value && typeof value.text === 'string') {
      return value.text;
    }

    if ('hyperlink' in value && typeof value.hyperlink === 'string') {
      return value.hyperlink;
    }

    if ('richText' in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text).join('');
    }
  }

  return String(value);
}

function isBlankCellValue(value: ScrapedCellValue): boolean {
  return value === null || (typeof value === 'string' && value.trim() === '');
}
