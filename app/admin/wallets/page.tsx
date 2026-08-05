"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/app/components/AdminGuard";
import {
  getDeposits,
  approveDeposit,
  rejectDeposit,
} from "@/lib/deposit";

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);

  useEffect(() => {
    loadDeposits();
  }, []);

  async function loadDeposits() {
    const data = await getDeposits();
    setDeposits(data);
  }

  async function approve(id: string) {
    await approveDeposit(id);
    await loadDeposits();
    alert("Deposit Approved ✅");
  }

  async function reject(id: string) {
    await rejectDeposit(id);
    await loadDeposits();
    alert("Deposit Rejected ❌");
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-zinc-950 text-white p-10">
        <h1 className="text-4xl font-bold mb-8">
          Deposit Requests
        </h1>

        <div className="space-y-6">
          {deposits.map((deposit) => (
            <div
              key={deposit.id}
              className="bg-zinc-900 rounded-xl p-6"
            >
              <p>
                <strong>User:</strong> {deposit.user_id}
              </p>

              <p>
                <strong>Coin:</strong> {deposit.coin}
              </p>

              <p>
                <strong>Amount:</strong> {deposit.amount}
              </p>

              <p>
                <strong>TXID:</strong> {deposit.txid}
              </p>

              <p className="mb-4">
                <strong>Status:</strong> {deposit.status}
              </p>

              {deposit.status === "pending" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => approve(deposit.id)}
                    className="rounded-lg bg-green-600 px-5 py-2"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(deposit.id)}
                    className="rounded-lg bg-red-600 px-5 py-2"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </AdminGuard>
  );
}