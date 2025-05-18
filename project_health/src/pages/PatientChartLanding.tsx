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

export default function PatientChartLanding() {
  const { mergedData } = useOutletContext<{
    mergedData: { date: string; poids: number | null; pas: number | null; mood: number | null }[];
  }>();

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 text-gray-800">
      <h1 className="text-2xl font-bold">Tableau de bord rapide</h1>
      <div className="h-64 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData}>
            <XAxis dataKey="date" tick={{ fill: '#6B7280' }} />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8 }} />
            <Legend />
            <Line dataKey="poids" name="Poids (kg)" />
            <Line dataKey="pas" name="Pas" />
            {mergedData.some((d) => d.mood !== null) && <Line dataKey="mood" name="Humeur" />}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <nav className="flex flex-wrap gap-3">
        <Link to="infos" className="btn">
          Infos Patient
        </Link>
        <Link to="activites" className="btn">
          Activités
        </Link>
        <Link to="evolution" className="btn">
          Évolution
        </Link>
        <Link to="emotion" className="btn">
          Émotionnel
        </Link>
        <Link to="radar" className="btn">
          Radar
        </Link>
      </nav>
    </div>
);
}
