export type PermitConditionDefinition = {
  description: string;
  condition: string;
  conditionLink: string;
};

export type ConditionRequirement = {
  condition: string;
  mandatory?: boolean;
};

export type ConditionForPermit = PermitConditionDefinition &
  ConditionRequirement;
