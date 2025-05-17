import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthCtx } from '../contexts/AuthContext';
import LogoutButton from './logoutbtn';

type Person = { id: number; firstname: string; lastname: string };

export default function Patients() {
  const [patients, setPatients] = useState<Person[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthCtx);

  useEffect(() => {
    api
      .get('/items/people')
      .then(r => setPatients(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p =>
    `${p.firstname} ${p.lastname}`.toLowerCase().includes(query.toLowerCase()),
  );

  if (loading) return <p className="p-4 text-green-500">Chargement…</p>;

  return (
    <div className="mx-auto max-w-xl p-4">
      {/* Header utilisateur */}
      {auth && (
        <div className="mb-6 flex justify-between items-center rounded border-l-4 border-green-400 bg-green-50 p-4 shadow-sm text-green-800">
          <p>
            👋 <strong>Bienvenue</strong>, <strong>{auth.email}</strong>  
          </p>
          <LogoutButton />
        </div>
      )}

      <h1 className="mb-4 text-3xl font-bold text-green-600">📋 Liste des patients</h1>

      {/* Barre de recherche */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Rechercher un patient…"
        className="mb-6 w-full rounded border border-green-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-300"
      />

      {/* Liste des patients */}
      <ul className="space-y-3">
        {filtered.map(p => (
          <li
            key={p.id}
            className="flex justify-between items-center rounded border border-green-200 bg-white p-4 shadow-sm transition hover:bg-yellow-50"
          >
            <span className="text-gray-800 font-medium">
              {p.firstname} {p.lastname}
            </span>
            <Link
              to={`/patients/${p.id}`}
              state={{ person: p }}
              className="text-green-600 hover:text-green-800 hover:underline font-semibold"
            >
              Voir fiche →
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-4 text-center text-yellow-600">Aucun patient trouvé.</p>
      )}
    </div>
  );
}

