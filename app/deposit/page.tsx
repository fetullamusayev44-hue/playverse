"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/game";
import { getWallets } from "@/lib/wallet";
import { createDeposit } from "@/lib/deposit";

export default function DepositPage() {
  const [wallets, setWallets] = useState<any[]>([]);

  const [coin, setCoin] = useState("USDT");

  const [amount, setAmount] = useState("");

  const [txid, setTxid] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getWallets();
      setWallets(data);
    }

    load();
  }, []);

  async function submitDeposit() {
    const user = await getCurrentUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!amount || !txid) {
      alert("Fill all fields");
      return;
    }

    const success = await createDeposit(
      user.id,
      coin,
      Number(amount),
      txid
    );

    if (success) {
      alert("Deposit request sent ✅");
      setAmount("");
      setTxid("");
    }
  }

  const selectedWallet =
    wallets.find((w) => w.coin === coin);

  return (
    <main className="min-h-screen bg-black text-white flex justify-center items-center">

      <div className="bg-zinc-900 p-8 rounded-xl w-[500px]">

        <h1 className="text-4xl font-bold mb-8">
          Deposit
        </h1>

        <label>Coin</label>

        <select
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-5"
        >
          {wallets.map((wallet) => (
            <option
              key={wallet.id}
              value={wallet.coin}
            >
              {wallet.coin}
            </option>
          ))}
        </select>

        <label>Amount</label>

        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 mb-5"
        />

        <label>Wallet Address</label>

        <input
          readOnly
          value={selectedWallet?.address || ""}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-5"
        />

        <label>Transaction Hash (TXID)</label>

        <input
          value={txid}
          onChange={(e) =>
            setTxid(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 mb-8"
        />

        <button
          onClick={submitDeposit}
          className="w-full bg-green-600 p-3 rounded-lg hover:bg-green-500"
        >
          Submit Deposit
        </button>

      </div>

    </main>
  );
}