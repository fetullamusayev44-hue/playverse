import { supabase } from "./supabase";

// İstifadəçinin balansını oxu
export async function getUserBalance(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return 0;
  }

  return Number(data.balance);
}

// Bet qoy
export async function placeBet(userId: string, bet: number) {
  const balance = await getUserBalance(userId);

  if (balance < bet) {
    return {
      success: false,
      message: "Not enough balance",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      balance: balance - bet,
    })
    .eq("id", userId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
  };
}

// Pul əlavə et
export async function addBalance(
  userId: string,
  amount: number
) {
  const balance = await getUserBalance(userId);

  const { error } = await supabase
    .from("profiles")
    .update({
      balance: balance + amount,
    })
    .eq("id", userId);

  return !error;
}

// Pul çıx
export async function removeBalance(
  userId: string,
  amount: number
) {
  const balance = await getUserBalance(userId);

  if (balance < amount) return false;

  const { error } = await supabase
    .from("profiles")
    .update({
      balance: balance - amount,
    })
    .eq("id", userId);

  return !error;
}