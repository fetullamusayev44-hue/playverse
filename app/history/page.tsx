"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/game";

interface History {
  id: string;
  game: string;
  bet: number;
  win: number;
  profit: number;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const user = await getCurrentUser();

    if (!user) return;

    const { data } = await supabase
      .from("game_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setHistory(data);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Link
        href="/games"
        className="text-zinc-400 hover:text-white"
      >
        ← Back
      </Link>

      <h1 className="text-4xl font-black mt-6 mb-8">
        🎮 Game History
      </h1>

      <div className="space-y-4">
        {history.map((game) => (
          <div
            key={game.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex justify-between">
              <span className="font-bold">{game.game}</span>

              <span className="text-sm text-zinc-400">
                {new Date(game.created_at).toLocaleString()}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 text-center">
              <div>
                <div className="text-zinc-500 text-sm">
                  Bet
                </div>

                <div>${game.bet}</div>
              </div>

              <div>
                <div className="text-zinc-500 text-sm">
                  Win
                </div>

                <div>${game.win}</div>
              </div>

              <div>
                <div className="text-zinc-500 text-sm">
                  Profit
                </div>

                <div
                  className={
                    game.profit >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {game.profit >= 0 ? "+" : ""}
                  {game.profit}
                </div>
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-zinc-500">
            No games played yet.
          </div>
        )}
      </div>
    </main>
  );
}