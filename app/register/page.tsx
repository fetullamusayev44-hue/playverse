"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const countries = [
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "India", code: "+91", flag: "🇮🇳" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(countries[3]); // Default Azerbaijan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    const country = countries.find(c => c.name === countryName) || countries[0];
    setSelectedCountry(country);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fullPhone = `${selectedCountry.code} ${formData.phone}`;

    // 1. Supabase Auth-da qeydiyyat
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const user = authData.user;

    if (user) {
      // 2. Profiles cədvəlinə əlavə məlumatları yazmaq
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        country: selectedCountry.name,
        phone: fullPhone,
        balance: 0, // Yeni istifadəçiyə başlanğıc balans
        is_admin: false,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      alert("✅ Qeydiyyat uğurla tamamlandı!");
      router.push("/profile");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="bg-zinc-950 border border-yellow-500/30 max-w-md w-full p-8 rounded-3xl shadow-2xl relative">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-yellow-400 mb-2">Create Account</h1>
          <p className="text-zinc-400 text-sm">Join BigGoldWin to start playing and winning</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe_99"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Country / Region</label>
            <select
              value={selectedCountry.name}
              onChange={handleCountryChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition cursor-pointer"
            >
              {countries.map((country) => (
                <option key={country.name} value={country.name} className="bg-zinc-900 text-white">
                  {country.flag} {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Phone Number</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-400 text-sm font-medium flex items-center gap-1.5 pointer-events-none">
                {selectedCountry.flag} {selectedCountry.code}
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="555 123 4567"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-24 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition"
              />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Password</label>
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
            {loading ? "Gözləyin..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-400 hover:underline font-semibold">
            Login here
          </Link>
        </p>

      </div>
    </main>
  );
}