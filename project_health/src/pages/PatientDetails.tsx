import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type Physio = { date: string; weight: number };
type Activity = { date: string; steps: number };

export default function PatientDetails() {
  const { id } = useParams();
  const [physio, setPhysio] = useState<Physio[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/items/physiologicalData', {
        params: { 'filter[people_id]': id },
      }),
      api.get('/items/physicalActivities', {
        params: { 'filter[people_id]': id },
      }),
    ])
      .then(([p, a]) => {
        setPhysio(p.data.data);
        setActivities(a.data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4">Chargement…</p>;

  const merged = physio.map(p => ({
    date: p.date,
    poids: p.weight,
    pas: activities.find(a => a.date === p.date)?.steps ?? null,
  }));

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Link
        to="/patients"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Retour à la liste
      </Link>

      <h1 className="mb-6 text-2xl font-semibold">Fiche patient #{id}</h1>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={merged}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="poids" strokeWidth={2} />
          <Line type="monotone" dataKey="pas" strokeDasharray="4 4" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
