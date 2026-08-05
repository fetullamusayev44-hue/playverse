import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { userId, mines, betAmount } = await req.json();

    if (!userId || !mines || !betAmount) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (profile.balance < betAmount) {
      return NextResponse.json(
        { error: "Not enough balance" },
        { status: 400 }
      );
    }

    await supabaseAdmin
      .from("profiles")
      .update({
        balance: profile.balance - betAmount,
      })
      .eq("id", userId);

    // Fisher-Yates Shuffle alqoritmi ilə bombaların təsadüfi təyini
    const cells = [...Array(25).keys()];

    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    const bombs = cells.slice(0, mines);

    // Oyun başlayanda mərc tarixçəsini qeyd edirik
    await supabaseAdmin.from("game_history").insert({
      user_id: userId,
      game: "Mines",
      bet: betAmount,
      win: 0,
      profit: -betAmount,
    });

    return NextResponse.json({
      bombs,
    });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}