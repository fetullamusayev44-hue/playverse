import { supabase } from "./supabase";

export async function createDeposit(
  userId: string,
  coin: string,
  amount: number,
  txid: string
) {
  const { error } = await supabase
    .from("deposits")
    .insert({
      user_id: userId,
      coin,
      amount,
      txid,
      status: "pending",
    });

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function getDeposits() {
  const { data, error } = await supabase
    .from("deposits")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function approveDeposit(
  id: string
) {
  const { error } = await supabase
    .from("deposits")
    .update({
      status: "approved",
    })
    .eq("id", id);

  if (error) console.error(error);
}

export async function rejectDeposit(
  id: string
) {
  const { error } = await supabase
    .from("deposits")
    .update({
      status: "rejected",
    })
    .eq("id", id);

  if (error) console.error(error);
}