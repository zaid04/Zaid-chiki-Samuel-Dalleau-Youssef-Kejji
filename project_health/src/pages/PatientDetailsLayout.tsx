import { Outlet, useParams, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';
import { AxiosError } from 'axios';

type Person = {
  id: string;
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
type Activity = {
  date: string;
  type: string;
  numberOfSteps: number;
  duration: number;
  consumedCalories: number;
};
type Psychic = { date: string; feeling: string; mood_score: number };
type Merged = {
  date: string;
  poids: number | null;
  pas: number | null;
  mood: number | null;
};

export default function PatientDetailsLayout() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as { state?: { person?: Person } };

  const [person, setPerson] = useState<Person | null>(
    location.state?.person ?? null
  );
  const [physio, setPhysio] = useState<Physio[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [psychic, setPsychic] = useState<Psychic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const auth = localStorage.getItem('auth');
        if (!auth) throw new Error('Authentification requise');
        setAuthToken(JSON.parse(auth).token);

        const [personRes, physRes, actRes, psyRes] = await Promise.all([
          !person && api.get(`/items/people/${id}`),
          api.get('/items/physiologicalData', {
            params: { 'filter[people_id][_eq]': id },
          }),
          api.get('/items/physicalActivities', {
            params: { 'filter[people_id][_eq]': id },
          }),
          api.get('/items/psychicData', {
            params: { 'filter[people_id][_eq]': id },
          }),
        ]);

        // personne
        if (personRes) setPerson(personRes.data.data);

        // données physio & activités
        setPhysio(physRes.data.data);
        setActivities(actRes.data.data);

        // mapping feeling → mood_score
        const feelingMap: Record<string, number> = {
          hopeless: 0,
          lazy: 2,
          'losing motivation': 4,
          enduring: 6,
          addicted: 8,
          motivated: 10,
        };
        const psyRaw: { date: string; feeling: string }[] =
          psyRes.data.data;
        const psyWithScore: Psychic[] = psyRaw.map((p) => ({
          date: p.date,
          feeling: p.feeling,
          mood_score: feelingMap[p.feeling] ?? 0,
        }));
        setPsychic(psyWithScore);
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? err.response?.data?.message || err.message
            : 'Erreur de chargement';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  if (loading) return <div className="p-4">Chargement…</div>;
  if (error)
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>❌ {error}</p>
        <Link
          to="/patients"
          className="mt-2 inline-block text-blue-600 hover:underline"
        >
          ← Retour aux patients
        </Link>
      </div>
    );

  // fusion pour chart
  const mergedData: Merged[] = physio.map((p) => ({
    date: p.date,
    poids: p.weight,
    pas: activities.find((a) => a.date === p.date)?.numberOfSteps ?? null,
    mood: psychic.find((s) => s.date === p.date)?.mood_score ?? null,
  }));

  return (
    <Outlet context={{ person, physio, activities, psychic, mergedData }} />
  );
}
