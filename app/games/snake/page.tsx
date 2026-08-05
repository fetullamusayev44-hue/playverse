"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const GRID_SIZE = 15;

type Position = { x: number; y: number };

export default function SnakePage() {
  const [balance, setBalance] = useState<number>(100.0);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 3, y: 3 });
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  // Growth rate: Each food adds 0.15x to the bet
  const currentMultiplier = Number((1 + score * 0.15).toFixed(2));
  const currentPayout = Number((betAmount * currentMultiplier).toFixed(2));

  // ================= WEB AUDIO API SOUND EFFECTS =================
  const playSound = (type: "eat" | "die" | "cashout") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "eat") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(500 + score * 40, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800 + score * 40, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "die") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "cashout") {
        const notes = [300, 400, 500, 650];
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
      // Audio fallback
    }
  };
  // ==============================================================

  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const startGame = () => {
    if (betAmount <= 0 || balance < betAmount) {
      alert("Insufficient balance or invalid bet!");
      return;
    }

    setBalance((prev) => prev - betAmount);
    setSnake([{ x: 7, y: 7 }]);
    setFood(generateFood());
    setDirection("RIGHT");
    setGameOver(false);
    setGameActive(true);
    setScore(0);
    setResultMessage(null);
  };

  const cashout = () => {
    if (!gameActive || score === 0) return;

    setBalance((prev) => prev + currentPayout);
    setGameActive(false);
    setResultMessage(`🎉 CASHED OUT $${currentPayout.toFixed(2)}! (${currentMultiplier}x)`);
    playSound("cashout");
  };

  const changeDirection = (newDir: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
    if (!gameActive || gameOver) return;
    if (newDir === "UP" && direction !== "DOWN") setDirection("UP");
    if (newDir === "DOWN" && direction !== "UP") setDirection("DOWN");
    if (newDir === "LEFT" && direction !== "RIGHT") setDirection("LEFT");
    if (newDir === "RIGHT" && direction !== "LEFT") setDirection("RIGHT");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") changeDirection("UP");
      if (e.key === "ArrowDown") changeDirection("DOWN");
      if (e.key === "ArrowLeft") changeDirection("LEFT");
      if (e.key === "ArrowRight") changeDirection("RIGHT");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameActive, gameOver]);

  useEffect(() => {
    if (!gameActive || gameOver) return;

    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        if (direction === "UP") head.y -= 1;
        if (direction === "DOWN") head.y += 1;
        if (direction === "LEFT") head.x -= 1;
        if (direction === "RIGHT") head.x += 1;

        // Collision Check
        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE ||
          prevSnake.some((s) => s.x === head.x && s.y === head.y)
        ) {
          setGameOver(true);
          setGameActive(false);
          setResultMessage("💥 CRASHED! You lost your bet.");
          playSound("die");
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat Food
        if (head.x === food.x && head.y === food.y) {
          playSound("eat");
          setScore((s) => s + 1);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 140);

    return () => clearInterval(moveSnake);
  }, [direction, food, gameActive, gameOver, generateFood]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Top Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-4 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <Link href="/games" className="text-zinc-400 hover:text-white transition font-semibold text-sm">
          ← Back to Games
        </Link>
        <div className="bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-700 text-right">
          <span className="text-[10px] text-zinc-400 block font-bold uppercase">Balance</span>
          <span className="text-lg font-black text-emerald-400">${balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-center shadow-2xl">
        <div className="flex justify-between items-center mb-4 px-2">
          <h1 className="text-2xl font-black text-emerald-400">🐍 Snake</h1>
          <div className="text-right">
            <span className="text-xs text-zinc-400 block">Current Multiplier</span>
            <span className="text-base font-black text-yellow-400">{currentMultiplier}x (${currentPayout})</span>
          </div>
        </div>

        {/* Snake Grid Matrix (Xanalar aydın göstərilir) */}
        <div className="relative w-72 h-72 mx-auto bg-black border-2 border-zinc-800 rounded-2xl overflow-hidden mb-4 grid grid-cols-15 grid-rows-15">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`w-full h-full border-[0.5px] border-zinc-800/40 flex items-center justify-center ${
                  isHead
                    ? "bg-emerald-400 rounded-sm shadow-md shadow-emerald-500/50"
                    : isSnake
                    ? "bg-emerald-600 rounded-sm"
                    : isFood
                    ? "bg-red-500 rounded-full scale-75 animate-pulse shadow-sm shadow-red-500"
                    : ""
                }`}
              />
            );
          })}
        </div>

        {/* Mobile D-Pad Controls */}
        <div className="flex flex-col items-center gap-1 mb-5">
          <button
            onClick={() => changeDirection("UP")}
            className="w-12 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl font-bold active:bg-emerald-500 transition"
          >
            ▲
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => changeDirection("LEFT")}
              className="w-12 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl font-bold active:bg-emerald-500 transition"
            >
              ◀
            </button>
            <button
              onClick={() => changeDirection("RIGHT")}
              className="w-12 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl font-bold active:bg-emerald-500 transition"
            >
              ▶
            </button>
          </div>
          <button
            onClick={() => changeDirection("DOWN")}
            className="w-12 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl font-bold active:bg-emerald-500 transition"
          >
            ▼
          </button>
        </div>

        {/* Result Status Message */}
        {resultMessage && (
          <div
            className={`mb-4 p-3 rounded-xl font-black text-sm border ${
              resultMessage.includes("CASHED")
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {resultMessage}
          </div>
        )}

        {/* Betting / Action Buttons */}
        {!gameActive ? (
          <div className="space-y-3">
            <div className="bg-black/60 p-3 rounded-2xl border border-zinc-800 text-left">
              <label className="text-[10px] text-zinc-400 font-bold block mb-1 uppercase">Bet Amount ($)</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-black text-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={startGame}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3.5 rounded-2xl font-black text-lg transition shadow-lg cursor-pointer"
            >
              START GAME (${betAmount})
            </button>
          </div>
        ) : (
          <button
            onClick={cashout}
            disabled={score === 0}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-2xl font-black text-lg transition shadow-lg disabled:opacity-50 cursor-pointer animate-bounce"
          >
            CASHOUT (${currentPayout})
          </button>
        )}
      </div>
    </main>
  );
}