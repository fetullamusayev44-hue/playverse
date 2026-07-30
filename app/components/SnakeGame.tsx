"use client";

import { useSnake } from "./useSnake";

export default function SnakeGame() {
  const {
    snake,
    food,
    score,
    gameOver,
    restartGame,
  } = useSnake();

  return (
    <div className="flex flex-col items-center">

      <h1 className="text-4xl font-bold text-green-400 mb-2">
        🐍 Snake
      </h1>

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
            🔄 Play Again
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