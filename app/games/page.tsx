"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Games() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      }
    }

    checkUser();
  }, [router]);

  const games = [
    {
      name: "Snake",
      description: "Classic snake game",
      status: "Play Now",
      link: "/games/snake",
    },
    {
      name: "Tic-Tac-Toe",
      description: "Coming Soon",
      status: "Coming Soon",
      link: "#",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">🎮 PlayVerse Games</h1>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game.name}
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-700"
          >
            <h2 className="text-2xl font-bold">{game.name}</h2>

            <p className="text-gray-400 mt-2">{game.description}</p>

            {game.status === "Play Now" ? (
              <Link href={game.link}>
                <button className="mt-5 bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg">
                  Play Now
                </button>
              </Link>
            ) : (
              <button
                disabled
                className="mt-5 bg-gray-700 px-5 py-2 rounded-lg cursor-not-allowed"
              >
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}