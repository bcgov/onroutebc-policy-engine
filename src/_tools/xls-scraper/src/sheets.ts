import type { SheetConfig } from './readWorksheet.js';

export const COMMODITY_TO_VEHICLE_TO_TRAILER_SHEET = {
  sheetName: 'Commodity to Vehicle to Trailer',
  headerRow: 5,
} satisfies SheetConfig;

export const TRAILER_WEIGHT_DIM_SETS_SHEET = {
  sheetName: 'Trailer - Weight Dim. Sets',
  headerRow: 4,
  headerColumns: 20,
} satisfies SheetConfig;
