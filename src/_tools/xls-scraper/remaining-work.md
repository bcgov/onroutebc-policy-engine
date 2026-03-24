# Remaining STOW Work

This document describes the non-empty sections still shown by:

```bash
cd src/_tools/xls-scraper
npm run audit:stow-missing -- --compare-config=generated
```

It is grounded only in:

- the confidential XLS workbook
  - `Commodity to Vehicle to Trailer` as `Commodity`
  - `Trailer - Weight Dim. Sets` as `Weight Dim.`
- current generated `policyEngine` behavior from:
  - `src/_test/policy-config/_current-config.generated.json`

## Current Status

For generated STOW, the currently modeled policy surface is complete in the main audit sections:

- `Missing Direct Power Units`: none
- `Missing Direct Trailers`: none
- `Missing Boosters`: none

The remaining non-empty sections are diagnostic or model-gap sections:

- `Direct Booster Rows Without Safe Placement Detail`
- `Ambiguous Trailer Weight Booster Rows`
- `Contradictory Trailer Weight Booster Rows`
- `Unmatched Trailer Weight Booster Rows`
- `Unresolved XLS Rows Not Yet Modeled By The Updater`

That means the remaining work is no longer about basic STOW visibility. It is now about:

- booster corroboration gaps between the two sheets
- booster contradictions between the two sheets
- second-sheet rows with no first-sheet anchor
- row semantics that the current JSON / `policyEngine` model cannot express

Current generated audit counts:

- `Direct Booster Rows Without Safe Placement Detail`: `13`
- `Ambiguous Trailer Weight Booster Rows`: `2`
- `Contradictory Trailer Weight Booster Rows`: `3`
- `Unmatched Trailer Weight Booster Rows`: `3`
- `Unresolved XLS Rows Not Yet Modeled By The Updater`: `3`

## PolicyEngine Functions Affected

If any of these remaining items were resolved differently, the impacted public behavior would be in:

- `policyEngine.getPermittablePowerUnitTypes('STOW', commodityId)`
- `policyEngine.getNextPermittableVehicles('STOW', commodityId, [powerUnitId])`
- `policyEngine.getNextPermittableVehicles('STOW', commodityId, [powerUnitId, trailerId])`
- `policyEngine.isConfigurationValid('STOW', commodityId, configuration)`
- `policyEngine.validate(...)`

In practice, the remaining issues mostly affect:

- whether a trailer should expose `Boosters` after `[powerUnitId, trailerId]`
- whether a more specific row with `Steer` / `Drive` / `Wheelbase` should narrow a broader row that is already modeled

## SME Matrix

