"use client";

import { useState } from "react";
import { useSnake } from "./useSnake";

export default function SnakeGame() {
  const { snake } = useSnake();
  const [score] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-2xl font-bold text-yellow-400">
        🏆 Score: {score}
      </p>

      <div className="grid grid-cols-20 gap-[1px] bg-green-700 p-2 rounded-lg">
        {Array.from({ length: 400 }).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 ${
              snake.includes(index) ? "bg-green-900" : "bg-green-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}