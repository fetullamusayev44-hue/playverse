export default function SnakePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-6">🐍 Snake</h1>

      <p className="text-gray-400 mb-8">
        Our first game is coming soon...
      </p>

      <div className="w-96 h-96 bg-zinc-900 border-4 border-green-500 rounded-xl flex items-center justify-center">
        <span className="text-2xl">Game Board</span>
      </div>

      <a
        href="/games"
        className="mt-8 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
      >
        ← Back to Games
      </a>
    </main>
  );
}