| Section | Representative XLS Rows | What XLS Says | Current policyEngine behavior | Why not resolved automatically | Question for SME |
| --- | --- | --- | --- | --- | --- |
| Direct Booster Rows Without Safe Placement Detail | `Commodity row 104` | `None -> Truck Tractors -> Fixed Equipment - Wheeler Semi-Trailers -> Can Add Booster = Y` | `policyEngine.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC', 'FEWHELR'])` returns `['Boosters']` | First sheet is enough to model booster permission, but there is no safe matching `Weight Dim.` corroboration for `Fixed Equipment - Wheeler Semi-Trailers` | Is first-sheet-only `Can Add Booster = Y` sufficient for STOW when there is no safe second-sheet placement detail? |
| Direct Booster Rows Without Safe Placement Detail | `Commodity rows 31, 88` with `Weight Dim. rows 258-260` and `Commodity row 122` | `row 31 = Non-Reducible Loads -> Picker Truck Tractors -> Semi-Trailers -> Y`; `row 88 = Non-Reducible Loads -> Truck Tractors -> Semi-Trailers -> Y`; `row 122 = same trailer but Steer/Drive/Wheelbase-specific and N` | `policyEngine.getNextPermittableVehicles('STOW', 'NONREDU', ['TRKTRAC', 'SEMITRL'])` returns `['Boosters']` | The only plausible `Weight Dim.` match is ambiguous because the second sheet has no power-unit or steer/drive/wheelbase discriminator | Should the generic `Y` rows still win when a more specific row for the same trailer says `N`? |
| Ambiguous Trailer Weight Booster Rows | `Weight Dim. rows 258-260` with `Commodity rows 31, 88, 122` | `Weight Dim.` says `Non-Reducible Loads -> Semi-Trailers -> Booster`; `Commodity` rows mix `Y` and `N` | Generated currently exposes boosters for the modeled `Semi-Trailers` path because rows `31` and `88` are direct `Y` rows | `Weight Dim.` is keyed only by `commodity + trailer`; it cannot choose between conflicting direct rows | Which `Commodity` rows should control `Non-Reducible Loads -> Semi-Trailers` for booster interpretation? |
| Ambiguous Trailer Weight Booster Rows | `Weight Dim. rows 429-431` with `Commodity rows 114, 124` | `Weight Dim.` says `Reducible Loads -> Semi-Trailers -> Booster`; `Commodity row 114 = Y`; `Commodity row 124 = N` with `Steer = Single`, `Drive = Tandem`, `Wheelbase = 6.2-7.2` | `policyEngine.getNextPermittableVehicles('STOW', 'REDUCBL', ['TRKTRAC', 'SEMITRL'])` returns `['Boosters']` | Same ambiguity: the second sheet is too coarse to tell whether the specific `N` row is intended to narrow the generic `Y` row | Is `Commodity row 124` meant to override or narrow `Commodity row 114`? |
| Contradictory Trailer Weight Booster Rows | `Weight Dim. rows 327-329` with `Commodity rows 100, 130` | `Weight Dim.` says `None -> Fixed Equipment - Conveyors -> Booster`; direct `Commodity` rows both say `Can Add Booster = N` | `policyEngine.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC', 'FECVYRX'])` returns `[]` | This is a direct cross-sheet contradiction; current tooling intentionally lets `Commodity` win | Which sheet is authoritative here, or is one side stale? |
| Contradictory Trailer Weight Booster Rows | `Weight Dim. rows 368-370` with `Commodity rows 10, 11, 123` | `Weight Dim.` says `None -> Semi-Trailers -> Booster`; `Commodity rows 10, 11, 123` all say `Can Add Booster = N` | `policyEngine.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC', 'SEMITRL'])` returns `[]` | Again, the second sheet contradicts all direct first-sheet evidence | Should this `Weight Dim.` set be ignored for STOW, or is the first sheet incomplete? |
| Contradictory Trailer Weight Booster Rows | `Weight Dim. rows 113-115` with `Commodity rows 66, 125` | `Weight Dim.` says `Fixed Equipment -> Fixed Equipment - Conveyors -> Booster`; direct `Commodity` rows both say `N` | Generated does not add booster for this trailer path | Same contradiction pattern; current tooling intentionally does not let second-sheet data override first-sheet `N` | Is `Weight Dim.` broader than STOW selection rules, or is one sheet wrong? |
| Unmatched Trailer Weight Booster Rows | `Weight Dim. rows 301-303` | `Non-Reducible Loads -> Steering Trailers - Self/Remote -> Booster`, `Force submit to Queue = x` | No JSON behavior is created from these rows because there is no matching direct `Commodity` trailer row | Second-sheet-only data cannot be used under the current source-of-truth rule | Are corresponding `Commodity` rows missing, or are these intentionally not selectable in STOW? |
| Unmatched Trailer Weight Booster Rows | `Weight Dim. rows 374-376` | `None -> Steering Trailers - Manned -> Booster`, `Force submit to Queue = x` | The audit treats this as unmatched second-sheet-only data; it is not used to create JSON behavior | There is no matching direct `Commodity` trailer row | Should steering trailers be selectable in STOW, or only represented elsewhere? |
| Unmatched Trailer Weight Booster Rows | `Weight Dim. rows 380-382` | `None -> Steering Trailers - Self/Remote -> Booster`, `Force submit to Queue = x` | Same as above | Same blocker: second-sheet-only data | Same question as above |
| Unresolved XLS Rows Not Yet Modeled | `Commodity row 123` | `None -> Truck Tractors -> Semi-Trailers`, `Steer = Single`, `Drive = Tandem`, `Wheelbase = 6.2-7.2`, `Can Add Booster = N` | Generated already exposes the direct semi-trailer option at `policyEngine.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC'])`, which includes `Semi-Trailers` | The current model cannot store steer/drive/wheelbase qualifiers | Can this row be treated as "already covered" if those qualifiers are intentionally ignored? |
| Unresolved XLS Rows Not Yet Modeled | `Commodity row 122` | `Non-Reducible Loads -> Truck Tractors -> Semi-Trailers`, same steer/drive/wheelbase pattern, `N` | Generated already exposes `Semi-Trailers` and then `Boosters` via `Commodity row 88` | `row 122` appears to narrow `row 88`, but the current model cannot represent that narrowing | Does `Commodity row 122` override or narrow `Commodity row 88`? |
| Unresolved XLS Rows Not Yet Modeled | `Commodity row 124` | `Reducible Loads -> Truck Tractors -> Semi-Trailers`, same steer/drive/wheelbase pattern, `N` | Generated already exposes `Semi-Trailers` and then `Boosters` via `Commodity row 114` | Same model limitation: the more specific row conflicts with a broader modeled row | Does `Commodity row 124` override or narrow `Commodity row 114`? |

