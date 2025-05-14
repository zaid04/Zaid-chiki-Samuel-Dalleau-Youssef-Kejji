// src/pages/Patients.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

type Person = { id: number; firstname: string; lastname: string };

export default function Patients() {
  const [patients, setPatients] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/items/people')
      .then(r => setPatients(r.data.data))
      .catch(() => setError('Impossible de charger la liste.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Chargement…</p>;
  if (error)   return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="max-w-xl p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-semibold">Patients</h1>
      <ul className="space-y-2">
        {patients.map(p => (
          <li
            key={p.id}
            className="rounded border p-3 hover:bg-slate-50 flex justify-between"
          >
            <span>{p.firstname} {p.lastname}</span>
            <Link
              to={`/patients/${p.id}`}
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
