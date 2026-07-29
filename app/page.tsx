export default function Games() {
  const games = [
    {
      name: "🐍 Snake",
      description: "Classic snake game",
      status: "Available",
    },
    {
      name: "⭕ Tic-Tac-Toe",
      description: "Challenge your friends",
      status: "Coming Soon",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        🎮 PlayVerse Games
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game.name}
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-700"
          >
            <h2 className="text-2xl font-bold">{game.name}</h2>

            <p className="text-gray-400 mt-2">
              {game.description}
            </p>

            <button className="mt-5 bg-purple-600 px-5 py-2 rounded-lg">
              {game.status}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}