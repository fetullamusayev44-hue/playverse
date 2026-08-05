"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkUserAndAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (data?.is_admin) {
          setIsAdmin(true);
        }
      }
    }

    checkUserAndAdmin();
  }, []);

  // Yalnız localhost-da true olacaq
  const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

  return (
    <nav className="w-full bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex justify-between items-center text-white">
      {/* Logo */}
      <Link href="/" className="text-2xl font-black text-purple-500 flex items-center gap-2">
        🎮 PlayVerse
      </Link>

      {/* Sağ Menyu Linkləri */}
      <div className="flex items-center gap-6">
        {/* Əgər istifadəçi giriş etməyibsə Register / Login göstər */}
        {!user ? (
          <>
            <Link href="/register" className="text-zinc-300 hover:text-white transition font-medium">
              Register
            </Link>
            <Link href="/login" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition font-semibold">
              Login
            </Link>
          </>
        ) : (
          <span className="text-zinc-400 text-sm">
            {user.email}
          </span>
        )}

        <Link href="/games" className="text-zinc-300 hover:text-white transition">
          Games
        </Link>
        
        <Link href="/deposit" className="text-zinc-300 hover:text-white transition">
          Deposit
        </Link>
        
        <Link href="/profile" className="text-zinc-300 hover:text-white transition">
          Profile
        </Link>

        {/* 🔒 Admin Linki: Yalnız localhost-da və səndə (admin olduqda) görünəcək */}
        {isLocalhost && isAdmin && (
          <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition font-bold">
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}