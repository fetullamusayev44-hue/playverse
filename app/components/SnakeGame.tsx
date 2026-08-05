"use client";

import { useEffect, useState } from "react";
import { useSnake } from "./useSnake";
import { getCurrentUser } from "../../lib/game";
import {
  getUserBalance,
  placeBet,
} from "../../lib/bet";

export default function SnakeGame() {
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(10);
  const [started, setStarted] = useState(false);

  const {
    snake,
    food,
    score,
    gameOver,
    restartGame,
  } = useSnake(started);

  useEffect(() => {
    async function loadBalance() {
      const user = await getCurrentUser();

      if (!user) return;

      const b = await getUserBalance(user.id);

      setBalance(b);
    }

    loadBalance();
  }, []);

  async function startGame() {
    const user = await getCurrentUser();

    if (!user) return;

    const result = await placeBet(user.id, bet);

    if (!result.success) {
      alert("Balance kifayət deyil");
      return;
    }

    setBalance((prev) => prev - bet);

    restartGame();

    setStarted(true);
  }

  useEffect(() => {
    if (gameOver) {
      setStarted(false);
    }
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center">

      <h1 className="text-4xl font-bold text-green-400 mb-3">
        🐍 Snake
      </h1>

      <p className="text-2xl text-yellow-400 mb-2">
        💰 Balance: ${balance}
      </p>

      <div className="flex gap-2 mb-5">
        {[5, 10, 20, 50].map((value) => (
          <button
            key={value}
            onClick={() => setBet(value)}
            className={`px-4 py-2 rounded-lg ${
              bet === value
                ? "bg-green-600"
                : "bg-zinc-700"
            }`}
          >
            ${value}
          </button>
        ))}
      </div>
      <button
        onClick={startGame}
        disabled={started}
        className="mb-5 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-zinc-700"
      >
        ▶ Play (${bet})
      </button>

      <p className="text-2xl font-bold text-yellow-400 mb-4">
        🏆 Score: {score}
      </p>

      {gameOver && (
        <div className="mb-4 text-center">
          <h2 className="text-red-500 text-3xl font-bold">
            💀 Game Over
          </h2>

          <button
            onClick={restartGame}
            className="mt-4 px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500"
          >
            🔄 Restart
          </button>
        </div>
      )}

      <div className="grid grid-cols-20 gap-[2px] bg-green-800 p-3 rounded-xl">
        {Array.from({ length: 400 }).map((_, index) => {
          let color = "bg-green-300";

          if (index === food) {
            color = "bg-red-500";
          }

          if (snake.includes(index)) {
            color = "bg-green-950";
          }

          return (
            <div
              key={index}
              className={`w-5 h-5 rounded-sm ${color}`}
            />
          );
        })}
      </div>
      <div className="mt-6 text-zinc-300">
        ⬅️➡️⬆️⬇️ Arrow Keys ilə oynayın
      </div>

    </div>
  );
}