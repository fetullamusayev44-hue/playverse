"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UserLogs({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    setProfile(user);

    const { data: history } = await supabase
      .from("game_history")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    setLogs(history || []);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <h1 className="text-5xl font-black mb-10">
        📜 User Game Logs
      </h1>

      {profile && (
        <div className="bg-zinc-900 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold">
            {profile.username || "No Username"}
          </h2>

          <p className="text-zinc-400 mt-2">{profile.id}</p>

          <p className="text-green-400 text-2xl mt-4 font-bold">
            Balance: ${profile.balance}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-zinc-900 rounded-xl p-5 border border-zinc-800"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  🎮 {log.game}
                </h2>

                <p>Bet: ${log.bet}</p>

                <p>Win: ${log.win}</p>

                <p
                  className={
                    log.profit >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  Profit: ${log.profit}
                </p>
              </div>

              <div className="text-zinc-500">
                {new Date(log.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}