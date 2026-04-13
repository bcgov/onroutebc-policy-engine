# XLS Scraper

Purpose: Takes the `Over Weight Dimension Set.xlsx`, parses it, and generates a candidate config JSON for review before applying it to the tracked config files.

Note: The .xlsx file is confidential and not included in this repo. To use this scraper download the file and put it in this folder.

This helper tool is IN PROGRESS, currently working on STOW form. Eventually would be great to be able to contribute to other forms too.

## Commands

```bash
cd src/_tools/xls-scraper
npm install
npm run scrape
npm run scrape:update-json
npm run revert-json
npm run audit:commodity -- --commodity-type=None
npm run audit:stow-missing
npm run scrape:apply-generated
npm run typecheck
```

`npm run scrape` prints the `Commodity to Vehicle to Trailer` sheet as pretty JSON.

`npm run scrape:update-json` reads the same sheet and writes a generated review artifact to:

- `src/_test/policy-config/_current-config.generated.json`
- `src/_examples/usage/node-backend-example/src/config/_current-config.json`

It does not update the canonical tracked config file at `src/_test/policy-config/_current-config.json`.

`npm run revert-json` copies the canonical tracked config from:

- `src/_test/policy-config/_current-config.json`

back into:

- `src/_test/policy-config/_current-config.generated.json`
- `src/_examples/usage/node-backend-example/src/config/_current-config.json`

This resets the local preview state back to the canonical config without applying the generated file.

`npm run scrape:apply-generated` copies the reviewed generated file into:

- `src/_test/policy-config/_current-config.json`
- `src/_examples/usage/node-backend-example/src/config/_current-config.json`

The generate step is intended to be idempotent. If the workbook does not change, rerunning it should not produce a diff in the generated file.

To run the repo's Jest unit tests against the generated preview config instead of the canonical config, use:

```bash
cd /Users/adamcoard/Dev/onroutebc-policy-engine
npm run test:generated -- --runInBand src/_test/unit/stow-regression.spec.ts
```

The existing `npm test` command continues to use `src/_test/policy-config/_current-config.json`.

`npm run audit:commodity -- --commodity-type=None` reads the XLS directly, excludes struck-through rows, compares the XLS-derived rows for that commodity against the current policy engine output, and prints clearly-labelled sections for:

- expected vehicle sub-types from `Commodity to Vehicle to Trailer`
- current permittable vehicle sub-types from `policyEngine.getPermittablePowerUnitTypes(...)`
- missing vehicle sub-types as `XLS direct rows - policyEngine`
- deferred vehicle sub-types that remain blocked even with the audit's LCV-enabled comparison
- extra vehicle sub-types in policy as `policyEngine - XLS`
- expected direct trailers from `Commodity to Vehicle to Trailer`
- current direct trailers from `policyEngine.getNextPermittableVehicles(...)` after `[powerUnit]`
- missing direct trailers as `XLS direct rows - policyEngine`
- extra direct trailers in policy as `policyEngine - XLS`
- expected boosters from direct `Commodity to Vehicle to Trailer` rows with `Can Add Booster? = Y`
- current boosters from `policyEngine.getNextPermittableVehicles(...)` after `[powerUnit, trailer]`
- missing boosters as `XLS direct booster-capable rows - policyEngine`
- extra boosters in policy as `policyEngine - XLS direct booster-capable rows`
- safe trailer-weight booster placement rows from `Trailer - Weight Dim. Sets`
- direct booster-capable rows with no safe trailer-weight placement detail
- ambiguous trailer-weight booster rows with mixed direct `Can Add Booster?` flags
- contradictory trailer-weight booster rows where direct rows all say `Can Add Booster? = N`
- trailer-weight booster rows with no matching direct trailer row
- standalone `Boosters` rows that are already represented elsewhere by direct rows or by separately reported direct gaps
- standalone `Jeep` rows that are already represented elsewhere by current jeep options or by separately reported direct gaps
- `Force Submit to Queue` rows that are already represented elsewhere by current policy output or by separately reported direct gaps
- unresolved XLS rows not yet modeled by the updater, including any remaining jeep rows, standalone booster rows, force-submit rows, and `Steer`/`Drive`/`Wheelbase` rows

By default it compares against `src/_test/policy-config/_current-config.generated.json`. Override that with `--compare-config=canonical|generated|prefer-generated`.

The audit always compares against a `Policy` instance with LCV authorization enabled. This avoids reporting LCV XLS rows as false-positive missing items when the config is correct but the runtime caller has not opted into LCV.

