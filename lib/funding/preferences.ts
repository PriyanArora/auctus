import type {
  ClearFundingPreferences,
  GetFundingPreferences,
  UpsertFundingPreferences,
} from "@contracts/funding";
import { createFundingReadClient } from "./supabase";

export const getFundingPreferences: GetFundingPreferences = async (
  user_id,
  role,
) => {
  const supabase = await createFundingReadClient();
  const { data, error } = await supabase
    .from("funding_preferences")
    .select("*")
    .eq("user_id", user_id)
    .eq("role", role)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const upsertFundingPreferences: UpsertFundingPreferences = async (
  preferences,
) => {
  const supabase = await createFundingReadClient();
  const { data, error } = await supabase
    .from("funding_preferences")
    .upsert(preferences, { onConflict: "user_id,role" })
    .select("*")
    .single();

  if (error) throw error;

  return data;
};

export const clearFundingPreferences: ClearFundingPreferences = async (
  user_id,
  role,
) => {
  const supabase = await createFundingReadClient();
  const { error } = await supabase
    .from("funding_preferences")
    .delete()
    .eq("user_id", user_id)
    .eq("role", role);

  if (error) throw error;
};
