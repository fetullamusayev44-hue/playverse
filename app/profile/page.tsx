"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const [stats, setStats] = useState({
    totalGames: 0,
    totalBet: 0,
    totalWin: 0,
    totalProfit: 0,
  });

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);

    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }

    // Oyun statistikalarını çəkmək və hesablamaq
    const { data: gameStats } = await supabase
      .from("game_history")
      .select("bet, win, profit")
      .eq("user_id", user.id);

    const totalGames = gameStats?.length || 0;
    const totalBet = gameStats?.reduce((s, x) => s + Number(x.bet || 0), 0) || 0;
    const totalWin = gameStats?.reduce((s, x) => s + Number(x.win || 0), 0) || 0;
    const totalProfit = gameStats?.reduce((s, x) => s + Number(x.profit || 0), 0) || 0;

    setStats({
      totalGames,
      totalBet,
      totalWin,
      totalProfit,
    });
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !user) return;

    const fileName = `${user.id}/avatar-${Date.now()}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    setAvatarUrl(data.publicUrl);

    await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        avatar_url: data.publicUrl,
      });

    alert("Avatar uploaded successfully!");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-8 rounded-2xl w-[420px] shadow-xl">
        <div className="flex flex-col items-center">
          <img
            src={avatarUrl || "https://placehold.co/120x120"}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-purple-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            className="mt-4 text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
          />

          <h1 className="text-3xl font-bold mt-5">My Profile</h1>

          <div className="w-full mt-8 space-y-4">
            <div className="bg-zinc-800 p-4 rounded-xl">
              <strong>Email:</strong>
              <br />
              {user?.email ?? "Loading..."}
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <strong>User ID:</strong>
              <br />
              <span className="text-xs text-zinc-400">{user?.id ?? "Loading..."}</span>
            </div>

            {/* Yenilənmiş Oyun Statistikaları */}
            <div className="bg-zinc-800 p-4 rounded-xl font-medium">
              🎮 Total Games: {stats.totalGames}
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl font-medium">
              💵 Total Bet: ${stats.totalBet.toLocaleString()}
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl font-medium">
              🏆 Total Win: ${stats.totalWin.toLocaleString()}
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl font-medium">
              📈 Profit:
              <span className={stats.totalProfit >= 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                {" "}
                ${stats.totalProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}