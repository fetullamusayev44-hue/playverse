import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateSpin } from "@/lib/slot";

export async function POST(req: Request) {
  try {
    const { userId, bet } = await req.json();

    console.log("API USER ID:", userId);

    if (!userId || !bet) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // supabaseAdmin istifadə olunur
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .maybeSingle();

    console.log("USER ID:", userId);
    console.log("PROFILE:", profile);
    console.log("PROFILE ERROR:", profileError);

    if (profileError || !profile) {
      return NextResponse.json(
        { error: profileError?.message || "User not found" },
        { status: 404 }
      );
    }

    if (profile.balance < bet) {
      return NextResponse.json(
        { error: "Not enough balance" },
        { status: 400 }
      );
    }

    const spin = generateSpin(bet);

    const newBalance = profile.balance - bet + spin.reward;

    // supabaseAdmin istifadə olunur
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        balance: newBalance,
      })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // supabaseAdmin istifadə olunur
    const { error: historyError } = await supabaseAdmin
      .from("game_history")
      .insert({
        user_id: userId,
        game: "slot",
        bet,
        reward: spin.reward,
        profit: spin.reward - bet,
        result: spin.result,
      });

    if (historyError) {
      return NextResponse.json(
        { error: historyError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      slots: spin.slots,
      reward: spin.reward,
      balance: newBalance,
      result: spin.result,
    });

  } catch (e: any) {
    console.error("SPIN ERROR:", e);

    return NextResponse.json(
      {
        error: e?.message || String(e),
      },
      {
        status: 500,
      }
    );
  }
}