import { supabase } from "./supabase";
import { getCurrentUser } from "./game";

export async function isAdmin() {
  const user = await getCurrentUser();

  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role === "admin";
}