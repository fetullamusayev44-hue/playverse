"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 bg-zinc-900 rounded-xl border border-zinc-800">
        <h2 className="text-2xl font-bold mb-2 text-center text-yellow-500">Create Account</h2>
        <p className="text-sm text-zinc-400 text-center mb-6">Sign up for a BigGoldWin account</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-200 text-sm rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-2 text-zinc-400">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2 text-zinc-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:border-yellow-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-xs text-zinc-400 text-center mt-6">
          Already have an account? <Link href="/login" className="text-yellow-500 hover:underline font-semibold">Login here</Link>
        </p>
      </form>
    </div>
  );
}