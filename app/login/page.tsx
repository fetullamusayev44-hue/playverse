"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Supabase vasitəsilə giriş
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Uğurlu girişdən sonra profilə yönləndir
    router.push("/profile");
    router.refresh();
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="bg-zinc-950 border border-yellow-500/30 max-w-md w-full p-8 rounded-3xl shadow-2xl relative">
        
        {/* Başlıq */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-yellow-400 mb-2">Welcome Back</h1>
          <p className="text-zinc-400 text-sm">Sign in to your BigGoldWin account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-zinc-400">Password</label>
              <Link href="/forgot-password" className="text-xs text-yellow-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition text-sm mt-2 cursor-pointer shadow-lg shadow-yellow-500/10 disabled:opacity-50"
          >
            {loading ? "Giriş edilir..." : "Login"}
          </button>
        </form>

        {/* Qeydiyyata keçid */}
        <p className="text-center text-xs text-zinc-500 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-yellow-400 hover:underline font-semibold">
            Register here
          </Link>
        </p>

      </div>
    </main>
  );
}