import { useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import Card from '../components/Card'

export default function PatientActivitiesSection() {
  const { activities } = useOutletContext<{
    activities: {
      date: string
      type: string
      numberOfSteps: number
      duration: number
      consumedCalories: number
    }[]
  }>()
  const [filter, setFilter] = useState('all')

  const types = Array.from(new Set(activities.map(a => a.type)))
  const filtered = activities.filter(a => filter === 'all' || a.type === filter)

  const stats = {
    steps: filtered.reduce((s, a) => s + a.numberOfSteps, 0),
    duration: filtered.reduce((s, a) => s + a.duration, 0),
    calories: filtered.reduce((s, a) => s + a.consumedCalories, 0),
  }

  const fmtNum = (n: number) => (n >= 1000 ? `${Math.round(n/1000)}k` : n.toLocaleString())
  const fmtDur = (m: number) => {
    const h = Math.floor(m/60), mm = m % 60
    return h > 0 ? `${h}h${mm.toString().padStart(2,'0')}` : `${mm}min`
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
        <Link to="/patients" className="hover:underline">← Patients</Link>
        <span>/ Activités</span>
      </nav>

      {/* Filter + Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Activités Physiques</h2>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg p-2"
        >
          <option value="all">Toutes les activités</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Pas total', value: fmtNum(stats.steps), icon: '👟' },
          { label: 'Durée totale', value: fmtDur(stats.duration), icon: '⏱️' },
          { label: 'Calories brûlées', value: fmtNum(stats.calories), icon: '🔥' },
        ].map(box => (
          <Card key={box.label} >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{box.icon}</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{box.label}</p>
                <p className="text-xl font-bold">{box.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Date','Type','Pas','Durée','Calories'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="px-4 py-2">{new Date(a.date).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-2 capitalize">{a.type}</td>
                    <td className="px-4 py-2 text-right">{a.numberOfSteps.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{a.duration} min</td>
                    <td className="px-4 py-2 text-right">{a.consumedCalories.toLocaleString()} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">Aucune activité</p>
      )}
    </div>
)
}
