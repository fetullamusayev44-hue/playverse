"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile } from "@/lib/game";

export default function Navbar() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function load() {
      const profile = await getProfile();

      if (profile) {
        setBalance(profile.balance);
      }
    }

    load();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        <Link
          href="/"
          className="text-3xl font-black text-yellow-400 hover:text-yellow-300 transition"
        >
          🎮 PlayVerse
        </Link>

        <nav className="flex items-center gap-6">

          <Link
            href="/"
            className="text-zinc-300 hover:text-yellow-400 transition"
          >
            Home
          </Link>

          <Link
            href="/games"
            className="text-zinc-300 hover:text-yellow-400 transition"
          >
            Games
          </Link>

          <Link
            href="/deposit"
            className="text-zinc-300 hover:text-yellow-400 transition"
          >
            Deposit
          </Link>

          <Link
            href="/withdraw"
            className="text-zinc-300 hover:text-yellow-400 transition"
          >
            Withdraw
          </Link>

          <Link
            href="/profile"
            className="text-zinc-300 hover:text-yellow-400 transition"
          >
            Profile
          </Link>

          <Link
            href="/leaderboard"
            className="text-zinc-300 hover:text-yellow-400 transition"
          >
            Leaderboard
          </Link>

          {/* Balans Göstəricisi */}
          <div className="bg-zinc-800/80 border border-zinc-700/60 text-green-400 font-bold px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 ml-2 shadow-inner">
            <span>💰</span>
            <span>${balance}</span>
          </div>

        </nav>

      </div>
    </header>
  );
}