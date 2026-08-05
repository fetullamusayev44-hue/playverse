import { supabase } from "./supabase";

export async function getWallets() {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .order("coin");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function updateWallet(
  id: string,
  address: string
) {
  const { error } = await supabase
    .from("wallets")
    .update({ address })
    .eq("id", id);

  if (error) console.error(error);
}