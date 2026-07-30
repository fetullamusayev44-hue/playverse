"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        👑 PlayVerse Admin Panel
      </h1>

      <div className="bg-zinc-900 rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Users ({users.length})
        </h2>

        <table className="w-full">

          <thead>

            <tr className="text-left border-b border-zinc-700">

              <th className="pb-3">Avatar</th>
              <th>Email</th>
              <th>Level</th>
              <th>XP</th>
              <th>Coins</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b border-zinc-800"
              >

                <td className="py-4">

                  <img
                    src={
                      user.avatar_url ||
                      "https://placehold.co/50x50"
                    }
                    className="w-12 h-12 rounded-full"
                  />

                </td>

                <td>{user.email || "No Email"}</td>

                <td>{user.level}</td>

                <td>{user.xp}</td>

                <td>{user.coins}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}