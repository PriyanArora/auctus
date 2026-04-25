// STATUS: DRAFT (LOCKED at V2.P1 completion gate)
// Owner: Dev A
//
// Profile shapes consumed by Dev B for funding matching.
// Dev B's matching logic reads only these fields. Any field Dev B's matcher needs
// MUST appear here; otherwise add it via the contract change protocol.

import type { Role } from "./role";

export interface Profile {
  id: string; // UUID, references Supabase auth.users(id)
  role: Role;
  display_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string; // ISO timestamp
  updated_at: string;
}

export interface BusinessProfile {
  id: string; // FK -> Profile.id
  business_name: string;
  industry: string | null;
  location: string | null; // free-form for now; province-normalization TBD by Dev B in matching
  revenue: number | null; // CAD, annual
  employees: number | null;
  description: string | null;
  year_established: number | null;
  website: string | null;
}

export interface StudentProfile {
  id: string;
  education_level:
    | "high_school"
    | "college"
    | "undergrad"
    | "masters"
    | "phd"
    | null;
  field_of_study: string | null;
  institution: string | null;
  province: string | null;
  gpa: number | null;
  graduation_year: number | null;
}

export interface ProfessorProfile {
  id: string;
  institution: string | null;
  department: string | null;
  research_area: string | null;
  career_stage: "early" | "mid" | "senior" | "emeritus" | null;
  h_index: number | null;
  research_keywords: string[];
}

// Discriminated view that Dev B's matcher receives.
// Dev A's queries should return one of these shapes per signed-in user.
export type RoleProfile =
  | { role: "business"; base: Profile; details: BusinessProfile }
  | { role: "student"; base: Profile; details: StudentProfile }
  | { role: "professor"; base: Profile; details: ProfessorProfile };
