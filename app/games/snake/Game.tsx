"use client";

import { useEffect, useRef, useState } from "react";

const BOARD = 20;

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game States
  const [running, setRunning] = useState(false);
  const [bet, setBet] = useState(10);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [diamond, setDiamond] = useState({ x: 5, y: 5 });
  const [combo, setCombo] = useState(1);
  const [profit, setProfit] = useState(0);
  const [mine, setMine] = useState({ x: 15, y: 15 });

  // Main Balance State (Initial demo balance)
  const [balance, setBalance] = useState(100.0);

  // Keyboard Controls
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "ArrowUp") setDirection((prev) => (prev.y === 1 ? prev : { x: 0, y: -1 }));
      if (e.key === "ArrowDown") setDirection((prev) => (prev.y === -1 ? prev : { x: 0, y: 1 }));
      if (e.key === "ArrowLeft") setDirection((prev) => (prev.x === 1 ? prev : { x: -1, y: 0 }));
      if (e.key === "ArrowRight") setDirection((prev) => (prev.x === -1 ? prev : { x: 1, y: 0 }));
    }

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  // Game Loop
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSnake((oldSnake) => {
        const head = oldSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Wall Collision
        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= BOARD ||
          newHead.y >= BOARD
        ) {
          setRunning(false);
          alert("💀 Game Over! You hit the wall.");
          return oldSnake;
        }

        // Mine Collision
        if (newHead.x === mine.x && newHead.y === mine.y) {
          setRunning(false);
          alert("💣 Mine Hit! You lost your bet.");
          return oldSnake;
        }

        // Self Collision
        if (
          oldSnake.some(
            (part) => part.x === newHead.x && part.y === newHead.y
          )
        ) {
          setRunning(false);
          alert("🐍 You crashed into yourself!");
          return oldSnake;
        }

        const newSnake = [newHead, ...oldSnake];

        // Eating Diamond
        if (newHead.x === diamond.x && newHead.y === diamond.y) {
          setScore((s) => s + 1);
          setCombo((c) => c + 0.5);
          setProfit((p) => p + bet * 0.5);
          setDiamond({
            x: Math.floor(Math.random() * BOARD),
            y: Math.floor(Math.random() * BOARD),
          });
          setMine({
            x: Math.floor(Math.random() * BOARD),
            y: Math.floor(Math.random() * BOARD),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [running, direction, diamond, mine, bet]);

  // Render Loop
  useEffect(() => {
    if (!running) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width / BOARD;

    // Grid
    ctx.fillStyle = "#070707";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1b1b1b";

    for (let i = 0; i <= BOARD; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Diamond
    const dx = diamond.x * size + size / 2;
    const dy = diamond.y * size + size / 2;
    ctx.beginPath();
    ctx.moveTo(dx, dy - size / 3);
    ctx.lineTo(dx + size / 4, dy);
    ctx.lineTo(dx, dy + size / 3);
    ctx.lineTo(dx - size / 4, dy);
    ctx.closePath();
    ctx.fillStyle = "#00ff99";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00ff99";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Mine
    const mx = mine.x * size + size / 2;
    const my = mine.y * size + size / 2;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#ff2d55";
    ctx.fillStyle = "#1f1f1f";
    ctx.beginPath();
    ctx.arc(mx, my, size / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#ffcc00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mx, my - size / 3);
    ctx.lineTo(mx + 6, my - size / 2);
    ctx.stroke();
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.arc(mx + 7, my - size / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snake.forEach((part, i) => {
      const x = part.x * size;
      const y = part.y * size;

      if (i === 0) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#8B5CF6";
        ctx.fillStyle = "#8B5CF6";
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, size - 4, size - 4, 8);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x + size * 0.35, y + size * 0.38, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size * 0.65, y + size * 0.38, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(x + size * 0.35, y + size * 0.38, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size * 0.65, y + size * 0.38, 1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#22C55E";
        ctx.fillStyle = "#22C55E";
        ctx.beginPath();
        ctx.roundRect(x + 3, y + 3, size - 6, size - 6, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
  }, [running, snake, diamond, mine]);

  const startGame = () => {
    if (balance < bet) {
      alert("Insufficient balance!");
      return;
    }
    // Deduct bet amount from main balance when starting game
    setBalance((prev) => prev - bet);

    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setProfit(0);
    setCombo(1);
    setRunning(true);
  };

  // Cashout Function: adds initial bet + accumulated profit back to main balance
  const handleCashout = () => {
    if (!running) return;
    setRunning(false);
    const totalPayout = bet + profit;
    setBalance((prev) => prev + totalPayout);
    alert(`🎉 CASHED OUT! $${totalPayout.toFixed(2)} added to your balance.`);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
      {/* Top Header & Account Balance */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <h1 className="text-2xl font-black text-green-400">🐍 VENOM RUSH</h1>
        <div className="bg-zinc-800 px-5 py-2 rounded-xl border border-zinc-700 text-right">
          <span className="text-xs text-zinc-400 block uppercase font-semibold">Balance</span>
          <span className="text-xl font-black text-green-400">${balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        {!running ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">
            <h2 className="text-4xl font-black mb-2">Select Bet & Play</h2>
            <p className="text-zinc-400 mb-8 text-sm">
              Collect diamonds to multiply your profit. Cashout anytime before hitting a mine!
            </p>

            <div className="grid grid-cols-4 gap-3 mb-8">
              {[5, 10, 25, 50].map((v) => (
                <button
                  key={v}
                  onClick={() => setBet(v)}
                  className={`rounded-xl py-3 font-bold transition cursor-pointer ${
                    bet === v
                      ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                      : "bg-zinc-800 hover:bg-zinc-700 text-white"
                  }`}
                >
                  ${v}
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black py-4 rounded-xl text-xl font-black hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              ▶ START GAME (${bet})
            </button>
          </div>
        ) : (
          <div>
            {/* Live Game Status & CASHOUT Button */}
            <div className="grid grid-cols-5 gap-3 mb-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                <span className="text-xs text-zinc-400 block">Bet</span>
                <div className="text-green-400 font-black">${bet}</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                <span className="text-xs text-zinc-400 block">Score</span>
                <div className="font-black">{score}</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                <span className="text-xs text-zinc-400 block">Profit</span>
                <div className="text-green-400 font-black">${profit.toFixed(2)}</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                <span className="text-xs text-zinc-400 block">Combo</span>
                <div className="font-black">x{combo.toFixed(1)}</div>
              </div>

              {/* CASHOUT BUTTON */}
              <button
                onClick={handleCashout}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-black rounded-xl p-2 transition flex flex-col items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/30 active:scale-95"
              >
                <span className="text-xs uppercase font-extrabold">CASHOUT</span>
                <span className="text-sm font-black">${(bet + profit).toFixed(2)}</span>
              </button>
            </div>

            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={700}
                height={700}
                className="rounded-3xl border border-zinc-800 bg-[#070707] w-full aspect-square"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}