# STOW Work Completed

This note summarizes how much more complete the generated STOW config is than `main`.

Baseline used for all comparisons in this document:

- `git show main:src/_test/policy-config/_current-config.json`

This intentionally uses `main` instead of the current worktree copy of `_current-config.json`, because the local canonical file currently has an unrelated `conditions` diff that is not part of the XLS scraper work.

## High-Level Delta

Generated is materially ahead of `main` for STOW.

- The generated STOW audit has:
  - `Missing Direct Power Units`: none
  - `Missing Direct Trailers`: none
  - `Missing Boosters`: none
- All STOW deltas relative to `main` are additive.
- No STOW surface removals were introduced.

## JSON-Level Delta vs `main`

- `21` brand-new trailer objects added
- `48` existing trailer objects gained `weightPermittable: true`
- `1` existing trailer object gained `booster: true`
- `0` trailer objects removed
- `0` `weightPermittable` removals
- `0` `booster` removals

The one direct `booster: true` flip relative to `main` is:

- `BRGBEAM:TRKTRAC:POLETRL`
  - sourced from `Commodity row 51`

## STOW policyEngine Delta vs `main`

### Default runtime surface

Relative to `main`, generated adds:

- `+7` commodities from `policyEngine.getCommodities('STOW')`
- `+16` commodity/power-unit pairs from `policyEngine.getPermittablePowerUnitTypes('STOW', commodityId)`
- `+74` direct trailer options from `policyEngine.getNextPermittableVehicles('STOW', commodityId, [powerUnitId])`
- `+92` next-step options from `policyEngine.getNextPermittableVehicles('STOW', commodityId, [powerUnitId, trailerId])`

Relative to `main`, generated removes:

- `0` commodities
- `0` commodity/power-unit pairs
- `0` direct trailer options
- `0` next-step options

### LCV-authorized surface

With `isLcvAllowed = true`, generated adds:

- `+18` commodity/power-unit pairs
- `+76` direct trailer options
- `+92` next-step options

Relative to `main`, generated removes:

- `0` commodity/power-unit pairs
- `0` direct trailer options
- `0` next-step options

### Added STOW commodities

Generated exposes these 7 commodities for STOW that are not exposed on `main`:

- `IMCONWS` — Intermodal Containers without Sides
- `MFHOMEL` — Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW)
- `REDUCBL` — Reducible Loads
- `SCRAPER` — Scraper on Dollies
- `TOWDISB` — Tow Trucks and Disabled Vehicles
- `BRGBEAM` — Bridge Beams
- `FIXEDEQ` — Fixed Equipment

## Public API Impact

The main affected policy APIs are:

- `policyEngine.getCommodities('STOW')`
- `policyEngine.getPermittablePowerUnitTypes('STOW', commodityId)`
- `policyEngine.getNextPermittableVehicles('STOW', commodityId, [powerUnitId])`
- `policyEngine.getNextPermittableVehicles('STOW', commodityId, [powerUnitId, trailerId])`
- indirectly `policyEngine.isConfigurationValid(...)`
- indirectly `policyEngine.validate(...)`

Most of the growth is in:

- direct STOW power-unit and trailer visibility
- next-step reachability after those direct paths become available

That last point matters. A large part of the `+92` next-step growth is not “new data added from scratch.” It is previously configured downstream behavior becoming reachable because the missing direct STOW path now exists.

## Where The Additions Came From In XLS

### New STOW commodity visibility

- `Tow Trucks and Disabled Vehicles`
  - direct source: `Commodity row 49`
- `Bridge Beams`
  - direct source: `Commodity row 51`
- `Fixed Equipment`
  - direct sources: `Commodity rows 66-70, 72, 125-127`
- `Intermodal Containers without Sides`
  - direct source: `Commodity row 75`
- `Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW)`
  - direct sources: `Commodity rows 81, 83, 84`
  - related rows already represented elsewhere:
    - `Commodity row 82` is a jeep row
    - `Commodity row 85` is a standalone booster row
- `Reducible Loads`
  - direct sources: `Commodity rows 114-118, 134, 136`
- `Scrapers on Dollies`
  - direct source: `Commodity row 120`

### Important `None` additions

- `None -> Picker Trucks`
  - direct source: `Commodity row 47`
- `None -> Rubber-Tired Loaders`
  - direct source: `Commodity row 137`
- `None -> Municipal Fire Trucks`
  - direct source: `Commodity row 138`
- `None -> Truck Tractors -> Semi-Trailers`
  - direct source: `Commodity row 123`

### Large expansion groups that drive the trailer and next-step growth

- `Empty`
  - direct sources: `Commodity rows 16, 18, 20-27, 45, 53, 55-64, 133`
- `Non-Reducible Loads`
  - direct sources: `Commodity rows 30-38, 46, 88-96, 128-129`
- `Fixed Equipment`
  - direct sources: `Commodity rows 66-70, 72, 125-127`
- `None`
  - direct sources: `Commodity rows 47, 100-106, 123, 130-138`

### New STOW commodity/power-unit pairs vs `main`

Generated adds these `commodity -> power unit` STOW pairs relative to `main`:

