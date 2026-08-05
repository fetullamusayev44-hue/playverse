"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Supabase vasitəsilə sıfırlama linki göndər
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("✅ Şifrəni sıfırlamaq üçün təlimat e-poçt ünvanınıza göndərildi!");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-zinc-950 border border-yellow-500/20 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-yellow-400 mb-2">Şifrəni bərpa et</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Qeydiyyatdan keçdiyiniz e-poçt ünvanını daxil edin, sizə şifrəni yeniləmək üçün link göndərək.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-sm mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">E-poçt</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm outline-none focus:border-yellow-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Göndərilir..." : "Link göndər"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500">
          Giriş səhifəsinə qayıt?{" "}
          <Link href="/login" className="text-yellow-400 font-semibold hover:underline">
            Daxil ol
          </Link>
        </div>
      </div>
    </main>
  );
}