`npm run audit:stow-missing` runs the same stage-aware comparison across every commodity in the workbook and prints one consolidated list of:

- missing direct power units
- missing direct trailers
- missing boosters
- direct booster rows without safe placement detail
- ambiguous trailer-weight booster rows
- contradictory trailer-weight booster rows
- unmatched trailer-weight booster rows
- it intentionally does not repeat standalone `Boosters` rows when they are already represented by direct booster-capable rows or by separately reported direct power/trailer gaps
- it also does not repeat `Force Submit to Queue` rows when they are already represented by current policy output or by separately reported direct power/trailer gaps
- unresolved XLS rows not yet modeled by the updater, including any remaining jeep rows, standalone booster rows, force-submit rows, and `Steer`/`Drive`/`Wheelbase` rows
- deferred rows that remain blocked even with the audit's LCV-enabled comparison

Interpretation:

- `safe` booster placement rows are verified correlations, not missing work
- `audit:commodity` shows those safe rows for detailed row-by-row review
- `audit:stow-missing` hides them so the consolidated report stays focused on unresolved items only
- `audit:commodity` also shows standalone `Boosters` rows that are already represented elsewhere
- `audit:commodity` also shows standalone `Jeep` rows that are already represented elsewhere
- `audit:commodity` also shows `Force Submit to Queue` rows that are already represented elsewhere
- `audit:stow-missing` hides those standalone booster rows when they add no new actionable gap beyond the direct trailer rows already reported
- `audit:stow-missing` also hides standalone jeep rows when they add no new actionable gap beyond current jeep options or already-reported direct path gaps
- `audit:stow-missing` also hides force-submit rows when they are already represented by current policy output or are only blocked by separately reported direct power/trailer gaps

## Policy API Flow

The audit commands compare XLS expectations against the policy engine in the same sequence a consumer would use it:

1. `policyEngine.getCommodities('STOW')`
2. `policyEngine.getPermittablePowerUnitTypes('STOW', commodityId)`
3. `policyEngine.getNextPermittableVehicles('STOW', commodityId, [powerUnitId])`
4. `policyEngine.getNextPermittableVehicles('STOW', commodityId, [powerUnitId, trailerId])`
5. `policyEngine.isConfigurationValid('STOW', commodityId, configuration)` for final configuration checks

In practice this means:

- power unit gaps are checked at step 2
- direct trailer gaps are checked at step 3
- booster gaps are checked at step 4 using direct first-sheet rows with `Can Add Booster? = Y`

LCV is the one important gating exception in this flow:

- the config can contain LCV power units and trailers
- `policyEngine.getPermittablePowerUnitTypes(...)` and `policyEngine.getNextPermittableVehicles(...)` still filter them out unless `specialAuthorizations.isLcvAllowed` is `true`
- the audit commands intentionally instantiate `Policy` with LCV authorization enabled so LCV rows are audited as valid opt-in behavior, not as missing rows

## LCV Verification

LCV rows in the STOW XLS are not ordinary "missing" rows. They are opt-in rows gated by client special authorization.

Engine behavior:

- default `Policy(config)` hides LCV vehicles
- authorized `Policy(config, { companyId, isLcvAllowed: true, noFeeType: null })` exposes them
- the same behavior applies if you call `policy.setSpecialAuthorizations(...)` after construction

Direct verification commands from `src/_tools/xls-scraper`:

```bash
node --import tsx --eval "import fs from 'node:fs'; const importedModule = await import('../../index.ts'); const policyModule = importedModule.default ?? importedModule; const config = JSON.parse(fs.readFileSync('../../_test/policy-config/_current-config.json', 'utf8')); const policy = new policyModule.Policy(config); console.log([...policy.getPermittablePowerUnitTypes('STOW', 'XXXXXXX').values()]);"
```

```bash
node --import tsx --eval "import fs from 'node:fs'; const importedModule = await import('../../index.ts'); const policyModule = importedModule.default ?? importedModule; const config = JSON.parse(fs.readFileSync('../../_test/policy-config/_current-config.json', 'utf8')); const policy = new policyModule.Policy(config, { companyId: -1, isLcvAllowed: true, noFeeType: null }); console.log([...policy.getPermittablePowerUnitTypes('STOW', 'XXXXXXX').values()]);"
```

The second command should include:

- `Long Combination Vehicles (LCV) - Rocky Mountain Doubles`
- `Long Combination Vehicles (LCV) - Turnpike Doubles`

