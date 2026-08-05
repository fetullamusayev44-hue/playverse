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

          <div className="flex items-center gap-6">

            <Link href="/register" className="text-zinc-300 hover:text-white transition font-medium">
              Register
            </Link>

            <Link href="/login" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition font-semibold">
              Login
            </Link>

            <Link href="/games" className="text-zinc-300 hover:text-transition">
              Games
            </Link>

            <Link href="/deposit" className="text-zinc-300 hover:text-transition">
              Deposit
            </Link>

            <Link href="/profile" className="text-zinc-300 hover:text-transition">
              Profile
            </Link>

            {/* Vercel-də avtomatik gizlənməsi üçün sadə script */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if (window.location.hostname !== 'localhost') {
                    document.addEventListener('DOMContentLoaded', () => {
                      const adminLink = document.getElementById('admin-link');
                      if (adminLink) adminLink.style.display = 'none';
                    });
                  }
                `,
              }}
            />
            
            <a 
              id="admin-link" 
              href="/admin" 
              className="text-yellow-400 hover:text-yellow-300 transition font-bold"
            >
              Admin
            </a>

          </div>

        </nav>

        {children}

      </body>
    </html>
  );
}