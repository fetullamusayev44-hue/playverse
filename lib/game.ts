import { supabase } from "./supabase";

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}

export async function getBalance(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return 0;

  return data.balance ?? 0;
}

export async function updateBalance(balance: number) {
  const user = await getCurrentUser();

  if (!user) return;

  await supabase
    .from("profiles")
    .update({
      balance,
    })
    .eq("id", user.id);
}

export async function placeBet(userId: string, bet: number) {
  const balance = await getBalance(userId);

  if (balance < bet) {
    return {
      success: false,
      message: "Not enough balance",
    };
  }

  await supabase
    .from("profiles")
    .update({
      balance: balance - bet,
    })
    .eq("id", userId);

  return {
    success: true,
  };
}

export async function rewardPlayer(
  userId: string,
  amount: number
) {
  const { data } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", userId)
    .maybeSingle();

  if (!data) return;

  await supabase
    .from("profiles")
    .update({
      balance: data.balance + amount,
    })
    .eq("id", userId);
}

export async function saveGame(
  userId: string,
  score: number
) {
  const { data } = await supabase
    .from("profiles")
    .select("xp,coins,level,high_score,games_played")
    .eq("id", userId)
    .maybeSingle();

  if (!data) return;

  const xpEarned = score * 2;
  const coinsEarned = Math.floor(score / 5);

  const newXP = data.xp + xpEarned;
  const newCoins = data.coins + coinsEarned;
  const newGames = data.games_played + 1;
  const newLevel = Math.floor(newXP / 100) + 1;

  await supabase
    .from("profiles")
    .update({
      xp: newXP,
      coins: newCoins,
      games_played: newGames,
      level: newLevel,
      high_score:
        score > data.high_score
          ? score
          : data.high_score,
    })
    .eq("id", userId);
}