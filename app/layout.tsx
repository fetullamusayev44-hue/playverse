import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BigGoldWin",
  description: "Crypto Gaming Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-black text-white">

        <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800 bg-zinc-950">

          <Link
            href="/"
            className="text-3xl font-extrabold text-yellow-500 tracking-wider flex items-center gap-2"
          >
            🪙 BigGoldWin
          </Link>

          <div className="flex items-center gap-6">

            <Link href="/register" className="text-zinc-300 hover:text-white transition font-medium">
              Register
            </Link>

            <Link href="/login" className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl transition font-bold">
              Login
            </Link>

            <Link href="/games" className="text-zinc-300 hover:text-white transition">
              Games
            </Link>

            <Link href="/deposit" className="text-zinc-300 hover:text-white transition">
              Deposit
            </Link>

            <Link href="/profile" className="text-zinc-300 hover:text-white transition">
              Profile
            </Link>

            <Link 
              href="/admin" 
              className="text-yellow-400 hover:text-yellow-300 transition font-bold"
            >
              Admin
            </Link>

          </div>

        </nav>

        {children}

      </body>
    </html>
  );
}