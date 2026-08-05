"use client";

import { useState } from "react";
import Link from "next/link";

export default function CoinFlipPage() {
  const [balance, setBalance] = useState<number>(100.0);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [selectedSide, setSelectedSide] = useState<"HEADS" | "TAILS">("HEADS");
  const [flipping, setFlipping] = useState<boolean>(false);
  const [coinResult, setCoinResult] = useState<"HEADS" | "TAILS" | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  // ================= WEB AUDIO API SOUND EFFECTS =================
  const playSound = (type: "flip" | "win" | "lose") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "flip") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "win") {
        const notes = [400, 523.25, 659.25];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.2);
        });
      } else if (type === "lose") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Audio fallback
    }
  };
  // ==============================================================

  function handleFlip() {
    if (flipping || betAmount <= 0 || balance < betAmount) return;

    setBalance((prev) => prev - betAmount);
    setFlipping(true);
    setResultMessage(null);

    let flipCount = 0;
    const interval = setInterval(() => {
      playSound("flip");
      setCoinResult((prev) => (prev === "HEADS" ? "TAILS" : "HEADS"));
      flipCount++;

      if (flipCount > 10) {
        clearInterval(interval);
        
        // Controlled 40% win rate (Max 1.15x payout)
        const isWin = Math.random() < 0.4;
        const finalOutcome = isWin ? selectedSide : selectedSide === "HEADS" ? "TAILS" : "HEADS";

        setCoinResult(finalOutcome);

        if (isWin) {
          const winAmount = Number((betAmount * 1.15).toFixed(2));
          setBalance((prev) => prev + winAmount);
          setResultMessage(`🎉 YOU WON $${winAmount}! (${finalOutcome})`);
          playSound("win");
        } else {
          setResultMessage(`💥 Unlucky! It landed on ${finalOutcome}.`);
          playSound("lose");
        }

        setFlipping(false);
      }
    }, 120);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg flex justify-between items-center mb-6 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <Link href="/games" className="text-zinc-400 hover:text-white transition font-semibold text-sm">
          ← Back to Games
        </Link>
        <div className="bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-700 text-right">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase">Balance</span>
          <span className="text-lg font-black text-emerald-400">${balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center shadow-2xl">
        <h1 className="text-3xl font-black text-emerald-400 mb-1">🪙 Coin Flip</h1>
        <p className="text-zinc-400 text-xs mb-8">Choose Heads or Tails (1.15x Payout)</p>

        {/* Coin Display */}
        <div className="w-32 h-32 mx-auto mb-8 bg-zinc-800 rounded-full border-4 border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <span className={`text-4xl font-black text-emerald-400 transition-all ${flipping ? "animate-spin" : ""}`}>
            {coinResult ? (coinResult === "HEADS" ? "👑" : "🦅") : "🪙"}
          </span>
        </div>

        {resultMessage && (
          <div className={`mb-6 p-3 rounded-xl font-black text-sm border ${resultMessage.includes("WON") ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
            {resultMessage}
          </div>
        )}

        {/* Side Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            disabled={flipping}
            onClick={() => setSelectedSide("HEADS")}
            className={`py-3.5 rounded-2xl font-black text-sm transition border ${selectedSide === "HEADS" ? "bg-emerald-500 text-black border-emerald-400" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"}`}
          >
            👑 HEADS
          </button>
          <button
            disabled={flipping}
            onClick={() => setSelectedSide("TAILS")}
            className={`py-3.5 rounded-2xl font-black text-sm transition border ${selectedSide === "TAILS" ? "bg-emerald-500 text-black border-emerald-400" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"}`}
          >
            🦅 TAILS
          </button>
        </div>

        {/* Bet Input */}
        <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 mb-6 text-left">
          <label className="text-xs text-zinc-400 font-bold block mb-1">BET AMOUNT ($)</label>
          <input
            type="number"
            disabled={flipping}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white font-black text-lg focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          onClick={handleFlip}
          disabled={flipping}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-black text-lg transition duration-200 shadow-lg cursor-pointer"
        >
          {flipping ? "Flipping Coin..." : `FLIP COIN ($${betAmount})`}
        </button>
      </div>
    </main>
  );
}