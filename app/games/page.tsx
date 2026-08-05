"use client";

import Link from "next/link";

interface GameCardProps {
  title: string;
  description: string;
  emoji: string;
  href: string;
  badge?: string;
  status: "Active" | "Coming Soon";
}

const games: GameCardProps[] = [
  {
    title: "Slot",
    description: "3x3 Casino Slot Machine",
    emoji: "🎰",
    href: "/games/slot",
    status: "Active",
  },
  {
    title: "Mines",
    description: "Find the diamonds",
    emoji: "💣",
    href: "/games/mines",
    status: "Active",
  },
  {
    title: "Wheel",
    description: "Spin & Win",
    emoji: "🎡",
    href: "/games/wheel",
    status: "Active",
  },
  {
    title: "Snake",
    description: "Classic Arcade with Cashout",
    emoji: "🐍",
    href: "/games/snake",
    status: "Active",
  },
  {
    title: "Dice",
    description: "Roll the Dice",
    emoji: "🎲",
    href: "/games/dice",
    status: "Active",
  },
  {
    title: "Coin Flip",
    description: "Heads or Tails",
    emoji: "🪙",
    href: "/games/coinflip",
    status: "Active",
  },
];

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 mb-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                6 Active Games
              </span>
              <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                Growing Community
              </span>
              <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                Instant Payouts
              </span>
            </div>
            <p className="text-xs text-blue-100 font-medium">
              Claim a random reward between <span className="text-emerald-300 font-bold">$3</span> and <span className="text-emerald-300 font-bold">$8</span> once every 24 hours.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/games/slot"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2.5 rounded-2xl font-black text-xs transition shadow-lg flex items-center gap-2"
            >
              🎰 Play Slot Now
            </Link>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 rounded-2xl font-black text-xs transition shadow-lg flex items-center gap-2">
              🎁 Claim Random Daily Bonus
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black flex items-center gap-2">
          🎮 PlayVerse Games
        </h1>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.title}
            className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between hover:border-zinc-700 transition shadow-xl"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="w-12 h-12 bg-zinc-800/80 rounded-2xl flex items-center justify-center text-2xl border border-zinc-700/50">
                  {game.emoji}
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  {game.status}
                </span>
              </div>
              <h2 className="text-2xl font-black mb-1">{game.title}</h2>
              <p className="text-zinc-400 text-xs font-medium mb-6">
                {game.description}
              </p>
            </div>

            <Link
              href={game.href}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-center py-3.5 rounded-2xl transition shadow-lg shadow-indigo-600/20 active:scale-98"
            >
              Play Now
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}