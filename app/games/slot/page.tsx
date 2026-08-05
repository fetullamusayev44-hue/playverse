"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const SYMBOLS = ["🍒", "🍋", "🍇", "🍎", "🍉", "7️⃣"];

export default function SlotPage() {
  const [balance, setBalance] = useState<number>(100.0);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [grid, setGrid] = useState<string[]>([
    "🍒", "🍋", "🍇",
    "🍎", "🍉", "🍒",
    "🍋", "🍇", "🍎",
  ]);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const quickBets = [1, 5, 10, 25, 50, 100];

  // ================= WEB AUDIO API SOUND EFFECTS =================
  const playSound = (type: "spin" | "win" | "lose") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "spin") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "win") {
        const notes = [261.63, 329.63, 392.0, 523.25]; // C - E - G - C
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, ctx.currentTime + index * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + index * 0.1);
          osc.stop(ctx.currentTime + index * 0.1 + 0.25);
        });
      } else if (type === "lose") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Audio block background prevention
    }
  };
  // ==============================================================

  function handleSpin() {
    if (spinning) return;
    if (betAmount <= 0) {
      alert("Please enter a valid bet amount!");
      return;
    }
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setBalance((prev) => prev - betAmount);
    setSpinning(true);
    setResultMessage(null);

    let counter = 0;
    const interval = setInterval(() => {
      playSound("spin"); // Fırlanma Səsi

      setGrid([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      counter++;

      if (counter > 15) {
        clearInterval(interval);
        evaluateSpin();
      }
    }, 100);
  }

  function evaluateSpin() {
    // 30% Low Win Chance, Max 1.2x Payout (Tight Economy)
    const isWin = Math.random() < 0.3;

    let finalGrid: string[];
    let winAmount = 0;

    if (isWin) {
      const winSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      finalGrid = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        winSymbol, winSymbol, winSymbol, // Winning row
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ];

      const multiplier = 1.2; // 10$ -> 12$ Win Max
      winAmount = Number((betAmount * multiplier).toFixed(2));
      setBalance((prev) => prev + winAmount);
      setResultMessage(`🎉 YOU WON $${winAmount.toFixed(2)}! (1.20x)`);
      playSound("win"); // Uduş Səsi
    } else {
      finalGrid = [
        "🍒", "🍋", "🍇",
        "🍎", "🍉", "🍒",
        "🍋", "🍇", "🍎",
      ];
      setResultMessage(`💥 Unlucky! Better luck next spin.`);
      playSound("lose"); // Uduzma Səsi
    }

    setGrid(finalGrid);
    setSpinning(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 md:p-8">
      {/* Top Bar */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-lg">
        <Link
          href="/games"
          className="text-zinc-400 hover:text-white transition font-semibold text-sm flex items-center gap-1"
        >
          ← Back to Games
        </Link>
        <div className="bg-zinc-800/90 px-4 py-2 rounded-xl border border-zinc-700/80 text-right">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">
            Balance
          </span>
          <span className="text-lg font-black text-emerald-400">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Slot Machine */}
      <div className="w-full max-w-lg bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative backdrop-blur-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-emerald-400 flex items-center justify-center gap-2">
            🎰 PlayVerse Slot
          </h1>
          <p className="text-zinc-400 text-xs font-medium mt-1">
            Audio-Enhanced • Low Win Risk (Max 1.2x)
          </p>
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-3 gap-3 bg-black/60 p-4 rounded-2xl border border-zinc-800 mb-6 shadow-inner">
          {grid.map((symbol, index) => (
            <div
              key={index}
              className={`h-20 md:h-24 bg-zinc-800/80 rounded-xl border border-zinc-700 flex items-center justify-center text-3xl md:text-4xl shadow-md transition-all ${
                spinning ? "animate-pulse scale-95 opacity-80" : ""
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Result Message */}
        {resultMessage && (
          <div
            className={`mb-6 p-3.5 rounded-xl font-black text-center text-sm border ${
              resultMessage.includes("WON")
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {resultMessage}
          </div>
        )}

        {/* Bet Selection & Custom Input */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              Bet Amount ($)
            </label>
            <div className="flex gap-1">
              <button
                disabled={spinning}
                onClick={() => setBetAmount((prev) => Math.max(1, Number((prev / 2).toFixed(2))))}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-zinc-700 transition"
              >
                ½
              </button>
              <button
                disabled={spinning}
                onClick={() => setBetAmount((prev) => Number((prev * 2).toFixed(2)))}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-zinc-700 transition"
              >
                2X
              </button>
              <button
                disabled={spinning}
                onClick={() => setBetAmount(Math.floor(balance))}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-zinc-700 transition"
              >
                MAX
              </button>
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-lg">
              $
            </span>
            <input
              type="number"
              disabled={spinning}
              value={betAmount || ""}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              placeholder="Enter bet amount"
              className="w-full bg-black/80 border border-zinc-700 rounded-2xl pl-8 pr-4 py-3.5 text-white font-black text-lg focus:outline-none focus:border-emerald-500 transition disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-6 gap-2 pt-1">
            {quickBets.map((amount) => (
              <button
                key={amount}
                disabled={spinning}
                onClick={() => setBetAmount(amount)}
                className={`py-2 rounded-xl text-xs font-bold transition border ${
                  betAmount === amount
                    ? "bg-emerald-500 text-black border-emerald-400"
                    : "bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-700"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-black text-lg transition duration-200 shadow-lg shadow-emerald-500/10 hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {spinning ? "Spinning Reels..." : `Spin ($${betAmount || 0})`}
        </button>
      </div>
    </main>
  );
}