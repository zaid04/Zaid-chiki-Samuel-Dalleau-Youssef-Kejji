// src/pages/PatientDetailsLayout.tsx
import { Outlet, useParams, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';
import { AxiosError } from 'axios';

type Person = { /* … */ };
type Physio = { date: string; weight: number };
type Activity = { date: string; numberOfSteps: number; duration: number; consumedCalories: number; type: string };
type Psychic = { date: string; mood_score: number; feeling: string };

export default function PatientDetailsLayout() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as { state?: { person?: Person } };

  const [person, setPerson] = useState<Person | null>(location.state?.person ?? null);
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

        const [pRes, phRes, aRes, psRes] = await Promise.all([
          !person && api.get(`/items/people/${id}`),
          api.get('/items/physiologicalData', { params: { 'filter[people_id][_eq]': id } }),
          api.get('/items/physicalActivities',  { params: { 'filter[people_id][_eq]': id } }),
          api.get('/items/psychicData',         { params: { 'filter[people_id][_eq]': id } }),
        ]);

        if (pRes) setPerson(pRes.data.data);
        setPhysio(phRes.data.data);
        setActivities(aRes.data.data);

        // mapping feeling → mood_score
        const feelingMap: Record<string, number> = {
          hopeless: 0, lazy: 2, 'losing motivation': 4,
          enduring: 6, addicted: 8, motivated: 10,
        };
        setPsychic(
          psRes.data.data.map((p: any) => ({
            date: p.date,
            feeling: p.feeling,
            mood_score: feelingMap[p.feeling] ?? 0,
          }))
        );
      } catch (e: any) {
        setError(e instanceof AxiosError ? (e.response?.data?.message || e.message) : e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  if (loading) return <div>Chargement…</div>;
  if (error)
    return (
      <div className="text-red-500">
        Erreur : {error}
        <Link to="/patients" className="block mt-2 text-blue-500">← Retour</Link>
      </div>
    );

  //
  // 1) Normalisation des dates : on garde YYYY-MM-DD
  //
  const physioByDate: Record<string, number[]> = {};
  physio.forEach(p => {
    const day = p.date.slice(0, 10);
    if (!physioByDate[day]) physioByDate[day] = [];
    physioByDate[day].push(p.weight);
  });
  // on prend le dernier poids du jour
  const physioEntries = Object.entries(physioByDate).map(([date, arr]) => ({
    date,
    weight: arr[arr.length - 1],
  }));

  //
  // 2) Regroupement des activités par date (somme des pas)
  //
  const actByDate: Record<string, number> = {};
  activities.forEach(a => {
    const day = a.date.slice(0, 10);
    actByDate[day] = (actByDate[day] || 0) + a.numberOfSteps;
  });

  //
  // 3) Regroupement de l’humeur par date (on prend la moyenne si plusieurs entrées)
  //
  const moodAcc: Record<string, { sum: number; count: number }> = {};
  psychic.forEach(p => {
    const day = p.date.slice(0, 10);
    if (!moodAcc[day]) moodAcc[day] = { sum: 0, count: 0 };
    moodAcc[day].sum += p.mood_score;
    moodAcc[day].count += 1;
  });
  const moodByDate: Record<string, number> = {};
  Object.entries(moodAcc).forEach(([day, { sum, count }]) => {
    moodByDate[day] = sum / count;
  });

  //
  // 4) Fusion des 3 sources sur la liste de toutes les dates
  //
  const allDates = Array.from(
    new Set([
      ...physioEntries.map(e => e.date),
      ...Object.keys(actByDate),
      ...Object.keys(moodByDate),
    ])
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const mergedData = allDates.map(date => ({
    date,
    poids: physioEntries.find(e => e.date === date)?.weight ?? null,
    pas: actByDate[date] ?? 0,
    mood: moodByDate[date] ?? null,
  }));

  return <Outlet context={{ person, mergedData, activities, psychic }} />;
}
