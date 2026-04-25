// STATUS: DRAFT (LOCKED at V2.P1 completion gate)
// Owner: Dev B
//
// Funding shapes consumed by Dev A for dashboard tiles, landing teasers, and forum cross-links.
// Dev A must NOT query the funding tables directly; consume the published query helpers.

import type { Role } from "./role";

export type FundingType = "business_grant" | "scholarship" | "research_grant";

export type FundingStatus = "active" | "expired" | "archived";

export interface FundingItem {
  id: string; // UUID
  type: FundingType;
  name: string;
  description: string | null;
  provider: string;
  amount_min: number | null; // CAD
  amount_max: number | null; // CAD
  deadline: string | null; // ISO date, null = rolling/ongoing
  application_url: string | null;
  source_url: string | null;
  eligibility: Record<string, unknown>; // JSONB; role-specific shape, opaque to Dev A
  requirements: string[];
  category: string | null;
  tags: string[];
  source: "scraped" | "manual";
  scraped_from: string | null;
  scraped_at: string | null;
  status: FundingStatus;
  created_at: string;
  updated_at: string;
}

// Compact shape Dev A renders in dashboard tiles, navbar badges, landing teasers.
// Excludes heavy fields (description, eligibility) so Dev A's queries stay cheap.
export interface FundingSummary {
  id: string;
  type: FundingType;
  name: string;
  provider: string;
  amount_max: number | null;
  deadline: string | null;
  match_score: number | null; // 0-100, null if profile insufficient to score
}

// Filter shape used by Dev B's listing pages and any dashboard query.
// Role is required: matching and visibility both depend on it.
export interface FundingQuery {
  role: Role;
  status?: FundingStatus; // default 'active'
  category?: string;
  min_match_score?: number; // 0-100
  search?: string;
  limit?: number;
  offset?: number;
}

// Function signatures Dev B publishes from `lib/funding/queries.ts`.
// These are the ONLY funding entry points Dev A may import.
export type ListFundingForRole = (
  query: FundingQuery,
) => Promise<FundingItem[]>;

export type GetFundingSummariesForUser = (
  user_id: string,
  limit?: number,
) => Promise<FundingSummary[]>;

export type GetFundingById = (id: string) => Promise<FundingItem | null>;
