import { PolicyCheckId, PolicyCheckResultType } from '../../enum';
import { calculateOverload } from '../../helper/overload.helper';
import { AxleGroupPolicyCheckResult } from '../../types';

const overloadSource = (
  id: PolicyCheckId,
  startAxleUnit: number,
  endAxleUnit: number,
  actualWeight: number,
  thresholdWeight: number,
): AxleGroupPolicyCheckResult => ({
  id,
  result:
    id === PolicyCheckId.LegalWeight
      ? PolicyCheckResultType.Warning
      : PolicyCheckResultType.Fail,
  message: '',
  startAxleUnit,
  endAxleUnit,
  actualWeight,
  thresholdWeight,
});

describe('ORV2-5899 overload calculation details', () => {
  it('returns no details when no overload is present', () => {
    expect(calculateOverload([], 35000, 35000, 3)).toEqual({
      overload: 0,
      overloadDetails: [],
    });
  });

  it('ignores overload sources without a positive legal maximum', () => {
    expect(
      calculateOverload(
        [overloadSource(PolicyCheckId.LegalWeight, 1, 1, 2000, 0)],
        2000,
        2000,
        1,
      ),
    ).toEqual({
      overload: 0,
      overloadDetails: [],
    });
  });

  it('selects licensed GVW details when they exceed the axle overload', () => {
    expect(
      calculateOverload(
        [overloadSource(PolicyCheckId.LegalWeight, 3, 3, 23000, 17000)],
        52000,
        35000,
        3,
      ),
    ).toEqual({
      overload: 17000,
      overloadDetails: [
        {
          kind: 'licensed-gvw',
          startAxleUnit: 1,
          endAxleUnit: 3,
          licensedGVW: 35000,
          totalGCVW: 52000,
          overload: 17000,
        },
      ],
    });
  });

  it('selects the maximum non-overlapping combination of axle overloads', () => {
    const result = calculateOverload(
      [
        overloadSource(PolicyCheckId.LegalWeight, 1, 1, 7560, 7300),
        overloadSource(PolicyCheckId.LegalWeight, 2, 2, 28000, 24000),
        overloadSource(PolicyCheckId.LegalWeight, 3, 3, 26000, 24000),
        overloadSource(
          PolicyCheckId.AxleGroupMaximumLegalWeightThreshold,
          3,
          4,
          35100,
          31000,
        ),
      ],
      70660,
      100000,
      4,
    );

    expect(result.overload).toBe(8360);
    expect(result.overloadDetails).toEqual([
      expect.objectContaining({ startAxleUnit: 1, endAxleUnit: 1, overload: 260 }),
      expect.objectContaining({ startAxleUnit: 2, endAxleUnit: 2, overload: 4000 }),
      expect.objectContaining({ startAxleUnit: 3, endAxleUnit: 4, overload: 4100 }),
    ]);
  });

  it('prefers individual axle rows when an overlapping group ties their total', () => {
    const result = calculateOverload(
      [
        overloadSource(PolicyCheckId.LegalWeight, 2, 2, 18000, 17000),
        overloadSource(PolicyCheckId.LegalWeight, 3, 3, 10000, 9000),
        overloadSource(
          PolicyCheckId.AxleGroupMaximumLegalWeightThreshold,
          2,
          3,
          28000,
          26000,
        ),
      ],
      34000,
      100000,
      3,
    );

    expect(result.overloadDetails).toEqual([
      expect.objectContaining({ startAxleUnit: 2, endAxleUnit: 2 }),
      expect.objectContaining({ startAxleUnit: 3, endAxleUnit: 3 }),
    ]);
  });

  it('prefers licensed GVW when it ties the selected axle total', () => {
    const result = calculateOverload(
      [overloadSource(PolicyCheckId.LegalWeight, 2, 2, 18000, 17000)],
      41000,
      40000,
      2,
    );

    expect(result.overloadDetails).toEqual([
      expect.objectContaining({ kind: 'licensed-gvw', overload: 1000 }),
    ]);
  });
});