Audit verification commands from `src/_tools/xls-scraper`:

```bash
npm run audit:commodity -- --commodity-type=None --compare-config=canonical
```

```bash
npm run audit:stow-missing -- --compare-config=canonical
```

Expected audit behavior:

- the audit treats the LCV rows as normal expected policy output
- the audit should not report the STOW LCV rows as missing when the config exposes them correctly

Important example-app caveat:

- the current node backend example constructs `Policy` with config only
- there is no existing backend or frontend flag that turns on LCV authorization
- so the example app will continue to hide LCV until that backend policy instance is created with `specialAuthorizations.isLcvAllowed = true`

## Included

- Sheet: `Commodity to Vehicle to Trailer`
- Sheet: `Trailer - Weight Dim. Sets` for safe booster placement correlation and diagnostics
- Headers from row 5
- Data rows from row 6 onward
- Direct STOW basic `commodity -> power unit -> trailer` combinations
- No-trailer combinations mapped to trailer id `XXXXXXX`
- Rows with `Can Add Trailer? = Y` and a blank trailer are also treated as `XXXXXXX`
- Rows with a real trailer but blank `Can Add Trailer?` are treated as direct trailer rows
- `booster` on supported direct trailer rows is additive from `Can Add Booster?`
- Exact-name lookups plus these explicit overrides:
  - `Scrapers on Dollies` -> `SCRAPER`
  - `Tow Trucks and Disabled Vehicles` -> `TOWDISB`
  - `Platform Trailer` -> `PLATFRM`
  - `Semi-Trailers - Widespread Tandem` -> `STWDTAN`

These rows are still surfaced by the audit commands when they represent real unresolved work. When a jeep row, standalone booster row, or force-submit row is already covered by current policy behavior or by separately reported direct gaps, the audit moves it out of the unresolved section so the STOW-wide report stays focused on actual remaining issues.

This means the updater claims correctness for direct trailer and no-trailer STOW combinations and for additive booster-after-trailer permissions the current policy model can represent cleanly.

## What The Updater Changes

- `npm run scrape:update-json` writes only the generated review artifact.
- It also refreshes the backend example config copy so the running example reflects the generated preview.
- It preserves existing trailer objects when they already exist.
- It only adds `weightPermittable` and direct first-sheet `booster` capability; it does not clear existing capability in this pass.
- `Trailer - Weight Dim. Sets` is correlated against the direct sheet by `commodity + trailer`.
- That second-sheet correlation is considered safe only when every matching direct row for that same `commodity + trailer` says `Can Add Booster? = Y`.
- Contradictory, ambiguous, or unmatched trailer-weight rows are kept in audit output only and do not expand JSON behavior.
- The current JSON model only stores trailer-level `booster: boolean`, so second-sheet placement data does not create new booster capability beyond the direct first-sheet rows.
- It prints a summary of supported row count, affected commodity count, skipped-row reasons, the generated file path, and whether the generated output differs from the current canonical config.
- `npm run scrape:apply-generated` copies the exact reviewed generated JSON into the canonical config and backend example config.
- `npm run revert-json` copies the canonical config into the generated file and backend example config.

## Review Workflow

1. Run `npm run scrape:update-json`.
2. Review `src/_test/policy-config/_current-config.generated.json`.
3. Use the backend example against the refreshed backend config copy if you want to validate the preview locally.
4. Compare the generated file against `src/_test/policy-config/_current-config.json`.
5. If the generated output is wrong, run `npm run revert-json` to restore the preview state.
6. Only when satisfied, run `npm run scrape:apply-generated`.

This keeps the canonical tracked config stable while you iterate on content questions.

## Confidentiality

- `Over Weight Dimension Set.xlsx` stays local only.
- The workbook is ignored by both git and npm in this tool.
- The generated review artifact is not used by the published package output.
- The root package also ignores `dist/_tools/` so this tool does not ship in the published package output.

## Red-Green Verification

(edit: This may be out of date, but this is how I originally validated my changes)

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
2. Review `src/_test/policy-config/_current-config.generated.json`.
3. Run `npm run scrape:apply-generated`.
4. Restart the backend example so it reloads `_current-config.json`.
5. Repeat the exact same UI steps.
6. Confirm that `Vehicle configuration is not permittable for this commodity` is no longer present. It should instead give a permit cost, in this case $15.

Other unrelated validation messages can still appear. The red-green check is only whether that specific configuration error disappears after the config update.
