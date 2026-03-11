# XLS Scraper

Purpose: Takes the `Over Weight Dimension Set.xlsx`, parses it, and updates the _current-config.json file.

Note: The .xlsx file is confidential and not included in this repo. To use this scraper download the file and put it in this folder.

This helper tool is IN PROGRESS, currently working on STOW form. Eventually would be great to be able to contribute to other forms too.

## Commands

```bash
cd src/_tools/xls-scraper
npm install
npm run scrape
npm run scrape:update-json
npm run typecheck
```

`npm run scrape` prints the `Commodity to Vehicle to Trailer` sheet as pretty JSON.

`npm run scrape:update-json` reads the same sheet and updates both:

- `src/_test/policy-config/_current-config.json`
- `src/_examples/usage/node-backend-example/src/config/_current-config.json`

The updater is intended to be idempotent. If the workbook does not change, rerunning it should not produce a diff.

## Included

- Sheet: `Commodity to Vehicle to Trailer`
- Headers from row 5
- Data rows from row 6 onward
- Direct STOW basic `commodity -> power unit -> trailer` combinations
- No-trailer combinations mapped to trailer id `XXXXXXX`
- Rows with `Can Add Trailer? = Y` and a blank trailer are also treated as `XXXXXXX`
- `weightPermittable: true` for supported direct rows
- `booster` on supported direct trailer rows from `Can Add Booster?`
- Exact-name lookups plus these explicit overrides:
  - `Scrapers on Dollies` -> `SCRAPER`
  - `Tow Trucks and Disabled Vehicles` -> `TOWDISB`
  - `Platform Trailer` -> `PLATFRM`
  - `Semi-Trailers - Widespread Tandem` -> `STWDTAN`

## Not Included

- Jeep rows
- Standalone booster rows
- `Force Submit to Queue`
- `Steer`
- `Drive`
- `Wheelbase`

This means the updater only claims correctness for direct trailer and no-trailer STOW basic combinations that the current policy model can represent cleanly.

## What The Updater Changes

- It rewrites direct `weightPermittable` values for the supported STOW-basic rows covered by the sheet.
- It preserves existing trailer objects when they already exist.
- It mirrors the exact resulting JSON into the backend example config so `localhost:3000` reflects the same policy data.
- It prints a summary of supported row count, affected commodity count, skipped-row reasons, and written files.

## Confidentiality

- `Over Weight Dimension Set.xlsx` stays local only.
- The workbook is ignored by both git and npm in this tool.
- The root package also ignores `dist/_tools/` so this tool does not ship in the published package output.

## Red-Green Verification

Use the existing running example at `http://localhost:3000`. No frontend code changes are required for this check.

The idea with this is that we would use the _example tools first to show a failure (red), then we update the _current-config.json with changes per the xls file, re-run _example, and then should see a success (green). This way we know our change is working.


### Red

Importantly, you must make sure you have the OLD _current-config.json in your applciation, this means the following files should be updated (specifically it only has to be the backend example, but good practice is keeping both files in sync):

For example, you can use the old file at this commit: https://github.com/bcgov/onroutebc-policy-engine/blob/9aa7bf1261088b185f5d5b8ce1570ee6c3d02a55/src/_test/policy-config/_current-config.json

- `src/_test/policy-config/_current-config.json`
- `src/_examples/usage/node-backend-example/src/config/_current-config.json`

1. Start the example frontend and backend normally.
2. Open `http://localhost:3000`.
3. Select permit type `STOW`.
4. Leave the preloaded sample vehicle and trailer setup as-is:
   - `Vehicle Sub-Type` stays `Truck Tractors`
   - `Trailer 1` stays `Jeeps`
   - `Trailer 2` stays `Fixed Equipment - Counter Flow Asphalt Drum Mixers`
   - `Trailer 3` stays `Boosters`
5. In `Vehicle Configuration`, change `Commodity Type` from `None` to `Fixed Equipment`.
6. Validate the application.
7. Confirm the validation output includes `Vehicle configuration is not permittable for this commodity`.

### Green

1. Run `cd src/_tools/xls-scraper && npm run scrape:update-json`.
2. Restart the backend example so it reloads `_current-config.json`.
3. Repeat the exact same UI steps.
4. Confirm that `Vehicle configuration is not permittable for this commodity` is no longer present. It should instead give a permit cost, in this case $15.

Other unrelated validation messages can still appear. The red-green check is only whether that specific configuration error disappears after the config update.
