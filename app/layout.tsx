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
  title: "PlayVerse",
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
            className="text-3xl font-bold text-purple-500"
          >
            🎮 PlayVerse
          </Link>

          <div className="flex gap-6">

            <Link href="/">
              Home
            </Link>

            <Link href="/games">
              Games
            </Link>

            <Link href="/deposit">
              Deposit
            </Link>

            <Link href="/profile">
              Profile
            </Link>

            <Link href="/admin">
              Admin
            </Link>

          </div>

        </nav>

        {children}

      </body>
    </html>
  );
}