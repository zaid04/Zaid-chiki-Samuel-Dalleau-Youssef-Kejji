import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

type Person = { id: number; firstname: string; lastname: string };

export default function Patients() {
  const [patients, setPatients] = useState<Person[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/items/people')
      .then(r => setPatients(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p =>
    `${p.firstname} ${p.lastname}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  if (loading) return <p className="p-4">Chargement…</p>;

  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Patients</h1>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Recherche..."
        className="mb-4 w-full rounded border p-2"
      />

      <ul className="space-y-2">
        {filtered.map(p => (
          <li
            key={p.id}
            className="flex justify-between rounded border p-3 hover:bg-slate-50"
          >
            <span>
              {p.firstname} {p.lastname}
            </span>
            <Link
              to={`/patients/${p.id}`}
              state={{ person: p }}
              className="text-blue-600 hover:underline"
            >
              Voir fiche →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
