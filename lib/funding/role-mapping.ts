import type { FundingType } from "@contracts/funding";
import type { Role } from "@contracts/role";

export const ROLE_FUNDING_TYPE: Record<Role, FundingType> = {
  business: "business_grant",
  student: "scholarship",
  professor: "research_grant",
};

export const ROLE_FUNDING_ROUTE: Record<Role, string> = {
  business: "/grants",
  student: "/scholarships",
  professor: "/research-funding",
};

export function getFundingTypeForRole(role: Role): FundingType {
  return ROLE_FUNDING_TYPE[role];
}
