import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("balance,last_daily_claim")
      .eq("id", userId)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // $3 - $8 arası təsadüfi daily reward
    const rewards = [3, 4, 5, 6, 7, 8];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    const now = new Date();

    if (profile.last_daily_claim) {
      const last = new Date(profile.last_daily_claim);
      const diff = now.getTime() - last.getTime();

      if (diff < 24 * 60 * 60 * 1000) {
        return NextResponse.json(
          {
            error: "You already claimed today's reward.",
          },
          { status: 400 }
        );
      }
    }

    const newBalance = Number(profile.balance) + reward;

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        balance: newBalance,
        last_daily_claim: now.toISOString(),
      })
      .eq("id", userId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // History-yə vaxt (created_at) dəqiqliyi ilə yazırıq
    await supabaseAdmin.from("game_history").insert({
      user_id: userId,
      game: "Daily Reward",
      bet: 0,
      win: reward,
      profit: reward,
      created_at: now.toISOString(),
    });

    return NextResponse.json({
      reward,
      balance: newBalance,
    });
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}