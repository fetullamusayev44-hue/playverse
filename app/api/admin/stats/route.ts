import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data: games } = await supabaseAdmin
    .from("game_history")
    .select("*");

  const totalGames = games?.length || 0;

  const totalBet =
    games?.reduce((sum, game) => sum + Number(game.bet || 0), 0) || 0;

  const totalWin =
    games?.reduce((sum, game) => sum + Number(game.win || 0), 0) || 0;

  const casinoProfit = totalBet - totalWin;

  return NextResponse.json({
    totalGames,
    totalBet,
    totalWin,
    casinoProfit,
  });
}