// src/pages/PatientEmotionSection.tsx
import { useOutletContext, Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Mapping cohérent avec le layout
const feelingMap: Record<string, number> = {
  hopeless: 0,
  lazy: 2,
  'losing motivation': 4,
  enduring: 6,
  addicted: 8,
  motivated: 10,
};

export default function PatientEmotionSection() {
  const { psychic: rawPsychic } = useOutletContext<{
    psychic: { date: string; feeling: string }[];
  }>();

  // Map + tri chronologique
  const psychic = rawPsychic
    .map((p) => ({
      date: p.date,
      feeling: p.feeling,
      mood_score: feelingMap[p.feeling] ?? 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Prépare les données pour le mini-graph
  const chartData = psychic.map((p) => ({
    date: p.date,
    score: p.mood_score,
  }));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Navigation */}
      <nav className="flex gap-4 mb-2">
        <Link to="/patients" className="text-blue-400 hover:underline">
          ← Liste des patients
        </Link>
        <Link to=".." className="text-blue-400 hover:underline">
          ← Tableau de bord
        </Link>
      </nav>

      {/* Titre bien contrasté */}
      <h2 className="text-2xl font-semibold text-white mb-4">
        Suivi émotionnel
      </h2>

      {/* Mini-graph */}
      <div className="w-full h-48 bg-white rounded-xl shadow-sm p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fill: '#6B7280' }}
              ticks={[0, 2, 4, 6, 8, 10]}
            />
            <Tooltip
              formatter={(value: number) => `${value}/10`}
              labelFormatter={(label: string) =>
                new Date(label).toLocaleDateString('fr-FR')
              }
              contentStyle={{ background: '#fff', borderRadius: 8 }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Détail des entrées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {psychic.map((p, i) => (
          <div
            key={i}
            className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <span className="text-2xl mr-4">
              {p.mood_score >= 8
                ? '😊'
                : p.mood_score >= 5
                ? '🙂'
                : p.mood_score >= 3
                ? '😐'
                : '😞'}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {new Date(p.date).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-gray-700 mt-1 capitalize">{p.feeling}</p>
              <div className="flex items-center mt-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${(p.mood_score / 10) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  {p.mood_score}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
