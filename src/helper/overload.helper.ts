import {
  OverloadCalculationDetailKind,
  PolicyCheckId,
  PolicyCheckResultType,
} from '../enum';
import {
  AxleGroupPolicyCheckResult,
  AxleWeightOverloadCalculationDetail,
  OverloadCalculationDetail,
} from '../types';

type AxleSelection = {
  details: Array<AxleWeightOverloadCalculationDetail>;
  overload: number;
  individualCount: number;
};

const EMPTY_SELECTION: AxleSelection = {
  details: [],
  overload: 0,
  individualCount: 0,
};

const compareSelections = (
  first: AxleSelection,
  second: AxleSelection,
): AxleSelection => {
  if (first.overload !== second.overload) {
    return first.overload > second.overload ? first : second;
  }

  if (first.individualCount !== second.individualCount) {
    return first.individualCount > second.individualCount ? first : second;
  }

  // Keep output deterministic when equivalent policy checks are reordered.
  const firstKey = first.details
    .map(({ startAxleUnit, endAxleUnit }) => `${startAxleUnit}:${endAxleUnit}`)
    .join('|');
  const secondKey = second.details
    .map(({ startAxleUnit, endAxleUnit }) => `${startAxleUnit}:${endAxleUnit}`)
    .join('|');
  return firstKey <= secondKey ? first : second;
};

const getAxleOverloadCandidates = (
  results: Array<AxleGroupPolicyCheckResult>,
): Array<AxleWeightOverloadCalculationDetail> =>
  results
    .filter(
      ({ id, result, actualWeight, thresholdWeight }) =>
        ((id === PolicyCheckId.LegalWeight &&
          result === PolicyCheckResultType.Warning) ||
          (id === PolicyCheckId.AxleGroupMaximumLegalWeightThreshold &&
            result === PolicyCheckResultType.Fail)) &&
        Number.isFinite(actualWeight) &&
        Number.isFinite(thresholdWeight) &&
        (thresholdWeight as number) > 0 &&
        (actualWeight as number) > (thresholdWeight as number),
    )
    .map<AxleWeightOverloadCalculationDetail>(
      ({ startAxleUnit, endAxleUnit, actualWeight, thresholdWeight }) => ({
        kind: OverloadCalculationDetailKind.AxleWeight,
        startAxleUnit,
        endAxleUnit,
        actualWeight: actualWeight as number,
        legalMaxWeight: thresholdWeight as number,
        overload: (actualWeight as number) - (thresholdWeight as number),
      }),
    )
    .sort(
      (first, second) =>
        first.endAxleUnit - second.endAxleUnit ||
        first.startAxleUnit - second.startAxleUnit,
    );

const selectAxleOverloadDetails = (
  candidates: Array<AxleWeightOverloadCalculationDetail>,
): AxleSelection => {
  const bestThroughCandidate = new Array<AxleSelection>(candidates.length + 1);
  bestThroughCandidate[0] = EMPTY_SELECTION;

  candidates.forEach((candidate, candidateIndex) => {
    let predecessorIndex = candidateIndex - 1;
    while (
      predecessorIndex >= 0 &&
      candidates[predecessorIndex].endAxleUnit >= candidate.startAxleUnit
    ) {
      predecessorIndex--;
    }

    const predecessor = bestThroughCandidate[predecessorIndex + 1];
    const withCandidate: AxleSelection = {
      details: [...predecessor.details, candidate],
      overload: predecessor.overload + candidate.overload,
      individualCount:
        predecessor.individualCount +
        Number(candidate.startAxleUnit === candidate.endAxleUnit),
    };

    bestThroughCandidate[candidateIndex + 1] = compareSelections(
      bestThroughCandidate[candidateIndex],
      withCandidate,
    );
  });

  return bestThroughCandidate[candidates.length];
};

export const calculateOverload = (
  results: Array<AxleGroupPolicyCheckResult>,
  totalGCVW: number,
  licensedGVW: number,
  axleUnitCount: number,
): { overload: number; overloadDetails: Array<OverloadCalculationDetail> } => {
  const axleSelection = selectAxleOverloadDetails(
    getAxleOverloadCandidates(results),
  );
  const licensedGvwOverload = Math.max(0, totalGCVW - licensedGVW);

  // Licensed GVW intentionally wins an exact tie with the axle calculation. We have
  // to pick one, so this one made sense.
  if (licensedGvwOverload > 0 && licensedGvwOverload >= axleSelection.overload) {
    return {
      overload: licensedGvwOverload,
      overloadDetails: [
        {
          kind: OverloadCalculationDetailKind.LicensedGvw,
          startAxleUnit: 1,
          endAxleUnit: axleUnitCount,
          licensedGVW,
          totalGCVW,
          overload: licensedGvwOverload,
        },
      ],
    };
  }

  return {
    overload: axleSelection.overload,
    overloadDetails: axleSelection.details,
  };
};
