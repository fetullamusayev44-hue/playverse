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

      <h1 className="text-5xl font-extrabold text-green-400 mb-2">
        🐍 Snake
      </h1>

      <p className="text-2xl font-bold text-yellow-400 mb-6">
        🏆 Score: {score}
      </p>

      {gameOver && (
        <div className="mb-6 flex flex-col items-center">

          <h2 className="text-4xl font-extrabold text-red-500 animate-pulse">
            💀 GAME OVER
          </h2>

          <button
            onClick={restartGame}
            className="mt-4 px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 font-bold text-lg transition"
          >
            🔄 Play Again
          </button>

        </div>
      )}

      <div className="grid grid-cols-20 gap-[2px] bg-zinc-900 border-4 border-green-500 p-3 rounded-2xl shadow-2xl">

        {Array.from({ length: 400 }).map((_, index) => {

          let color =
            "bg-green-300";

          if (index === food) {
            color =
              "bg-red-500 shadow-lg shadow-red-500";
          }

          if (snake.includes(index)) {
            color =
              "bg-green-950 shadow-md shadow-green-500";
          }

          return (
            <div
              key={index}
              className={`w-5 h-5 rounded-sm transition-all duration-100 ${color}`}
            />
          );
        })}

      </div>

      <div className="mt-8 text-zinc-400 text-center">

        <p>🎮 Use Arrow Keys to Move</p>

        <p className="mt-2">
          🍎 Eat apples to increase your score.
        </p>

      </div>

    </div>
  );
}