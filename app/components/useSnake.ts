import { useEffect, useState } from "react";

export function useSnake() {
  const [snake, setSnake] = useState([210, 211, 212]);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowRight":
          setDirection(1);
          break;
        case "ArrowLeft":
          setDirection(-1);
          break;
        case "ArrowUp":
          setDirection(-20);
          break;
        case "ArrowDown":
          setDirection(20);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[prev.length - 1];
        let newHead = head + direction;

        if (newHead < 0) newHead = 399;
        if (newHead > 399) newHead = 0;

        return [...prev.slice(1), newHead];
      });
    }, 300);

    return () => clearInterval(interval);
  }, [direction]);

  return { snake };
}