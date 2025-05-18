// src/pages/PatientDetailsLayout.tsx
import { Outlet, useParams, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';
import { AxiosError } from 'axios';

export default function PatientDetailsLayout() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as { state?: { person?: any } };

  const [person, setPerson] = useState(location.state?.person ?? null);
  const [physio, setPhysio] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [psychic, setPsychic] = useState<any[]>([]);
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

        if (pRes) setPerson(pRes.data.data);
        setPhysio(phRes.data.data);
        setActivities(aRes.data.data);

        const mapScore: Record<string, number> = {
          hopeless: 0,
          lazy: 2,
          'losing motivation': 4,
          enduring: 6,
          addicted: 8,
          motivated: 10,
        };
        setPsychic(
          psRes.data.data.map((p: any) => ({
            date: p.date,
            feeling: p.feeling,
            mood_score: mapScore[p.feeling] ?? 0,
          }))
        );
      } catch (e: any) {
        setError(e.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  if (loading) return <p>Chargement…</p>;
  if (error)
    return (
      <div className="text-red-500">
        Erreur : {error}
        <Link to="/patients" className="block mt-2 text-blue-500">
          ← Retour
        </Link>
      </div>
    );

  const mergedData = physio.map((p) => ({
    date: p.date,
    poids: p.weight,
    pas: activities.find((a) => a.date === p.date)?.numberOfSteps ?? null,
    mood: psychic.find((s) => s.date === p.date)?.mood_score ?? null,
  }));

  return (
    <Outlet
      context={{ person, physio, activities, psychic, mergedData }}
    />
  );
}
