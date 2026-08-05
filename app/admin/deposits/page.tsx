"use client";

import AdminGuard from "@/app/components/AdminGuard";

export default function DepositsPage() {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-zinc-950 text-white p-10">
        <h1 className="text-4xl font-bold mb-8">
          Deposit Requests
        </h1>

        <div className="bg-zinc-900 rounded-xl p-6">
          <p>No deposit requests yet.</p>
        </div>
      </main>
    </AdminGuard>
  );
}