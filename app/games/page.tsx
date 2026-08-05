"use client";

import Link from "next/link";

export default function GamesPage() {
  const games = [
    {
      id: "slot",
      title: "Slot",
      description: "3x3 Casino Slot Machine",
      icon: "🎰",
      href: "/games/slot",
      status: "Active",
      active: true,
    },
    {
      id: "mines",
      title: "Mines",
      description: "Find the diamonds",
      icon: "💣",
      href: "/games/mines",
      status: "Active",
      active: true,
    },
    {
      id: "wheel",
      title: "Wheel",
      description: "Spin & Win",
      icon: "🎡",
      href: "/games/wheel",
      status: "Active",
      active: true,
    },
    {
      id: "snake",
      title: "Snake",
      description: "Classic Arcade",
      icon: "🐍",
      href: "/games/snake",
      status: "Active",
      active: true,
    },
    {
      id: "dice",
      title: "Dice",
      description: "Roll the Dice",
      icon: "🎲",
      href: "/games/dice",
      status: "Active",
      active: true,
    },
    {
      id: "coinflip",
      title: "Coin Flip",
      description: "Heads or Tails",
      icon: "🪙",
      href: "/games/coinflip",
      status: "Active",
      active: true,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      {/* Top Banner Stats */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 mb-8 border border-indigo-600/30 shadow-2xl">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-2xl font-black block">6</span>
            <span className="text-xs text-zinc-300 font-medium">Active Games</span>
          </div>
          <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-lg font-black block">Growing</span>
            <span className="text-xs text-zinc-300 font-medium">Community</span>
          </div>
          <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-lg font-black block">Instant</span>
            <span className="text-xs text-zinc-300 font-medium">Payouts</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/games/slot">
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-2.5 rounded-xl transition shadow-lg text-sm cursor-pointer">
              🎰 Play Slot Now
            </button>
          </Link>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-5 py-2.5 rounded-xl transition shadow-lg text-sm cursor-pointer">
            🎁 Claim Random Daily Bonus
          </button>
        </div>
        <p className="text-xs text-zinc-300 mt-2">
          Claim a random reward between <span className="text-emerald-300 font-bold">$3</span> and <span className="text-emerald-300 font-bold">$8</span> once every 24 hours.
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between hover:border-zinc-700 transition duration-300 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl border border-zinc-700">
                  {game.icon}
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {game.status}
                </span>
              </div>
              <h3 className="text-2xl font-black mb-1">{game.title}</h3>
              <p className="text-zinc-400 text-xs mb-6 font-medium">{game.description}</p>
            </div>

            <Link href={game.href}>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl font-black text-sm transition duration-200 shadow-lg cursor-pointer hover:scale-[1.01] active:scale-95">
                Play Now
              </button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}