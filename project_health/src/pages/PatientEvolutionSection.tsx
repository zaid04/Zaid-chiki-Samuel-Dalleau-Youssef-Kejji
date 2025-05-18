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
    <div className="px-4 py-6 mx-auto space-y-6 text-gray-800 max-w-6xl">
      <nav className="flex gap-4">
        <Link to="/patients" className="text-blue-600 hover:underline">← Liste des patients</Link>
        <Link to=".."       className="text-blue-600 hover:underline">← Tableau de bord</Link>
      </nav>

      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">Évolution des données</h2>
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
      </section>
    </div>
  );
}
