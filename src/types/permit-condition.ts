export type PermitCondition = {
  description: string;
  condition: string;
  conditionLink: string;
};

export type ConditionRequirement = {
  condition: string;
  mandatory?: boolean;
};

export type ConditionForPermit = PermitCondition & ConditionRequirement;