## Detailed Reasoning By Section

### Direct Booster Rows Without Safe Placement Detail

These rows are already modeled from `Commodity`. They are not missing policy behavior.

The reason they still appear is narrower:

- the first sheet directly says `Can Add Booster = Y`
- so the current model legitimately turns on `trailer.booster = true`
- but we cannot find a safe corroborating `Weight Dim.` match for the same trailer

Representative example:

- `Commodity row 104`
  - `None -> Truck Tractors -> Fixed Equipment - Wheeler Semi-Trailers -> Can Add Booster = Y`
- current generated policy behavior:
  - `policyEngine.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC'])`
    includes `Fixed Equipment - Wheeler Semi-Trailers`
  - `policyEngine.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC', 'FEWHELR'])`
    returns `['Boosters']`
- blocker:
  - there is no safe `Weight Dim.` row set that cleanly matches `None + Fixed Equipment - Wheeler Semi-Trailers`

So this section does not mean "missing booster support." It means:

- booster support already exists
- but the second sheet does not safely confirm the placement detail

Another example is `Commodity rows 31` and `88`:

- both are direct `Y` rows for `Semi-Trailers`
- generated therefore exposes booster after `NONREDU / TRKTRAC / SEMITRL`
- but the only plausible `Weight Dim.` match is `rows 258-260`, which is ambiguous because `Commodity row 122` for the same trailer says `N`

### Ambiguous Trailer Weight Booster Rows

This is a real cross-sheet ambiguity, not a parser gap.

Problem shape:

- `Weight Dim.` is keyed only by `commodity + trailer`
- `Commodity` is keyed by `commodity + power unit + trailer`, and sometimes also carries `Steer` / `Drive` / `Wheelbase`
- when multiple direct rows exist for the same `commodity + trailer` and they disagree on `Can Add Booster`, the second sheet cannot tell us which direct row it belongs to

Representative example:

- `Weight Dim. rows 258-260`
  - `Non-Reducible Loads -> Semi-Trailers -> Booster`
- matching direct rows:
  - `Commodity row 31`: `Picker Truck Tractors`, `Y`
  - `Commodity row 88`: `Truck Tractors`, `Y`
  - `Commodity row 122`: `Truck Tractors`, steer/drive/wheelbase-specific, `N`

Current generated behavior is driven by the direct `Y` rows:

- `policyEngine.getNextPermittableVehicles('STOW', 'NONREDU', ['TRKTRAC', 'SEMITRL'])`
  returns `['Boosters']`

But the workbook itself does not tell us whether:

- `Weight Dim.` should apply to all those rows
- only the broader `Y` rows
- or not the specific `N` row

The same problem exists for:

- `Weight Dim. rows 429-431`
- `Commodity rows 114` and `124`

### Contradictory Trailer Weight Booster Rows

These are direct cross-sheet contradictions.

Representative example:

- `Weight Dim. rows 327-329`
  - `None -> Fixed Equipment - Conveyors -> Booster`
- matching direct rows:
  - `Commodity row 100`
    - `None -> Truck Tractors -> Fixed Equipment - Conveyors -> N`
  - `Commodity row 130`
    - `None -> Trucks -> Fixed Equipment - Conveyors -> N`

Current generated behavior is intentionally conservative:

- `policyEngine.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC', 'FECVYRX'])`
  returns `[]`

