import { useParams, Link, useLocation } from 'react-router-dom';
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
import { AxiosError } from 'axios';

type Person   = { id: number; firstname: string; lastname: string };
type Physio   = { date: string; weight: number };
type Activity = { date: string; steps: number };
type Psychic  = { date: string; mood_score: number };

interface Merged {
  date: string;
  poids: number | null;
  pas: number | null;
  mood: number | null;
}

export default function PatientDetails() {
  const { id } = useParams();
  const location = useLocation() as { state?: { person?: Person } };

  const [person,     setPerson]     = useState<Person | null>(location.state?.person ?? null);
  const [physio,     setPhysio]     = useState<Physio[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [psychic,    setPsychic]    = useState<Psychic[]>([]);
  const [loading,    setLoading]    = useState(true);

  /* ──────────────── fetch intégré ──────────────── */
  useEffect(() => {
    async function fetchAll() {
      try {
        const reqPerson = person ? null : api.get(`/items/people/${id}`);

        const [personRes, physRes, actRes] = await Promise.all([
          reqPerson,
          api.get('/items/physiologicalData', {
            params: { 'filter[people_id]': id },
          }),
          api.get('/items/physicalActivities', {
            params: { 'filter[people_id]': id },
          }),
        ]);

        // PsychicData isolé : on tolère le 403
        let psyData: Psychic[] = [];
        try {
          const r = await api.get('/items/psychicData', {
            params: { 'filter[people_id]': id },
          });
          psyData = r.data.data;
        } catch (err: unknown) {
          const axiosErr = err as AxiosError;
          if (axiosErr.response?.status !== 403) throw err;
          console.warn('psychicData 403 – ignoré');
        }

        if (!person && personRes) setPerson(personRes.data.data as Person);
        setPhysio(physRes.data.data as Physio[]);
        setActivities(actRes.data.data as Activity[]);
        setPsychic(psyData);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="p-4">Chargement…</p>;

  /* ──────────────── fusion par date ──────────────── */
  const merged: Merged[] = physio.map(p => ({
    date: p.date,
    poids: p.weight,
    pas:   activities.find(a => a.date === p.date)?.steps ?? null,
    mood:  psychic.find(s    => s.date === p.date)?.mood_score ?? null,
  }));

  const displayName =
    person ? `${person.firstname} ${person.lastname}` : `#${id}`;

  /* ──────────────── rendu ──────────────── */
  return (
    <div className="mx-auto max-w-3xl p-4">
      <Link
        to="/patients"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Retour à la liste
      </Link>

      <h1 className="mb-6 text-2xl font-semibold">
        Fiche patient&nbsp;{displayName}
      </h1>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={merged}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="poids" strokeWidth={2} name="Poids (kg)" />
          <Line type="monotone" dataKey="pas" strokeDasharray="4 4" name="Pas" />
          {merged.some(m => m.mood !== null) && (
            <Line
              type="monotone"
              dataKey="mood"
              strokeDasharray="2 2"
              name="Humeur"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
