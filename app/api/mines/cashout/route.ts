import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { userId, bet, win } = await req.json();

    if (!userId || bet === undefined || win === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // İstifadəçini tapırıq
    const { data: user, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Balansı artırırıq
    const newBalance = user.balance + win;

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        balance: newBalance,
      })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update balance" },
        { status: 500 }
      );
    }

    // Son yaradılan Mines oyununu yeniləyirik
    const { data: lastGame } = await supabaseAdmin
      .from("game_history")
      .select("id")
      .eq("user_id", userId)
      .eq("game", "Mines")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (lastGame) {
      await supabaseAdmin
        .from("game_history")
        .update({
          win,
          profit: win - bet,
        })
        .eq("id", lastGame.id);
    }

    return NextResponse.json({
      success: true,
      balance: newBalance,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}