- `None -> Municipal Fire Trucks`
- `None -> Picker Trucks`
- `None -> Rubber-Tired Loaders`
- `Intermodal Containers without Sides -> Truck Tractors`
- `Manufactured Homes... (> 5.0 m OAW) -> Truck Tractors`
- `Reducible Loads -> Truck Tractors`
- `Reducible Loads -> Trucks`
- `Scraper on Dollies -> Truck Tractors`
- `Tow Trucks and Disabled Vehicles -> Tow Vehicles`
- `Empty -> Picker Trucks`
- `Empty -> Truck Tractors`
- `Empty -> Trucks`
- `Bridge Beams -> Truck Tractors`
- `Non-Reducible Loads -> Picker Trucks`
- `Fixed Equipment -> Truck Tractors`
- `Fixed Equipment -> Trucks`

With LCV auth enabled, two more pairs become visible:

- `None -> Long Combination Vehicles (LCV) - Rocky Mountain Doubles`
- `None -> Long Combination Vehicles (LCV) - Turnpike Doubles`

## Useful Breakdown Numbers

Of the `+92` added next-step STOW options:

- `47` are `Boosters`
- `7` are `Jeeps`
- the remaining `38` are other downstream trailer / next-step options that became reachable after the new direct STOW paths were added

Breakdown of the non-booster / non-jeep additions:

- `Semi-Trailers - Single Drop, Double Drop, Step Decks, Lowbed, Expandos, etc.`: `6`
- `Semi-Trailers - Hiboys/Expandos`: `5`
- `Semi-Trailers - Hiboys/Flat Decks`: `4`
- `Semi-Trailers - Wheelers`: `4`
- `Semi-Trailers - Wide Wheelers`: `4`
- `Semi-Trailers with Crane`: `3`
- `Semi-Trailers`: `2`
- and `1` each for:
  - `Dollies`
  - `Oil and Gas - Oversize Oilfield Flat Deck Semi-Trailers`
  - `Platform Trailers`
  - `Pole Trailers`
  - `Semi-Trailers - Steering Trailers`
  - `Fixed Equipment - Conveyors`
  - `Fixed Equipment - Counter Flow Asphalt Drum Mixers`
  - `Fixed Equipment - Portable Asphalt Baghouses`
  - `Fixed Equipment - Semi-Trailers`
  - `Fixed Equipment - Wheeler Semi-Trailers`

Important nuance:

- `+74` direct trailer additions are a mix of:
  - true new direct XLS-backed STOW trailer paths
  - and already-configured legacy downstream options that became reachable once missing `commodity -> power unit` pairs were added

## Current Jeep / Booster Status

The STOW-wide missing report is now much cleaner than it was earlier in this branch.

Current generated `audit:stow-missing` status:

- standalone jeep rows are **not** a STOW-wide unresolved item anymore
- standalone booster rows are **not** a STOW-wide unresolved item anymore
- `Missing Boosters` is currently `None`

That means the earlier jeep / standalone booster false positives have already been resolved in the audit layer.

What remains in the booster-related sections is different:

- `Direct Booster Rows Without Safe Placement Detail`
- `Ambiguous Trailer Weight Booster Rows`
- `Contradictory Trailer Weight Booster Rows`
- `Unmatched Trailer Weight Booster Rows`

Those sections are not reporting missing policy behavior. They are reporting:

- places where the first sheet already drives booster behavior, but the second sheet does not safely corroborate it
- or places where the two sheets conflict
- or places where `Weight Dim.` has rows with no first-sheet anchor

So the current branch has already done the old “missing jeep / missing standalone booster” cleanup. The remaining work is second-sheet correlation and model-limit work, not the old STOW visibility problem.

## Completed In This Branch

- [x] Added generated-preview workflow so XLS output can be reviewed before apply
- [x] Added `revert-json` to restore generated/backend preview state from canonical
- [x] Added `test:generated` so Jest can run against generated config without applying it
- [x] Added `audit:commodity` for XLS-vs-policy inspection by commodity
- [x] Added `audit:stow-missing` for consolidated STOW gap reporting
- [x] Fixed missing direct STOW commodity/power-unit/trailer visibility from the XLS primary sheet
- [x] Normalized the hidden-column anomaly for rows 137-138 so Rubber-Tired Loaders and Municipal Fire Trucks are represented
- [x] Cleaned LCV handling in audit so LCV rows are compared against the authorized policy surface
- [x] Removed standalone booster false positives from the STOW-wide missing report
- [x] Removed standalone jeep false positives from the STOW-wide missing report
- [x] Removed force-submit false positives from the STOW-wide missing report
- [x] Tightened booster correlation so second-sheet data does not create behavior without first-sheet support
- [x] Documented remaining unresolved STOW work in `remaining-work.md`

## Still Open

- [ ] Resolve steer/drive/wheelbase rows `122-124`, or explicitly suppress them with SME sign-off
- [ ] Resolve ambiguous `Weight Dim.` booster groups with SME precedence
- [ ] Resolve contradictory `Weight Dim.` booster groups with SME direction
- [ ] Resolve unmatched `Weight Dim.` steering-trailer rows, or confirm they should remain ignored

## How These Numbers Were Derived

These numbers come from:

- diffing generated trailer objects vs `main`
- diffing the STOW `policyEngine` surface between generated and `main`
- current generated `audit:stow-missing`

Source commands used for the baseline and current audit:

```bash
git show main:src/_test/policy-config/_current-config.json
cd src/_tools/xls-scraper && npm run audit:stow-missing -- --compare-config=generated
```

The counts in this note do not rely on the current worktree copy of `_current-config.json`.
