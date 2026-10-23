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

## Read the results

Each test title starts with the workbook cell that gives the expected weight, for example
`Trailer - Weight Dim. Sets!J42 | ...`. Open that cell to see the row.

At the end, each run prints a row summary:

```
XLS rows: 255 of 343 passing (74.3%) — all tests for a row must pass.
```

A row passes only when all of its tests pass.

Some failures are not engine problems. A row fails, with a message, when the tests
cannot read it without a guess. For example:

- `Unmapped spreadsheet vehicle` or `Unmapped spreadsheet trailer`: the workbook
  vehicle name is not in `power-units/vehicle-codes.ts` or `trailers/vehicle-codes.ts`.
- `Unsupported worksheet neighbour relationship`: `trailers/trailer-fixture.ts`
  does not know how to build the vehicle next to the trailer.
- `Reversed geometry range` or `Invalid geometry`: the workbook geometry cells are not valid.

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
