/**
 * Special Authorizations Type
 * 
 * Defines special authorizations and exemptions for companies including
 * LCV (Long Combination Vehicle) allowances and fee exemptions.
 */

export type SpecialAuthorizations = {
  /** Company identifier */
  companyId: number;
  /** Whether LCV (Long Combination Vehicle) operations are allowed */
  isLcvAllowed: boolean;
  /** Type of fee exemption if applicable, null if no exemption */
  noFeeType: string | null;
};
