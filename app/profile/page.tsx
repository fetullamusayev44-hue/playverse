"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);

    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !user) return;

    const fileName = `${user.id}/avatar-${Date.now()}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    setAvatarUrl(data.publicUrl);

    await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        avatar_url: data.publicUrl,
      });

    alert("Avatar uploaded successfully!");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-[420px] shadow-xl">

        <div className="flex flex-col items-center">

          <img
            src={avatarUrl || "https://placehold.co/120x120"}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-purple-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            className="mt-4"
          />

          <h1 className="text-3xl font-bold mt-5">
            My Profile
          </h1>

          <div className="w-full mt-8 space-y-4">

            <div className="bg-zinc-800 p-4 rounded-xl">
              <strong>Email:</strong><br />
              {user?.email ?? "Loading..."}
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <strong>User ID:</strong><br />
              {user?.id ?? "Loading..."}
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              ⭐ Level 1
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              XP 0 / 100
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}