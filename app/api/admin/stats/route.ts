import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: gamesData } = await supabase
    .from("game_logs")
    .select("bet_amount, win_amount");

  const totalGames = gamesData?.length || 0;
  const totalBet = gamesData?.reduce((acc, item) => acc + Number(item.bet_amount || 0), 0) || 0;
  const totalWin = gamesData?.reduce((acc, item) => acc + Number(item.win_amount || 0), 0) || 0;
  const casinoProfit = totalBet - totalWin;

  return NextResponse.json({
    totalGames,
    totalBet,
    totalWin,
    casinoProfit,
  });
}