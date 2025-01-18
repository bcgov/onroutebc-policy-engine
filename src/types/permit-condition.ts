export type PermitCondition = {
  description: string;
  condition: string;
  conditionLink: string;
};

export type ConditionForPermitType = {
  condition: string;
  mandatory?: boolean;
};