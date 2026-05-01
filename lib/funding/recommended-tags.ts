import type { Role } from "@contracts/role";
import { getSession } from "@/lib/session/get-session";
import { getProfileMatchTags } from "@/lib/profile/queries";
import { FUNDING_FILTERS } from "./filter-definitions";

export async function getRecommendedFundingTags(role: Role) {
  const session = await getSession();

  if (!session?.user_id || session.role !== role) {
    return [];
  }

  const profileTags = await getProfileMatchTags(session.user_id);
  const categoryOptions =
    FUNDING_FILTERS[role]
      .find((filter) => filter.key === "category")
      ?.options?.map((option) => option.value) ?? [];
  const allowed = new Set(categoryOptions.map((tag) => tag.toLowerCase()));

  return profileTags.filter((tag) => allowed.has(tag.toLowerCase()));
}
