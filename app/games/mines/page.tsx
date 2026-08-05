"use client";

import { useState } from "react";
import Link from "next/link";

const GRID_SIZE = 25; // 5x5 Grid

export default function MinesPage() {
  const [balance, setBalance] = useState<number>(100.0);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [mineCount, setMineCount] = useState<number>(3);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
  const [mines, setMines] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gemsFound, setGemsFound] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  // ================= WEB AUDIO API SOUND EFFECTS =================
  const playSound = (type: "reveal" | "boom" | "win") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "reveal") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(400 + gemsFound * 50, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "boom") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "win") {
        const notes = [300, 400, 500, 600];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.2);
        });
      }
    } catch {
      // Audio prevention fallback
    }
  };
  // ==============================================================

  // Tight Multiplier Logic (Max 1.05x - 1.2x growth per gem)
  const currentMultiplier = Number((1 + gemsFound * 0.05).toFixed(2));
  const nextPayout = Number((betAmount * currentMultiplier).toFixed(2));

  function startGame() {
    if (betAmount <= 0 || balance < betAmount) {
      alert("Invalid bet or insufficient balance!");
      return;
    }

    setBalance((prev) => prev - betAmount);
    setRevealed(Array(GRID_SIZE).fill(false));
    
    // Plant Mines randomly
    const newMines = Array(GRID_SIZE).fill(false);
    let planted = 0;
    while (planted < mineCount) {
      const idx = Math.floor(Math.random() * GRID_SIZE);
      if (!newMines[idx]) {
        newMines[idx] = true;
        planted++;
      }
    }

    setMines(newMines);
    setGameActive(true);
    setGameOver(false);
    setGemsFound(0);
    setResultMessage(null);
  }

  function handleTileClick(index: number) {
    if (!gameActive || revealed[index] || gameOver) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (mines[index]) {
      // Hit a mine!
      setGameOver(true);
      setGameActive(false);
      setResultMessage("💥 BOOM! You hit a mine.");
      playSound("boom");
      // Reveal all tiles
      setRevealed(Array(GRID_SIZE).fill(true));
    } else {
      // Found a Gem
      const newGems = gemsFound + 1;
      setGemsFound(newGems);
      playSound("reveal");
    }
  }

  function cashout() {
    if (!gameActive || gemsFound === 0) return;

    const winAmount = nextPayout;
    setBalance((prev) => prev + winAmount);
    setGameActive(false);
    setResultMessage(`🎉 CASHED OUT $${winAmount.toFixed(2)}!`);
    playSound("win");
    setRevealed(Array(GRID_SIZE).fill(true));
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg flex justify-between items-center mb-6 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-lg">
        <Link href="/games" className="text-zinc-400 hover:text-white transition font-semibold text-sm">
          ← Back to Games
        </Link>
        <div className="bg-zinc-800/90 px-4 py-2 rounded-xl border border-zinc-700/80 text-right">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase">Balance</span>
          <span className="text-lg font-black text-emerald-400">${balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="w-full max-w-lg bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-emerald-400">💣 Mines</h1>
          <p className="text-zinc-400 text-xs mt-1">Audio-Enhanced • Low Payout Growth</p>
        </div>

        {/* 5x5 Grid */}
        <div className="grid grid-cols-5 gap-2.5 bg-black/60 p-4 rounded-2xl border border-zinc-800 mb-6">
          {Array.from({ length: GRID_SIZE }).map((_, i) => (
            <button
              key={i}
              disabled={!gameActive || revealed[i]}
              onClick={() => handleTileClick(i)}
              className={`h-14 md:h-16 rounded-xl font-black text-xl flex items-center justify-center transition-all ${
                revealed[i]
                  ? mines[i]
                    ? "bg-red-500/20 border border-red-500 text-red-400"
                    : "bg-emerald-500/20 border border-emerald-500 text-emerald-400"
                  : "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
              }`}
            >
              {revealed[i] ? (mines[i] ? "💣" : "💎") : ""}
            </button>
          ))}
        </div>

        {resultMessage && (
          <div className={`mb-6 p-3 rounded-xl font-black text-center text-sm border ${resultMessage.includes("CASHED") ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
            {resultMessage}
          </div>
        )}

        {/* Controls */}
        {!gameActive ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">BET ($)</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 font-black text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">MINES (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={mineCount}
                  onChange={(e) => setMineCount(Math.min(10, Math.max(1, Number(e.target.value))))}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 font-black text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <button
              onClick={startGame}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-black text-lg transition shadow-lg cursor-pointer"
            >
              START GAME
            </button>
          </div>
        ) : (
          <button
            onClick={cashout}
            disabled={gemsFound === 0}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-2xl font-black text-lg transition shadow-lg disabled:opacity-50 cursor-pointer"
          >
            CASHOUT (${nextPayout})
          </button>
        )}
      </div>
    </main>
  );
}