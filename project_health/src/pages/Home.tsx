import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Dashboard Projet Health
      </h1>

      <nav className="flex flex-col gap-4">
        <Link
          to="/login"
          className="rounded bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
        >
          Se connecter
        </Link>
        <Link
          to="/patients"
          className="rounded border py-2 text-center hover:bg-slate-50"
        >
          Liste des patients
        </Link>
      </nav>
    </div>
  );
}
