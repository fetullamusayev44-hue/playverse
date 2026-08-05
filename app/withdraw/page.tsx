"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WithdrawPage() {
  const [profile, setProfile] = useState<any>(null);
  const [coin, setCoin] = useState("BTC");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  }

  function wallet() {
    if (!profile) return "";

    switch (coin) {
      case "BTC":
        return profile.btc_wallet;
      case "LTC":
        return profile.ltc_wallet;
      case "DOGE":
        return profile.doge_wallet;
      case "USDT TRC20":
        return profile.usdt_trc20_wallet;
      case "USDT BEP20":
        return profile.usdt_bep20_wallet;
      default:
        return "";
    }
  }

  async function withdraw() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        coin,
        wallet: wallet(),
        amount: Number(amount),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Withdrawal request sent ✅");
    setAmount("");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex justify-center py-12">
      <div className="w-[500px] bg-zinc-900 rounded-2xl p-8">

        <h1 className="text-4xl font-bold mb-8">
          Withdraw
        </h1>

        <div className="mb-5">
          Balance:
          <span className="text-green-400 font-bold ml-2">
            ${profile?.balance ?? 0}
          </span>
        </div>

        <select
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 mb-5"
        >
          <option>BTC</option>
          <option>LTC</option>
          <option>DOGE</option>
          <option>USDT TRC20</option>
          <option>USDT BEP20</option>
        </select>

        <input
          value={wallet()}
          disabled
          className="w-full p-3 rounded bg-zinc-800 mb-5"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 mb-5"
        />

        <button
          onClick={withdraw}
          className="w-full bg-purple-600 py-3 rounded-xl"
        >
          Request Withdraw
        </button>

      </div>
    </main>
  );
}