import { supabase } from "./supabase";

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Current User:", user);

  return user;
}

export async function saveGame(userId: string, score: number) {
  console.log("saveGame başladı");
  console.log("User ID:", userId);
  console.log("Score:", score);

  const { data, error } = await supabase
    .from("profiles")
    .select("xp, coins, level, high_score, games_played")
    .eq("id", userId)
    .single();

  console.log("SELECT nəticəsi:", data);
  console.log("SELECT xətası:", error);

  if (error || !data) return;

  const xpEarned = score * 2;
  const coinsEarned = Math.floor(score / 5);

  const newXP = data.xp + xpEarned;
  const newCoins = data.coins + coinsEarned;
  const newGamesPlayed = data.games_played + 1;
  const newLevel = Math.floor(newXP / 100) + 1;
  const newHighScore =
    score > data.high_score ? score : data.high_score;

  console.log("Yeni məlumatlar:");
  console.log({
    xp: newXP,
    coins: newCoins,
    level: newLevel,
    high_score: newHighScore,
    games_played: newGamesPlayed,
  });

  const { data: updatedData, error: updateError } =
    await supabase
      .from("profiles")
      .update({
        xp: newXP,
        coins: newCoins,
        level: newLevel,
        high_score: newHighScore,
        games_played: newGamesPlayed,
      })
      .eq("id", userId)
      .select();

  console.log("UPDATE nəticəsi:", updatedData);
  console.log("UPDATE xətası:", updateError);

  if (updateError) {
    console.error("Save Game Error:", updateError);
  } else {
    console.log("✅ Game Saved Successfully");
  }
}