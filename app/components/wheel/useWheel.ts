import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../lib/game";
import {
  getUserBalance,
  placeBet,
  addBalance,
} from "../../../lib/bet";

export function useWheel() {
  const [balance, setBalance] = useState(0);

  const [bet, setBet] = useState(10);

  const [reward, setReward] = useState(0);

  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    async function loadBalance() {
      const user = await getCurrentUser();

      if (!user) return;

      const b = await getUserBalance(user.id);

      setBalance(b);
    }

    loadBalance();
  }, []);

  async function spinWheel() {
    if (spinning) return;

    const user = await getCurrentUser();

    if (!user) return;

    const result = await placeBet(user.id, bet);

    if (!result.success) {
      alert("Balance kifayət deyil");
      return;
    }

    setBalance((prev) => prev - bet);

    setSpinning(true);

    setTimeout(async () => {
      const rewards = [
        0,
        bet * 0.5,
        bet,
        bet * 1.2,
        bet * 1.5,
        bet * 2,
        bet * 5,
      ];

      const random =
        rewards[
          Math.floor(
            Math.random() * rewards.length
          )
        ];

      setReward(random);

      if (random > 0) {
        await addBalance(user.id, random);
      }

      const newBalance = await getUserBalance(user.id);

      setBalance(newBalance);

      setSpinning(false);
    }, 3000);
  }

  return {
    balance,
    bet,
    reward,
    spinning,

    setBet,

    spinWheel,
  };
}