import { useEffect, useState } from "react";
import {
  saveGame,
  getCurrentUser,
} from "../../lib/game";
import {
  addBalance,
} from "../../lib/bet";

const BOARD_SIZE = 20;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

export function useSnake(started: boolean) {
  const [snake, setSnake] = useState([210, 211, 212]);
  const [direction, setDirection] = useState(1);

  const [food, setFood] = useState(150);

  const [score, setScore] = useState(0);

  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowRight":
          if (direction !== -1) setDirection(1);
          break;

        case "ArrowLeft":
          if (direction !== 1) setDirection(-1);
          break;

        case "ArrowUp":
          if (direction !== 20) setDirection(-20);
          break;

        case "ArrowDown":
          if (direction !== -20) setDirection(20);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!started) return;

    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[prev.length - 1];

        let newHead = head + direction;

        if (newHead < 0) newHead = TOTAL_CELLS - 1;

        if (newHead >= TOTAL_CELLS) newHead = 0;

        if (prev.includes(newHead)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [...prev, newHead];

        if (newHead === food) {
          setScore((s) => s + 10);

          let newFood = Math.floor(Math.random() * TOTAL_CELLS);

          while (newSnake.includes(newFood)) {
            newFood = Math.floor(Math.random() * TOTAL_CELLS);
          }

          setFood(newFood);

          return newSnake;
        }

        newSnake.shift();

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [started, direction, food, gameOver]);

  useEffect(() => {
    async function finishGame() {
      if (!gameOver) return;

      const user = await getCurrentUser();

      if (!user) return;

      await saveGame(user.id, score);

      const reward = Math.floor(score / 5);

      if (reward > 0) {
        await addBalance(user.id, reward);
      }
    }

    finishGame();
  }, [gameOver, score]);

  function restartGame() {
    setSnake([210, 211, 212]);
    setDirection(1);
    setFood(150);
    setScore(0);
    setGameOver(false);
  }

  return {
    snake,
    food,
    score,
    gameOver,
    restartGame,
  };
}