"use client";

import { useState } from "react";
import Link from "next/link";

export default function DicePage() {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [target, setTarget] = useState<number>(50);
  const [rolling, setRolling] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(100.0);

  // Tight Formula: 70 / Target (Max win around 1.15x - 1.2x for safe bets)
  const multiplier = Number((70 / target).toFixed(2));

  function rollDice() {
    if (rolling || balance < betAmount || betAmount <= 0) return;

    setBalance((prev) => prev - betAmount);
    setRolling(true);
    setResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 100) + 1;
      
      // Strict win condition with built-in loss margin
      const isWin = roll < target && Math.random() < 0.4; 

      if (isWin) {
        const winAmount = Number((betAmount * multiplier).toFixed(2));
        setBalance((prev) => prev + winAmount);
        setResult(`🎉 Rolled ${roll}! You Won $${winAmount}!`);
      } else {
        setResult(`💥 Rolled ${roll}! You lost your bet.`);
      }

      setRolling(false);
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md flex justify-between items-center mb-6 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <Link href="/games" className="text-zinc-400 hover:text-white transition font-semibold text-sm">
          ← Back to Games
        </Link>
        <div className="bg-zinc-800 px-5 py-2 rounded-xl border border-zinc-700 text-right">
          <span className="text-xs text-zinc-400 block font-semibold">BALANCE</span>
          <span className="text-xl font-black text-blue-400">${balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-black mb-2 text-blue-400">🎲 Classic Dice</h1>
        <p className="text-zinc-400 text-xs mb-6">Strict Low-Payout Dice Engine</p>

        <div className="my-6 p-6 bg-zinc-800/40 rounded-2xl border border-zinc-700/50">
          <span className="text-xs text-zinc-400 block mb-1">MULTIPLIER</span>
          <span className="text-4xl font-black text-blue-400">{multiplier}x</span>
        </div>

        {result && <div className="mb-6 p-4 rounded-2xl bg-zinc-800 border border-zinc-700 font-bold text-sm">{result}</div>}

        <div className="mb-6 text-left">
          <div className="flex justify-between text-xs text-zinc-400 mb-2 font-bold">
            <span>ROLL UNDER: {target}</span>
            <span>WIN CHANCE: {target}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 mb-6 text-left">
          <label className="text-xs text-zinc-400 block mb-1 font-semibold">BET AMOUNT ($)</label>
          <input
            type="number"
            disabled={rolling}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-blue-400 text-lg"
          />
        </div>

        <button
          onClick={rollDice}
          disabled={rolling}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-lg transition duration-200 shadow-lg cursor-pointer"
        >
          {rolling ? "Rolling..." : "ROLL DICE"}
        </button>
      </div>
    </main>
  );
}