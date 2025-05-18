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

export default function PatientEvolutionSection() {
  const { mergedData } = useOutletContext<{
    mergedData: { date: string; poids: number | null; pas: number | null; mood: number | null }[];
  }>();

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 text-gray-800">
      <nav className="flex gap-4">
        <Link to="/patients" className="text-blue-600 hover:underline">
          ← Liste des patients
        </Link>
        <Link to=".." className="text-blue-600 hover:underline">
          ← Tableau de bord
        </Link>
      </nav>

      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Évolution des données</h2>
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
      </section>
    </div>
);
}
