import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="rounded-lg bg-white shadow-md p-6 border border-green-200">
        <h1 className="mb-6 text-center text-3xl font-bold text-green-600">
          🩺 Dashboard Projet Health
        </h1>

        <nav className="flex flex-col gap-4">
          <Link
            to="/login"
            className="rounded bg-green-400 py-2 text-center text-white font-semibold shadow hover:bg-green-500 transition"
          >
            Se connecter
          </Link>

          <Link
            to="/patients"
            className="rounded border border-green-300 py-2 text-center text-green-700 hover:bg-yellow-100 hover:text-green-900 transition"
          >
            Liste des patients
          </Link>
        </nav>
      </div>
    </div>
  );
}