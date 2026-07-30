import { supabase } from "./supabase";

export async function saveHighScore(
  userId: string,
  score: number
) {
  const { data } = await supabase
    .from("profiles")
    .select("high_score")
    .eq("id", userId)
    .single();

  if (!data) return;

  if (score > data.high_score) {
    await supabase
      .from("profiles")
      .update({
        high_score: score,
        xp: score * 2,
        coins: Math.floor(score / 5),
      })
      .eq("id", userId);
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}