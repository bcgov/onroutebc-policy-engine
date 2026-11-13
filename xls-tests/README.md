# XLS conformance tests

These tests compare the policy engine with the "Over Weight Dimension Set" workbook.

The business area keeps the axle weight rules in the workbook. Each workbook row
is one valid vehicle configuration, with its legal and permittable axle unit weights.
For each row, the tests build that configuration, run the policy engine, and
make sure that the engine gives the same weights as the workbook.

The tests do not change the engine. They only report where the engine and the
workbook are different.

## Get the workbook

The workbook is not in git (`*.xlsx` is in `.gitignore`). Get the latest
`Over Weight Dimension Set.xlsx` from the BSA team, and put it in this folder:

```
xls-tests/Over Weight Dimension Set.xlsx
```

To use a workbook at a different path, set `XLS_WORKBOOK`.

## Run the tests

The tests use [exceljs](https://www.npmjs.com/package/exceljs) to read the workbook.
It is a dev dependency, so `npm install` installs it. Apps that install the
policy engine package do not get it.

From the policy engine folder:

```
npm install
node xls-tests/power-unit-test.cjs
node xls-tests/trailer-test.cjs
```

Extra arguments go to Jest. For example, to run only the tests for one cell:

```
node xls-tests/trailer-test.cjs -t "J42 "
```

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `XLS_WORKBOOK` | `xls-tests/Over Weight Dimension Set.xlsx` | The workbook to read. |
| `XLS_INCLUDE_HIDDEN` | `false` | Set to `true` to also test hidden workbook rows. |

The normal `npm test` and `npm run build` do not include this folder.

## Run a row or a subset

Run these commands from the policy engine folder. `-t` matches a regular expression
against the full test name. Use single quotes to keep the shell from changing it.
The space after the row number prevents row 42 from also matching row 420.

```sh
# All weight tests for trailer row 42 (legal and permittable).
node xls-tests/trailer-test.cjs -t '![JK]42 ' --noStackTrace

# All weight tests for power unit row 90 (steer and drive, both checks).
node xls-tests/power-unit-test.cjs -t '![DEIJ]90 ' --noStackTrace

# Several trailer rows.
node xls-tests/trailer-test.cjs -t '![JK](42|43|50) ' --noStackTrace

# Trailer rows 40 through 49.
node xls-tests/trailer-test.cjs -t '![JK]4[0-9] ' --noStackTrace

# Only the legal weight cell in trailer row 42.
node xls-tests/trailer-test.cjs -t '!J42 ' --noStackTrace
```

A row filter includes all generated cases for that row. For trailers, these can
include several power units, neighbour axle types, and geometry endpoints.
To narrow the selection, copy values from a failure title. For example:

```sh
# One geometry endpoint, at the limit rather than 1 kg above it.
node xls-tests/trailer-test.cjs \
  -t '!J42 .*spreadCm=100 .*limit=17000 \+ 0 kg' --noStackTrace
```

This can still select several cases if they differ in other fields. Add fields
such as `powerUnit=...` or `neighbour=...` to narrow it further. Keep fields in
the order shown in the title and use `.*` between them. Escape regular expression
characters such as `+` when matching them literally.

`--noStackTrace` keeps error messages and assertion differences but removes stack
traces. Omit it when you need the failure location. Filters select test cases;
the workbook setup still runs. Hidden rows require `XLS_INCLUDE_HIDDEN=true`.

To run only the trailer fixture and geometry helper tests:

```sh
node xls-tests/trailer-test.cjs --runTestsByPath \
  xls-tests/trailers/trailer-fixture.spec.ts \
  xls-tests/trailers/source-geometry.spec.ts
```

## Read the results

Each test title starts with the workbook cell that gives the expected weight, for example
`Trailer - Weight Dim. Sets!J42 | ...`. Open that cell to see the row.

At the end, each run prints a row summary:

```
XLS rows: 255 of 343 passing (74.3%) — all tests for a row must pass.
```

A row passes only when all of its tests pass.

For a filtered run, use the Jest test counts, not the row percentage. The row
reporter still counts all included workbook rows, and skipped tests prevent a row
from passing. A low row percentage does not mean that all those rows were tested
and failed.

Some failures are not engine problems. A row fails, with a message, when the tests
cannot read it without a guess. For example:

- `Unmapped spreadsheet vehicle` or `Unmapped spreadsheet trailer`: the workbook
  vehicle name does not match `POWER_UNITS` or `TRAILERS`, or an explicit workbook
  alias in `helpers/getPowerUnitCode.helper.ts` or `helpers/getTrailerCode.helper.ts`.
- `Unsupported worksheet neighbour relationship`: `trailers/trailer-fixture.ts`
  does not know how to build the vehicle next to the trailer.
- `Reversed geometry range` or `Invalid geometry`: the workbook geometry cells are not valid.

## Trace a failure to its cause

Start with one row, then narrow it to one case if necessary. Many failed cases
can have the same cause. The test flow is:

Workbook row → name mapping and geometry → vehicle/axle fixture → policy check
→ expected-result comparison.

| Failure | Check first |
| --- | --- |
| Unmapped vehicle or trailer | The workbook name and the relevant lookup helper in `helpers/`. The weight check has not run yet. |
| Invalid geometry or unsupported neighbour relationship | The workbook values, `trailers/source-geometry.ts`, and `trailers/trailer-fixture.ts`. |
| Wrong `actualWeight` or axle unit | The generated axle configuration and the target axle index. |
| Wrong `thresholdWeight` | The fixture inputs, commodity, policy data, and weight selection. |
| Correct threshold but wrong Pass/Warning/Fail | The check logic, including restrictions and boundary handling. |

For example, if four cases for one cell report `Unmapped spreadsheet trailer`,
first resolve that name mapping. Four failures do not establish four separate
engine defects. Confirm the intended vehicle type before adding a mapping.

For a weight mismatch:

1. Open `trailers/trailer-weight-limits.spec.ts` or
   `power-units/power-unit-weight-limits.spec.ts`. Find the call to `check(...)`.
2. Use a debugger or temporary logging to inspect the vehicle codes, axle
   configuration, commodity ID, target axle index, and result for that axle.
   Confirm that these inputs represent the workbook row. Only the axle unit
   under test carries weight.
3. If the inputs are correct, follow `CheckLegalWeight` or
   `CheckPermittableWeight` in `src/helper/policy-check.helper.ts`.
4. Follow `getApplicableAxleWeight` in `src/policy-engine.ts`. It tries
   commodity-specific weights, then default weights. Inspect
   `selectCorrectWeightDimension` to see which entry matches the configuration.
   For permittable weights, also inspect `getApplicablePermittableWeightThreshold`
   in the check helper: it contains fallback rules.
5. Compare the selected rule with the workbook limit. A mismatch alone does not
   establish whether the workbook, fixture, policy data, or engine is wrong.
   Confirm the intended rule, make the correction, and rerun the isolated case,
   the whole row, and then the relevant suite. Remove temporary logging.

These tests run engine source, but load policy data from
`src/_test/policy-config/_current-config.json`. If you change the TypeScript
configuration, run `npm run export:config` before rerunning the tests. A source
change to the engine itself does not require a build.

## How the tests work

1. Before the tests start, a Jest `globalSetup` file reads the workbook rows:
   `power-units/load-power-unit-rows.cjs` or `trailers/load-trailer-rows.cjs`.
   It first makes sure that the column headers are as expected. If a column moved,
   the run stops. This prevents the tests from reading the wrong column.
2. The spec file makes test cases from each row, and runs `CheckLegalWeight` and
   `CheckPermittableWeight` from the policy engine.
3. Each test puts weight on only one axle unit. It tests two weights:
   - At the workbook limit: the result must be Pass.
   - 1 kg above the limit: the result must be Warning (legal) or Fail (permittable).

   The engine threshold must also be equal to the workbook limit.

### Power units (`Power Unit  - Weight Dim. Sets`)

| Column | Use |
| --- | --- |
| A | Commodity |
| B | Power unit |
| C, H | Steer and drive axle unit types |
| D, E | Steer legal and permittable limits (expected) |
| I, J | Drive legal and permittable limits (expected) |

Each row gives 8 tests: 2 checks x 2 axle units x 2 weights.

### Trailers (`Trailer - Weight Dim. Sets`)

| Column | Use |
| --- | --- |
| B | Commodity |
| D, E | Trailer and its axle unit type |
| F, G | The trailer is before (F) or after (G) its neighbour |
| H, I | The neighbour category and axle type |
| J, K | Legal and permittable limits (expected) |
| L to O | Axle unit spread and inter-axle spacing (found by header) |

One row can give many tests. There is one test for each combination of power unit,
neighbour axle type (`All` gives Single, Tandem, and Tridem), and geometry endpoint
(each min and max value). See `getTestCases` in `trailers/trailer-weight-limits.spec.ts`.

`trailers/trailer-fixture.spec.ts` and `trailers/source-geometry.spec.ts` are unit
tests for the helpers that build the trailer test cases.

## What the tests do not check

- Power unit spread, spacing, and wheelbase (columns F, G, and K to P). The current
  power unit weights in the policy JSON do not use them.
- Trailer axle group columns (P to V), for example 7.16g, Table 7.17, and the bridge formula.
- Geometry values between or outside the min and max. The tests use only the endpoints.
- Other workbook sheets, for example "Commodity to Power to Trailer".
