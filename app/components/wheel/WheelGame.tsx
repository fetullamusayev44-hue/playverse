"use client";

import { useWheel } from "./useWheel";

export default function WheelGame() {
  const {
    balance,
    bet,
    reward,
    spinning,
    setBet,
    spinWheel,
  } = useWheel();

  return (
    <div className="flex flex-col items-center">

      <h1 className="text-4xl font-bold mb-4">
        🎰 Lucky Wheel
      </h1>

      <p className="text-2xl mb-2">
        💰 Balance: ${balance}
      </p>

      <p className="text-xl mb-4">
        🎯 Bet: ${bet}
      </p>

      <div className="flex gap-2 mb-6">
        {[10,20,50,100].map((value)=>(
          <button
            key={value}
            onClick={()=>setBet(value)}
            className={`px-4 py-2 rounded-lg ${
              bet===value
                ? "bg-green-600"
                : "bg-zinc-700"
            }`}
          >
            ${value}
          </button>
        ))}
      </div>

      <div
        className={`w-64 h-64 rounded-full border-8 border-yellow-400 flex items-center justify-center text-5xl font-bold ${
          spinning ? "animate-spin" : ""
        }`}
      >
        🎡
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className="mt-8 px-8 py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-zinc-700"
      >
        {spinning ? "Spinning..." : "SPIN"}
      </button>

      <h2 className="mt-8 text-3xl text-yellow-400">
        Reward: ${reward}
      </h2>

    </div>
  );
}