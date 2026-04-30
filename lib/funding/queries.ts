import type {
  FundingItem,
  FundingQuery,
  FundingSummary,
  GetFundingById as GetFundingByIdContract,
  GetFundingSummariesForUser as GetFundingSummariesForUserContract,
  ListFundingForRole as ListFundingForRoleContract,
} from "@contracts/funding";
import { createFundingReadClient } from "./supabase";
import { getFundingTypeForRole } from "./role-mapping";
import { getSession } from "@/lib/session/get-session";

function toFundingSummary(item: FundingItem): FundingSummary {
  return {
    id: item.id,
    type: item.type,
    name: item.name,
    provider: item.provider,
    amount_max: item.amount_max,
    deadline: item.deadline,
    match_score: null,
  };
}

export const ListFundingForRole: ListFundingForRoleContract = async (
  query: FundingQuery,
) => {
  const supabase = await createFundingReadClient();
  let request = supabase
    .from("funding")
    .select("*")
    .eq("type", getFundingTypeForRole(query.role))
    .eq("status", query.status ?? "active")
    .order("created_at", { ascending: false });

  if (query.category) {
    request = request.eq("category", query.category);
  }

  if (query.search) {
    request = request.or(
      `name.ilike.%${query.search}%,provider.ilike.%${query.search}%,description.ilike.%${query.search}%`,
    );
  }

  if (query.limit) {
    const offset = query.offset ?? 0;
    request = request.range(offset, offset + query.limit - 1);
  }

  const { data, error } = await request;

  if (error) throw error;

  return (data ?? []) as FundingItem[];
};

export const GetFundingById: GetFundingByIdContract = async (id) => {
  const supabase = await createFundingReadClient();
  const { data, error } = await supabase
    .from("funding")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data as FundingItem | null;
};

export const GetFundingSummariesForUser: GetFundingSummariesForUserContract = async (
  user_id,
  limit = 5,
) => {
  const session = await getSession();

  if (!session || session.user_id !== user_id || !session.role) {
    return [];
  }

  const items = await ListFundingForRole({
    role: session.role,
    status: "active",
    limit,
  });

  return items.map(toFundingSummary);
};
