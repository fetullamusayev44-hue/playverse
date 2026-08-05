export type SpinResult = {
  slots: string[];
  reward: number;
  result: string;
};

export const PAYLINES = [
  [0, 1, 2], // Yuxarı üfüqi
  [3, 4, 5], // Orta üfüqi
  [6, 7, 8], // Aşağı üfüqi
  [0, 4, 8], // Çarpaz (sol yuxarı -> sağ aşağı)
  [2, 4, 6], // Çarpaz (sağ yuxarı -> sol aşağı)
];

const PAYOUTS: Record<string, number> = {
  "🍒": 3,
  "🍋": 5,
  "🍎": 8,
  "🍇": 12,
  "🍉": 20,
  "💎": 50,
  "⭐": 100,
};

// Result prioritetləri: Yüksək prioritet kiçiyi üstələyir
const RESULT_PRIORITY: Record<string, number> = {
  jackpot: 5,
  diamond: 4,
  win: 3,
  wild: 2,
  lose: 1,
};

const REEL_1 = [
  "🍒", "🍋", "🍒", "🍇", "🍎", "🍒",
  "🍉", "🍋", "🍒", "🍇", "🍎", "🍒",
  "💎", "🍋", "🍒", "🍇", "⭐"
];

const REEL_2 = [
  "🍋", "🍒", "🍎", "🍒", "🍉", "🍋",
  "🍇", "🍒", "🍎", "🍋", "🍇", "🍒",
  "💎", "🍎", "🍒", "🍋", "⭐"
];

const REEL_3 = [
  "🍇", "🍒", "🍋", "🍎", "🍒", "🍉",
  "🍇", "🍒", "🍋", "🍎", "🍒", "🍇",
  "💎", "🍒", "🍋", "🍎", "⭐"
];

function pickColumn(reel: string[], index: number) {
  return [
    reel[(index + reel.length - 1) % reel.length],
    reel[index],
    reel[(index + 1) % reel.length],
  ];
}

function buildGrid() {
  const r1 = Math.floor(Math.random() * REEL_1.length);
  const r2 = Math.floor(Math.random() * REEL_2.length);
  const r3 = Math.floor(Math.random() * REEL_3.length);

  const c1 = pickColumn(REEL_1, r1);
  const c2 = pickColumn(REEL_2, r2);
  const c3 = pickColumn(REEL_3, r3);

  return [
    c1[0], c2[0], c3[0],
    c1[1], c2[1], c3[1],
    c1[2], c2[2], c3[2],
  ];
}

// Result-u daha böyük nəticə ilə yeniləyən köməkçi funksiya
function updateResult(currentResult: string, newResult: string): string {
  const currentRank = RESULT_PRIORITY[currentResult] || 0;
  const newRank = RESULT_PRIORITY[newResult] || 0;
  return newRank > currentRank ? newResult : currentResult;
}

function evaluateGrid(grid: string[], bet: number): SpinResult {
  let reward = 0;
  let result = "lose";

  for (const line of PAYLINES) {
    const a = grid[line[0]];
    const b = grid[line[1]];
    const c = grid[line[2]];

    // 1. DƏQİQ 3 EY Nİ SİMVOL
    if (a === b && b === c) {
      reward += bet * PAYOUTS[a];

      if (a === "⭐") {
        result = updateResult(result, "jackpot");
      } else if (a === "💎") {
        result = updateResult(result, "diamond");
      } else {
        result = updateResult(result, "win");
      }

      continue;
    }

    // 2. WILD (⭐) ƏVƏZEDİCİ İŞLƏMƏSİ
    const symbols = [a, b, c];
    const wilds = symbols.filter((s) => s === "⭐").length;

    if (wilds === 1) {
      const normal = symbols.filter((s) => s !== "⭐");

      if (normal.length === 2 && normal[0] === normal[1]) {
        reward += bet * PAYOUTS[normal[0]];
        result = updateResult(result, "wild");
      }
    }
  }

  return {
    slots: grid,
    reward,
    result,
  };
}

export function generateSpin(bet: number): SpinResult {
  const grid = buildGrid();
  return evaluateGrid(grid, bet);
}