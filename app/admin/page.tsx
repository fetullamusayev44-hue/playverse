"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalGames: 0,
    totalBet: 0,
    totalWin: 0,
    casinoProfit: 0,
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      location.href = "/";
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, is_admin")
      .eq("id", user.id)
      .single();

    if (!data?.is_admin) {
      location.href = "/";
      return;
    }

    setIsAdmin(true);
    setLoading(false);
    await loadUsers();
  }

  async function loadUsers() {
    const res = await fetch("/api/admin/users");

    if (!res.ok) {
      console.error(await res.text());
      return;
    }

    const data = await res.json();

    const sanitizedUsers = (Array.isArray(data) ? data : []).map((u: any) => ({
      ...u,
      username: u.username || "",
      balance: Number(u.balance || 0),
    }));

    setUsers(sanitizedUsers);

    const statsRes = await fetch("/api/admin/stats");
    if (statsRes.ok) {
      const statsData = await statsRes.json();

      setStats({
        totalUsers: sanitizedUsers.length,
        totalBalance: sanitizedUsers.reduce(
          (sum: number, u: any) => sum + Number(u.balance || 0),
          0
        ),
        totalGames: statsData.totalGames,
        totalBet: statsData.totalBet,
        totalWin: statsData.totalWin,
        casinoProfit: statsData.casinoProfit,
      });
    }
  }

  async function updateBalance(userId: string, amount: number) {
    const sanitizedAmount = Math.max(0, amount);

    const res = await fetch("/api/admin/balance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        balance: sanitizedAmount,
      }),
    });

    const result = await res.text();

    if (res.ok) {
      await loadUsers();
    } else {
      alert("Xəta baş verdi: " + result);
    }
  }

  async function toggleAdmin(userId: string, isAdmin: boolean) {
    const res = await fetch("/api/admin/toggle-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        isAdmin,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    await loadUsers();
    alert("✅ Admin Status Güncəlləndi");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white text-3xl">
        Loading...
      </main>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-black text-white px-4 py-12 flex justify-center">
      <div className="max-w-5xl w-full bg-zinc-950 border border-yellow-500/20 rounded-3xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-yellow-400">👑 BigGoldWin Admin Panel</h1>
            <p className="text-zinc-400 text-sm mt-1">Manage platform users, balances and statistics</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              🟢 Online & Local
            </span>
            <a
              href="/"
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              Home
            </a>
          </div>
        </div>

        {/* Dashboard Statistikaları */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-xs font-semibold">👥 USERS</div>
            <div className="text-2xl font-black mt-2 text-white">{stats.totalUsers}</div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-xs font-semibold">💰 TOTAL BALANCE</div>
            <div className="text-2xl font-black text-green-400 mt-2">
              ${stats.totalBalance.toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-xs font-semibold">🎮 TOTAL GAMES</div>
            <div className="text-2xl font-black mt-2 text-white">{stats.totalGames}</div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-xs font-semibold">🎯 TOTAL BET</div>
            <div className="text-2xl font-black text-yellow-400 mt-2">
              ${stats.totalBet.toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-xs font-semibold">🏆 TOTAL WIN</div>
            <div className="text-2xl font-black text-blue-400 mt-2">
              ${stats.totalWin.toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-xs font-semibold">📈 CASINO PROFIT</div>
            <div
              className={`text-2xl font-black mt-2 ${
                stats.casinoProfit >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ${stats.casinoProfit.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Axtarış */}
        <input
          type="text"
          placeholder="🔍 Search username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8 text-sm outline-none focus:border-yellow-500 transition"
        />

        {/* İstifadəçilər Siyahısı */}
        <div>
          <h2 className="text-2xl font-bold mb-5 text-yellow-400">👥 Users Management</h2>

          <div className="space-y-3">
            {users
              .filter((u) =>
                (u.username ?? "").toLowerCase().includes(search.toLowerCase())
              )
              .map((u) => (
                <div
                  key={u.id}
                  className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <div className="font-bold text-base text-white">{u.username || "No Username"}</div>
                    <div className="text-zinc-500 text-xs font-mono mt-0.5">{u.id}</div>
                    <div className="mt-2 inline-block">
                      {u.is_admin ? (
                        <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                          👑 Admin
                        </span>
                      ) : (
                        <span className="bg-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                          Player
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end w-full md:w-auto gap-3">
                    <div className="text-green-400 font-extrabold text-lg">${u.balance.toLocaleString()}</div>

                    <div className="flex flex-wrap gap-2 items-center">
                      {u.is_admin ? (
                        <button
                          onClick={() => toggleAdmin(u.id, false)}
                          className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl hover:bg-red-500/30 transition cursor-pointer text-xs font-semibold"
                        >
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleAdmin(u.id, true)}
                          className="bg-yellow-500 text-black px-3 py-1.5 rounded-xl hover:bg-yellow-400 transition cursor-pointer text-xs font-bold"
                        >
                          👑 Make Admin
                        </button>
                      )}
                    </div>

                    {/* Balans idarəetmə düymələri */}
                    <div className="flex flex-wrap gap-1.5 justify-start md:justify-end pt-2 border-t border-zinc-800/60 w-full">
                      <button
                        onClick={() => {
                          const customAmount = prompt(
                            `Yeni balansı daxil edin (Hazırkı: $${u.balance}):`,
                            u.balance
                          );
                          if (
                            customAmount !== null &&
                            !isNaN(Number(customAmount))
                          ) {
                            updateBalance(u.id, Number(customAmount));
                          }
                        }}
                        className="bg-purple-600/20 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-lg hover:bg-purple-600/30 transition cursor-pointer text-xs font-semibold"
                      >
                        ✏️ Custom
                      </button>

                      <button
                        onClick={() => updateBalance(u.id, u.balance + 100)}
                        className="bg-green-600/20 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-lg hover:bg-green-600/30 transition cursor-pointer text-xs font-semibold"
                      >
                        +100
                      </button>

                      <button
                        onClick={() => updateBalance(u.id, u.balance + 1000)}
                        className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg hover:bg-blue-600/30 transition cursor-pointer text-xs font-semibold"
                      >
                        +1000
                      </button>

                      <button
                        onClick={() =>
                          updateBalance(u.id, Math.max(0, u.balance - 100))
                        }
                        className="bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-lg hover:bg-red-600/30 transition cursor-pointer text-xs font-semibold"
                      >
                        -100
                      </button>

                      <button
                        onClick={() =>
                          updateBalance(u.id, Math.max(0, u.balance - 1000))
                        }
                        className="bg-red-900/30 text-red-400 border border-red-700/40 px-2.5 py-1 rounded-lg hover:bg-red-900/50 transition cursor-pointer text-xs font-semibold"
                      >
                        -1000
                      </button>
                    </div>

                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </main>
  );
}