"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      
      {/* Naviqasiya / Başlıq */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-yellow-500 tracking-wider flex items-center gap-2">
          ⚡ BigGoldWin
        </h1>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="bg-zinc-900 border border-yellow-500/50 hover:border-yellow-400 text-yellow-400 px-4 py-2 rounded-xl transition text-sm font-semibold flex items-center gap-2 shadow-lg shadow-yellow-500/10"
          >
            👑 Admin
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-zinc-900 border border-yellow-500/50 hover:border-yellow-400 text-yellow-400 px-4 py-2 rounded-xl transition text-sm font-semibold flex items-center gap-2 shadow-lg shadow-yellow-500/10 cursor-pointer"
          >
            ℹ️ About BigGoldWin
          </button>
          
          <Link
            href="/login"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold transition text-sm shadow-lg shadow-yellow-500/10"
          >
            Login
          </Link>
          
          <Link
            href="/register"
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-4 py-2 rounded-xl font-semibold transition text-sm"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Boş Oyun Sahəsi / Əsas Mərkəz */}
      <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-xl font-bold text-zinc-300 mb-2">Welcome to BigGoldWin</h2>
        <p className="text-zinc-500 max-w-md text-sm mb-6">
          Your ultimate crypto gaming and high-reward platform. New exciting games and features are coming soon!
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-xl transition text-sm"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Ətraflı Məlumat Modalı (Popup) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-yellow-500/30 max-w-lg w-full p-6 rounded-3xl shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-extrabold text-yellow-400">About BigGoldWin</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
              <p>
                Welcome to <strong className="text-white">BigGoldWin</strong>, your ultimate decentralized destination for secure, fast, and high-reward crypto gaming. Our platform is engineered to deliver a seamless and transparent betting and gaming experience.
              </p>
              
              <div className="border-t border-zinc-800 pt-3">
                <h4 className="font-bold text-yellow-400 mb-1">Key Features:</h4>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li><strong className="text-zinc-200">Instant Payouts:</strong> Withdraw your earnings securely and instantly via crypto networks.</li>
                  <li><strong className="text-zinc-200">Provably Fair Games:</strong> Enjoy classic and modern arcade games designed with absolute transparency.</li>
                  <li><strong className="text-zinc-200">Secure Environment:</strong> Advanced encryption and state-of-the-art infrastructure to protect user data and assets.</li>
                </ul>
              </div>

              <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
                Play responsibly. BigGoldWin operates under strict cryptographic fairness protocols. 2026 All rights reserved.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2 rounded-xl font-bold transition text-sm cursor-pointer"
              >
                Got It
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}