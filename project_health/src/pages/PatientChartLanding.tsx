// src/pages/PatientChartLanding.tsx
import { useOutletContext, Link } from 'react-router-dom'
import Card from '../components/Card'
import PatientRadar from '../components/PatientRadar'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

export default function PatientChartLanding() {
  const {
    person,
    mergedData,
    activities,
    psychic,
  } = useOutletContext<{
    person: {
      firstname: string
      lastname: string
      birthyear?: number
      height?: number
      weightStart?: number
      weightGoal?: number
      bmiStart?: string
      bmiGoal?: string
    }
    mergedData: { date: string; poids: number | null; pas: number | null; mood: number | null }[]
    activities: { numberOfSteps: number; duration: number; consumedCalories: number }[]
    psychic: { date: string; mood_score: number; feeling: string }[]
  }>()

  // Âge
  const age = person.birthyear
    ? new Date().getFullYear() - person.birthyear
    : '-'

  // Stats globales
  const totalSteps = activities.reduce((s, a) => s + a.numberOfSteps, 0)
  const totalDur = activities.reduce((s, a) => s + a.duration, 0)
  const totalCal = activities.reduce((s, a) => s + a.consumedCalories, 0)

  // Données émotionnelles filtrées
  const emoData = mergedData
    .filter(d => d.mood !== null)
    .map(d => ({ date: d.date, score: d.mood! }))

  // Calcul du smiley global
  const avgMood =
    emoData.length > 0
      ? emoData.reduce((sum, d) => sum + d.score, 0) / emoData.length
      : 0
  const overallEmoji =
    avgMood >= 8 ? '😊' :
    avgMood >= 5 ? '🙂' :
    avgMood >= 3 ? '😐' :
    '😞'

  // Données radar
  const latest = mergedData.slice().reverse()[0]
  const imc = (latest.poids !== null && person.height)
    ? latest.poids / ((person.height / 100) ** 2)
    : 0
  const recentActs = activities.slice(-10)
  const avgSteps = recentActs.reduce((s, a) => s + a.numberOfSteps, 0) / (recentActs.length || 1)
  const avgCal2 = recentActs.reduce((s, a) => s + a.consumedCalories, 0) / (recentActs.length || 1)
  const radarData = {
    imc,
    objectifImc: Number(person.bmiGoal) || 25,
    pasMoyens: avgSteps,
    objectifPas: 2000,
    caloriesBrulees: avgCal2,
    objectifCalories: 1000,
    etatPsy: avgMood,
  }

  return (
    <div className="space-y-8">
      {/* Fil d’Ariane */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
        <Link to="/patients" className="hover:underline">← Patients</Link>
        <span>/ Dashboard</span>
      </nav>

      {/* En-tête patient */}
      <Card>
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">👤</span>
            <div>
              <p className="text-xl font-bold">
                {person.firstname} {person.lastname}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {age} ans — {person.height ?? '-'} cm
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Poids init.</p>
              <p className="font-semibold">{person.weightStart ?? '-'} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Objectif</p>
              <p className="font-semibold">{person.weightGoal ?? '-'} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">IMC init.</p>
              <p className="font-semibold">{person.bmiStart ?? '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">IMC cible</p>
              <p className="font-semibold">{person.bmiGoal ?? '-'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Pas total', value: `${Math.round(totalSteps/1000)}k`, icon: '👟' },
          { label: 'Durée totale', value: `${Math.floor(totalDur/60)}h${totalDur%60}`, icon: '⏱️' },
          { label: 'Calories brûlées', value: `${totalCal}`, icon: '🔥' },
        ].map(b => (
          <Card key={b.label}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{b.icon}</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{b.label}</p>
                <p className="text-xl font-bold">{b.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Graphique Poids / Pas / Humeur */}
      <Card>
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData} margin={{ top: 10, right: 20, bottom: 30, left: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                angle={-45}
                textAnchor="end"
                height={50}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip contentStyle={{ background: '#fff', borderRadius: 8 }} />
              <Legend verticalAlign="top" />
              <Line dataKey="poids" name="Poids" stroke="#3B82F6" dot={false} />
              <Line dataKey="pas" name="Pas" stroke="#10B981" dot={false} />
              <Line dataKey="mood" name="Humeur" stroke="#F59E0B" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Suivi émotionnel */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Suivi émotionnel</h3>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emoData} margin={{ top: 10, right: 20, bottom: 30, left: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                angle={-45}
                textAnchor="end"
                height={50}
                interval="preserveStartEnd"
              />
              <YAxis domain={[0, 10]} tick={{ fill: '#6B7280' }} ticks={[0, 2, 4, 6, 8, 10]} />
              <Tooltip
                formatter={(v: number) => `${v}/10`}
                labelFormatter={l => new Date(l).toLocaleDateString('fr-FR')}
                contentStyle={{ background: '#fff', borderRadius: 8 }}
              />
              <Line dataKey="score" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Vue synthétique (Radar + Emoji) */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Vue synthétique</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="text-6xl text-center">{overallEmoji}</div>
          <div className="w-full h-80">
            <PatientRadar data={radarData} />
          </div>
        </div>
      </Card>
    </div>
  )
}
