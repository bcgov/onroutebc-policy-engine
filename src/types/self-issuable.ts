/**
 * Self Issuable Type
 * 
 * Defines the capability for self-issuance of permits or other documents.
 * Used as a base type for objects that can be self-issued.
 */

export type SelfIssuable = {
  /** Whether this object can be self-issued */
  selfIssue?: boolean;
};
