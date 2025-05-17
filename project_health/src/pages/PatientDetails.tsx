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

type Person = {
  id: string; // UUID string
  firstname: string;
  lastname: string;
  birthyear?: number;
  height?: number;
  weightStart?: number;
  weightGoal?: number;
  bmiStart?: string;
  bmiGoal?: string;
  activityProfile?: string;
};

type Physio = { date: string; weight: number };
type Activity = { date: string; steps: number };
type Psychic = { date: string; mood_score: number };

interface Merged {
  date: string;
  poids: number | null;
  pas: number | null;
  mood: number | null;
}

export default function PatientDetails() {
  const { id } = useParams();
  const location = useLocation() as { state?: { person?: Person } };

  const [person, setPerson] = useState<Person | null>(location.state?.person ?? null);
  const [physio, setPhysio] = useState<Physio[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [psychic, setPsychic] = useState<Psychic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        // On ne refait pas la requête person si on l'a déjà
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

  const merged: Merged[] = physio.map((p) => ({
    date: p.date,
    poids: p.weight,
    pas: activities.find((a) => a.date === p.date)?.steps ?? null,
    mood: psychic.find((s) => s.date === p.date)?.mood_score ?? null,
  }));

  const displayName = person ? `${person.firstname} ${person.lastname}` : `#${id}`;

  return (
    <div className="border-l-4 border-green-400 pl-4 bg-green-50 rounded-md mb-6">
      <Link
        to="/patients"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Retour à la liste
      </Link>

      <h1 className="text-primary">
        <span className="text-3xl">👤</span>
        Fiche patient&nbsp;<span className="text-gray-900">{displayName}</span>
      </h1>

      {/* Infos personnelles */}
      {person && (
        <div className="mb-6 text-gray-700 space-y-1">
          {person.birthyear && <p>Année de naissance : {person.birthyear}</p>}
          {person.height && <p>Taille : {person.height} cm</p>}
          {person.weightStart && <p>Poids de départ : {person.weightStart} kg</p>}
          {person.weightGoal && <p>Objectif poids : {person.weightGoal} kg</p>}
          {person.bmiStart && <p>IMC de départ : {person.bmiStart}</p>}
          {person.bmiGoal && <p>Objectif IMC : {person.bmiGoal}</p>}
          {person.activityProfile && <p>Profil d’activité : {person.activityProfile}</p>}
          {person.weightGoal && person.weightStart && person.weightStart > person.weightGoal && (
            <p className="text-red-600 font-medium">
              ⚠ Le poids de départ est supérieur à l’objectif.
            </p>
          )}
          {person.weightGoal && person.weightStart && person.weightStart <= person.weightGoal && (
            <p className="text-green-600 font-medium">
              L'objectif de poid est atteint !
            </p>
          )}
        </div>
      )}

      {/* Graphiques */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="poids"
              stroke="#34D399" // vert clair (tailwind green-400)
              strokeWidth={2}
              name="Poids (kg)"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="pas"
              stroke="#FBBF24" // jaune (tailwind yellow-400)
              strokeDasharray="4 4"
              name="Pas"
              dot={{ r: 4 }}
            />
            {merged.some((m) => m.mood !== null) && (
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#F87171" // rouge clair (tailwind red-400)
                strokeDasharray="2 2"
                name="Humeur"
                dot={{ r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
