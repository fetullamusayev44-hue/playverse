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

    console.log("USER ID:", user?.id);
    console.log("USER EMAIL:", user?.email);

    if (!user) {
      location.href = "/";
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, is_admin")
      .eq("id", user.id)
      .single();

    console.log("PROFILE:", data);
    console.log("PROFILE ERROR:", error);

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

    // Stats məlumatlarını API-dən almaq
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

  // Debugging üçün yenilənmiş updateBalance funksiyası
  async function updateBalance(userId: string, amount: number) {
    alert("BUTTON CLICKED");

    console.log("USER:", userId);
    console.log("AMOUNT:", amount);

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
    alert(result);
    console.log(result);

    if (res.ok) {
      await loadUsers();
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

    alert("✅ Admin Updated");
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
    <main className="min-h-screen bg-zinc-950 text-white flex justify-center py-12">
      <div className="w-[700px] bg-zinc-900 rounded-2xl p-8">
        <h1 className="text-5xl font-black mb-8">👑 Admin Panel</h1>

        {/* Dashboard Statistikaları */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-sm">👥 Users</div>
            <div className="text-3xl font-black mt-2">
              {stats.totalUsers}
            </div>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-sm">💰 Total Balance</div>
            <div className="text-3xl font-black text-green-400 mt-2">
              ${stats.totalBalance.toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-sm">🎮 Total Games</div>
            <div className="text-3xl font-black mt-2">
              {stats.totalGames}
            </div>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-sm">🎯 Total Bet</div>
            <div className="text-3xl font-black text-yellow-400 mt-2">
              ${stats.totalBet.toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-sm">🏆 Total Win</div>
            <div className="text-3xl font-black text-blue-400 mt-2">
              ${stats.totalWin.toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-zinc-400 text-sm">📈 Casino Profit</div>
            <div
              className={`text-3xl font-black mt-2 ${
                stats.casinoProfit >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ${stats.casinoProfit.toLocaleString()}
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="🔍 Search username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-800 rounded-xl p-4 mb-8 outline-none focus:ring-2 focus:ring-zinc-600 transition"
        />

        <div>
          <h2 className="text-3xl font-bold mb-5">👥 Users</h2>

          <div className="space-y-3">
            {users
              .filter((u) =>
                (u.username ?? "")
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((u) => (
                <div
                  key={u.id}
                  className="bg-zinc-800 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold">
                      {u.username || "No Username"}
                    </div>
                    <div className="text-zinc-400 text-sm">{u.id}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-green-400 font-bold">${u.balance}</div>

                    <div className="text-sm mb-3">
                      {u.is_admin ? "👑 Admin" : "Player"}
                    </div>

                    <div className="mt-2 mb-3">
                      {u.is_admin ? (
                        <button
                          onClick={() => toggleAdmin(u.id, false)}
                          className="bg-red-500 px-3 py-1 rounded hover:bg-red-400 transition cursor-pointer"
                        >
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleAdmin(u.id, true)}
                          className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400 transition cursor-pointer"
                        >
                          👑 Make Admin
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => router.push(`/admin/logs/${u.id}`)}
                      className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500 transition mb-2 cursor-pointer"
                    >
                      📜 View Logs
                    </button>

                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => updateBalance(u.id, u.balance + 100)}
                        className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 transition cursor-pointer"
                      >
                        +100
                      </button>

                      <button
                        onClick={() => updateBalance(u.id, u.balance + 1000)}
                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 transition cursor-pointer"
                      >
                        +1000
                      </button>

                      <button
                        onClick={() =>
                          updateBalance(u.id, Math.max(0, u.balance - 100))
                        }
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition cursor-pointer"
                      >
                        -100
                      </button>

                      <button
                        onClick={() =>
                          updateBalance(u.id, Math.max(0, u.balance - 1000))
                        }
                        className="bg-red-800 px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
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