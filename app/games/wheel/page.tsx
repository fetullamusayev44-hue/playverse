"use client";

import { useState } from "react";
import Link from "next/link";

const SEGMENTS = [
  { label: "1.2x", value: 1.2, color: "#10B981", weight: 8 },
  { label: "0x", value: 0, color: "#EF4444", weight: 35 },
  { label: "1.1x", value: 1.1, color: "#3B82F6", weight: 10 },
  { label: "0.5x", value: 0.5, color: "#F59E0B", weight: 15 },
  { label: "1.5x", value: 1.5, color: "#8B5CF6", weight: 2 },
  { label: "0x", value: 0, color: "#EF4444", weight: 30 },
];

export default function WheelPage() {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [result, setResult] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(100.0);

  // ================= WEB AUDIO API SOUND EFFECTS =================
  const playSound = (type: "tick" | "win" | "lose") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "tick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
      } else if (type === "win") {
        const notes = [261.63, 329.63, 392.0];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.2);
        });
      } else if (type === "lose") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.3);
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

  function getWeightedRandomIndex(): number {
    const totalWeight = SEGMENTS.reduce((sum, seg) => sum + seg.weight, 0);
    let randomNum = Math.random() * totalWeight;

    for (let i = 0; i < SEGMENTS.length; i++) {
      if (randomNum < SEGMENTS[i].weight) return i;
      randomNum -= SEGMENTS[i].weight;
    }
    return 0;
  }

  function spinWheel() {
    if (spinning || balance < betAmount || betAmount <= 0) return;

    setBalance((prev) => prev - betAmount);
    setSpinning(true);
    setResult(null);

    const selectedIndex = getWeightedRandomIndex();
    const segmentAngle = 360 / SEGMENTS.length;
    const targetAngle = 360 * 5 + (360 - selectedIndex * segmentAngle - segmentAngle / 2);

    setRotation((prev) => prev + targetAngle);

    // Audio Ticks while spinning
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playSound("tick");
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 150);

    setTimeout(() => {
      const selected = SEGMENTS[selectedIndex];
      const winAmount = Number((betAmount * selected.value).toFixed(2));

      if (selected.value > 0) {
        setResult(`🎉 You Won $${winAmount}! (${selected.label})`);
        setBalance((prev) => prev + winAmount);
        playSound("win");
      } else {
        setResult(`💥 Unlucky! You lost your bet.`);
        playSound("lose");
      }

      setSpinning(false);
    }, 4000);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl flex justify-between items-center mb-6 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <Link href="/games" className="text-zinc-400 hover:text-white transition font-semibold text-sm">
          ← Back to Games
        </Link>
        <div className="bg-zinc-800 px-5 py-2 rounded-xl border border-zinc-700 text-right">
          <span className="text-xs text-zinc-400 block font-semibold">BALANCE</span>
          <span className="text-xl font-black text-green-400">${balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl w-full max-w-xl text-center">
        <h1 className="text-4xl font-black mb-2 text-green-400">🎡 Wheel</h1>
        <p className="text-zinc-400 text-xs mb-8">Audio-Enhanced • Low Win Multiplier</p>

        <div className="relative w-72 h-72 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute -top-4 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-white drop-shadow-lg" />
          <div
            className="w-full h-full rounded-full border-4 border-zinc-700 relative overflow-hidden transition-all duration-[4000ms] cubic-bezier(0.15, 0.90, 0.20, 1.00)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {SEGMENTS.map((segment, i) => {
              const angle = 360 / SEGMENTS.length;
              return (
                <div
                  key={i}
                  className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center font-black text-sm text-black"
                  style={{
                    backgroundColor: segment.color,
                    transform: `rotate(${i * angle}deg) skewY(-${90 - angle}deg)`,
                  }}
                >
                  <span
                    className="absolute"
                    style={{ transform: `skewY(${90 - angle}deg) rotate(${angle / 2}deg) translate(50px, -20px)` }}
                  >
                    {segment.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {result && <div className="mb-6 p-4 rounded-2xl bg-zinc-800 border border-zinc-700 font-black text-sm">{result}</div>}

        <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 mb-6 text-left">
          <label className="text-xs text-zinc-400 block mb-1 font-semibold">BET AMOUNT ($)</label>
          <input
            type="number"
            disabled={spinning}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-green-500 disabled:opacity-50 text-lg"
          />
        </div>

        <button
          onClick={spinWheel}
          disabled={spinning}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-black text-xl transition duration-200 shadow-lg cursor-pointer"
        >
          {spinning ? "Spinning..." : "SPIN & WIN"}
        </button>
      </div>
    </main>
  );
}