"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Cari istifadəçini yoxla
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Auth statusunun dəyişməsini dinlə (Login / Logout olanda avtomatik yenilənməsi üçün)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="w-full bg-black border-b border-zinc-800 px-6 py-4 flex items-center justify-between text-white">
      {/* Sol tərəf / Loqo */}
      <Link href="/" className="text-xl font-black text-yellow-400 tracking-wider">
        BigGoldWin
      </Link>

      {/* Orta / Sağ menyu linkləri */}
      <div className="flex items-center gap-6 text-sm font-semibold">
        <Link href="/games" className="hover:text-yellow-400 transition">Games</Link>
        <Link href="/deposit" className="hover:text-yellow-400 transition">Deposit</Link>

        {/* İstifadəçi LOGIN OLMAYIBSA: Register və Login göstər */}
        {!user ? (
          <>
            <Link href="/register" className="hover:text-yellow-400 transition">Register</Link>
            <Link 
              href="/login" 
              className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold hover:bg-yellow-400 transition"
            >
              Login
            </Link>
          </>
        ) : (
          /* İstifadəçi LOGIN OLUBSA: Profile, Admin və Log out göstər */
          <>
            <Link href="/profile" className="hover:text-yellow-400 transition">Profile</Link>
            <Link href="/admin" className="text-yellow-400 hover:underline">Admin</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl font-semibold hover:bg-red-500/30 transition cursor-pointer"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}