# XLS Scraper

Small standalone TypeScript tool for reading confidential XLSX data locally.

## What it does

- Loads `Over Weight Dimension Set.xlsx` from this directory
- Scrapes the `Commodity to Vehicle to Trailer` sheet
- Reads headers from row 5 and data from row 6
- Prints the scraped rows as pretty JSON

## Usage

```bash
cd src/_tools/xls-scraper
npm install
npm run scrape
```

## Typecheck

```bash
npm run typecheck
```

## Notes

- The workbook is confidential and is gitignored and npmignored in this package.
- To add another sheet later, add another sheet config in `src/index.ts`.
