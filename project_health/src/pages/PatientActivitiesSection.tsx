import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

export default function PatientActivitiesSection() {
  const { activities } = useOutletContext<{
    activities: {
      date: string;
      type: string;
      numberOfSteps: number;
      duration: number;
      consumedCalories: number;
    }[];
  }>();
  const [filter, setFilter] = useState('all');

  const types = Array.from(new Set(activities.map((a) => a.type)));
  const filtered = activities.filter((a) => filter === 'all' || a.type === filter);

  const stats = {
    steps: filtered.reduce((s, a) => s + a.numberOfSteps, 0),
    duration: filtered.reduce((s, a) => s + a.duration, 0),
    calories: filtered.reduce((s, a) => s + a.consumedCalories, 0),
  };

  const fmtNum = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : n.toLocaleString());
  const fmtDur = (m: number) => {
    const h = Math.floor(m / 60),
      mm = m % 60;
    return h > 0 ? `${h}h${mm.toString().padStart(2, '0')}` : `${mm}min`;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6 text-gray-800">
      <nav className="flex gap-4">
        <Link to="/patients" className="text-blue-600 hover:underline">
          ← Liste des patients
        </Link>
        <Link to=".." className="text-blue-600 hover:underline">
          ← Tableau de bord
        </Link>
      </nav>

      <section className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Activités Physiques</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-48 p-2 border rounded-lg"
          >
            <option value="all">Toutes</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Pas total', value: stats.steps > 0 ? fmtNum(stats.steps) : '-' },
            { label: 'Durée totale', value: stats.duration > 0 ? fmtDur(stats.duration) : '-' },
            { label: 'Calories brûlées', value: stats.calories > 0 ? fmtNum(stats.calories) : '-' },
          ].map((box) => (
            <div key={box.label} className="flex items-center p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600">{box.label}</p>
              <p className="text-xl font-semibold text-gray-800 ml-auto">{box.value}</p>
            </div>
          ))}
        </div>
        {filtered.length ? (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left text-gray-700">Date</th>
                  <th className="p-2 text-left text-gray-700">Type</th>
                  <th className="p-2 text-right text-gray-700">Pas</th>
                  <th className="p-2 text-right text-gray-700">Durée</th>
                  <th className="p-2 text-right text-gray-700">Calories</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2 text-gray-800">{new Date(a.date).toLocaleDateString('fr-FR')}</td>
                    <td className="p-2 capitalize text-gray-800">{a.type}</td>
                    <td className="p-2 text-right text-gray-800">{a.numberOfSteps.toLocaleString()}</td>
                    <td className="p-2 text-right text-gray-800">{a.duration} min</td>
                    <td className="p-2 text-right text-gray-800">{a.consumedCalories.toLocaleString()} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">Aucune activité</p>
        )}
      </section>
    </div>
);
}