That is deliberate:

- the first sheet is the source of truth
- so second-sheet booster rows do not override direct first-sheet `N`

Another clear contradiction:

- `Weight Dim. rows 368-370`
  - `None -> Semi-Trailers -> Booster`
- matching direct rows:
  - `Commodity row 10`: LCV Rocky Mountain Doubles, `N`
  - `Commodity row 11`: LCV Turnpike Doubles, `N`
  - `Commodity row 123`: Truck Tractors with steer/drive/wheelbase, `N`

Current generated behavior:

- `policyEngine.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC', 'SEMITRL'])`
  returns `[]`

So this section is not "unfinished importer work." It is workbook disagreement that needs SME direction.

### Unmatched Trailer Weight Booster Rows

These are `Weight Dim.` rows with no matching direct trailer row on the `Commodity` sheet.

Under the agreed rule set, these rows must not create JSON behavior.

Representative example:

- `Weight Dim. rows 301-303`
  - `Non-Reducible Loads -> Steering Trailers - Self/Remote -> Booster`
  - `Force submit to Queue = x`

There is no matching direct `Commodity` trailer row for:

- `Non-Reducible Loads -> ... -> Steering Trailers - Self/Remote`

So this data is second-sheet-only. It cannot be used safely for JSON mutation because:

- it has no first-sheet anchor
- it could be stale, broader than selection rules, or intended for some other validation path

The same issue exists for:

- `Weight Dim. rows 374-376`
  - `None -> Steering Trailers - Manned -> Booster`
- `Weight Dim. rows 380-382`
  - `None -> Steering Trailers - Self/Remote -> Booster`

### Unresolved XLS Rows Not Yet Modeled By The Updater

Only 3 rows remain here, and all are `steer-drive-wheelbase` rows:

- `Commodity row 122`
- `Commodity row 123`
- `Commodity row 124`

These are different from the booster-correlation sections above. The problem here is not cross-sheet matching. The problem is that the current JSON / `policyEngine` model has no place to store:

- `Steer`
- `Drive`
- `Wheelbase`

`Commodity row 123` is the simplest case:

- `None -> Truck Tractors -> Semi-Trailers`
- `Steer = Single`
- `Drive = Tandem`
- `Wheelbase = 6.2-7.2`
- `Can Add Booster = N`

Generated already exposes the direct semi-trailer option:

- `policyEngine.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC'])`
  includes `Semi-Trailers`

So row `123` may be suppressible if the business decision is:

- ignore these axle details for now

Rows `122` and `124` are harder because they conflict with broader direct rows that are already modeled:

- `Commodity row 88`
  - `Non-Reducible Loads -> Truck Tractors -> Semi-Trailers -> Y`
- `Commodity row 122`
  - same direct combo, but steer/drive/wheelbase-specific, `N`

- `Commodity row 114`
  - `Reducible Loads -> Truck Tractors -> Semi-Trailers -> Y`
- `Commodity row 124`
  - same direct combo, but steer/drive/wheelbase-specific, `N`

Current generated behavior follows the broader modeled rows:

- `policyEngine.getNextPermittableVehicles('STOW', 'NONREDU', ['TRKTRAC', 'SEMITRL'])`
  returns `['Boosters']`
- `policyEngine.getNextPermittableVehicles('STOW', 'REDUCBL', ['TRKTRAC', 'SEMITRL'])`
  returns `['Boosters']`

So rows `122` and `124` are true model-limit cases:

- they appear to narrow broader rows
- but the current model cannot express that narrowing

## Recommended SME Questions

1. When `Commodity` and `Weight Dim.` disagree on booster permission, should `Commodity` always win?
2. When `Weight Dim.` has booster rows with no direct `Commodity` row, should they be ignored or treated as missing workbook rows?
3. For `Commodity rows 122` and `124`, do the steer/drive/wheelbase-specific `N` rows narrow the broader `Y` rows (`88` and `114`)?
4. For first-sheet `Can Add Booster = Y` rows with no safe `Weight Dim.` corroboration, is first-sheet evidence alone sufficient for STOW?
5. Are `Steering Trailers - Manned` and `Steering Trailers - Self/Remote` intended to be selectable in STOW, or only represented elsewhere?
