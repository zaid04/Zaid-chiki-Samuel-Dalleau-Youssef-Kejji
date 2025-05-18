// src/pages/PatientChartLanding.tsx
import { useOutletContext, Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

// Helper pour afficher le libellé du profil d'activité
const getActivityProfileLabel = (profile?: string) => {
  const profiles: Record<string, string> = {
    sedentary: 'Sédentaire',
    light: 'Légèrement actif',
    active: 'Actif',
    athlete: 'Athlète',
  };
  return profile ? profiles[profile] || profile : '-';
};

export default function PatientChartLanding() {
  const { 
    person,
    mergedData
  } = useOutletContext<{
    person: {
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
    mergedData: { date: string; poids: number | null; pas: number | null; mood: number | null }[];
  }>();

  const age = person.birthyear
    ? new Date().getFullYear() - person.birthyear
    : null;

  return (
    <div className="px-4 py-6 mx-auto space-y-6 text-gray-800 max-w-6xl">
      
      {/* TITRE */}
      <h1 className="text-2xl font-semibold text-white mb-4 text-center">
        Tableau de bord rapide
      </h1>

      {/* INFOS PATIENT */}
      <section className="bg-white rounded-xl shadow-sm p-6 text-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">👤</span>
          <div>
            <h2 className="text-xl font-bold">
              {person.firstname} {person.lastname}
            </h2>
            {age !== null && <p className="text-gray-600">{age} ans</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Taille</p>
            <p className="font-semibold">{person.height ?? '-'} cm</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Profil d'activité</p>
            <p className="font-semibold">{getActivityProfileLabel(person.activityProfile)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Poids initial</p>
            <p className="font-semibold">{person.weightStart ?? '-'} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Objectif poids</p>
            <p className="font-semibold">{person.weightGoal ?? '-'} kg</p>
          </div>
          <div>
            <p className="text-xs text-red-600">IMC initial</p>
            <p className="font-semibold text-red-700">{person.bmiStart ?? '-'}</p>
          </div>
          <div>
            <p className="text-xs text-green-600">IMC cible</p>
            <p className="font-semibold text-green-700">{person.bmiGoal ?? '-'}</p>
          </div>
        </div>
      </section>

      {/* GRAPHIQUE */}
      <div className="w-full h-96 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData} margin={{ left: 0, right: 0, top: 10, bottom: 30 }}>
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              interval="preserveStartEnd"
              height={60}
            />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8 }} />
            <Legend verticalAlign="top" />
            <Line dataKey="poids" name="Poids (kg)" stroke="#3B82F6" dot={false} />
            <Line dataKey="pas"   name="Pas"         stroke="#10B981" dot={false} />
            {mergedData.some((d) => d.mood !== null) && (
              <Line dataKey="mood" name="Humeur" stroke="#F59E0B" dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* NAVIGATION SECTIONS */}
      <nav className="flex justify-center flex-wrap gap-3">
        <Link to="infos"     className="btn">Infos Patient</Link>
        <Link to="activites" className="btn">Activités</Link>
        <Link to="evolution" className="btn">Évolution</Link>
        <Link to="emotion"   className="btn">Émotionnel</Link>
        <Link to="radar"     className="btn">Radar</Link>
      </nav>
    </div>
  );
}
