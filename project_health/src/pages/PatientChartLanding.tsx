// src/pages/PatientChartLanding.tsx
import { useOutletContext, Link } from 'react-router-dom'
import Card from '../components/Card'
import PatientRadar from '../components/PatientRadar'
import CoachPredictif from '../components/CoachPredictif'
import SyntheseHebdomadaire from '../components/SyntheseHebdomadaire'
import AffichageBadges from '../components/AffichageBadges'
import Journal from '../components/Journal'
import ChatBot from '../components/ChatBot'
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
    mergedData: { date: string; poids: number | null; pas: number; mood: number | null }[]
    activities: { numberOfSteps: number; duration: number; consumedCalories: number }[]
    psychic: { date: string; mood_score: number; feeling: string }[]
  }>()

  // Âge
  const age = person.birthyear
    ? new Date().getFullYear() - person.birthyear
    : '-'

  // Stats globales
  const totalSteps = activities.reduce((sum, a) => sum + a.numberOfSteps, 0)
  const totalDur   = activities.reduce((sum, a) => sum + a.duration, 0)
  const totalCal   = activities.reduce((sum, a) => sum + a.consumedCalories, 0)

  // Prépare données émotionnelles
  const emoData = mergedData
    .filter(d => d.mood !== null)
    .map(d => ({ date: d.date, score: d.mood! }))

  // Calcul du smiley global
  const avgMood = emoData.length
    ? emoData.reduce((s, e) => s + e.score, 0) / emoData.length
    : 0
  const overallEmoji =
    avgMood >= 8 ? '😊' :
    avgMood >= 5 ? '🙂' :
    avgMood >= 3 ? '😐' :
    '😞'

  // ------ Préparation radarData -------

  // 1) Progrès BMI
  const heightM = (person.height ?? 0) / 100
  const lastEntry = mergedData.slice().reverse().find(d => d.poids !== null)
  const currentBMI = lastEntry && heightM > 0
    ? lastEntry.poids! / (heightM * heightM)
    : 0
  const targetBMI = Number(person.bmiGoal) || currentBMI
  const bmiProgress = targetBMI !== 0
    ? 1 - Math.abs(currentBMI - targetBMI) / targetBMI
    : 1

  // 2) Activité moyenne (10 derniers)
  const recentActs = activities.slice(-10)
  const avgSteps = recentActs.length
    ? recentActs.reduce((s, a) => s + a.numberOfSteps, 0) / recentActs.length
    : 0

  // 3) Calories moyennes (10 derniers)
  const avgCal2 = recentActs.length
    ? recentActs.reduce((s, a) => s + a.consumedCalories, 0) / recentActs.length
    : 0

  // 4) Humeur moyenne (10 derniers)
  const recentMoods = psychic.slice(-10)
  const avgMood10 = recentMoods.length
    ? recentMoods.reduce((s, p) => s + p.mood_score, 0) / recentMoods.length
    : 0

  // Compose l'objet attendu par <PatientRadar/>
  const radarData = {
    bmiProgress,           // 0→1
    objectifProgress: 1,   // toujours 1
    pasMoyens: avgSteps,
    objectifPas: 2000,
    caloriesBrulees: avgCal2,
    objectifCalories: 1000,
    etatPsy: avgMood10 / 10,// 0→1
  }

  // -------------------------------------

  // Forward-fill + normalisation pour le linechart
  let lw = mergedData.find(d => d.poids !== null)?.poids ?? 0
  let lm = mergedData.find(d => d.mood !== null)?.mood ?? 0
  const ffill = mergedData.map(d => {
    if (d.poids !== null) lw = d.poids
    if (d.mood  !== null) lm = d.mood
    return { date: d.date, poids: lw, pas: d.pas, mood: lm }
  })
  const minW = Math.min(...ffill.map(d => d.poids))
  const maxW = Math.max(...ffill.map(d => d.poids))
  const maxPas = Math.max(...ffill.map(d => d.pas))
  const normalized = ffill.map(d => ({
    date:      d.date,
    poidsNorm: maxW>minW ? (d.poids-minW)/(maxW-minW) : 0,
    pasNorm:   maxPas>0  ? d.pas/maxPas          : 0,
  }))

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
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
              <p className="font-semibold text-red-600">{person.bmiStart ?? '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">IMC cible</p>
              <p className="font-semibold text-green-600">{person.bmiGoal ?? '-'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Pas total',        value: `${Math.round(totalSteps/1000)}k`, icon: '👟' },
          { label: 'Durée totale',     value: `${Math.floor(totalDur/60)}h${totalDur%60}`, icon: '⏱️' },
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

      {/* Évolution normalisée */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Évolution normalisée</h3>
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={normalized} margin={{ top:10, right:20, bottom:30, left:0 }}>
              <XAxis dataKey="date"
                     tick={{ fontSize:12, fill:'#6B7280' }}
                     angle={-45} textAnchor="end"
                     height={60}
                     interval="preserveStartEnd" />
              <YAxis domain={[0,1]}
                     tickFormatter={v => `${Math.round(v*100)}%`}
                     tick={{ fill:'#6B7280' }} />
              <Tooltip formatter={(v:number) => `${(v*100).toFixed(1)}%`}
                       contentStyle={{ background:'#fff', borderRadius:8 }} />
              <Legend verticalAlign="top" />
              <Line type="monotone" dataKey="poidsNorm" name="Poids"   stroke="#3B82F6" dot={false} connectNulls />
              <Line type="monotone" dataKey="pasNorm"   name="Pas"     stroke="#10B981" dot={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Radar & Emoji */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Vue synthétique</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="text-6xl text-center">{overallEmoji}</div>
          <div className="w-full h-80">
            <PatientRadar data={radarData} />
          </div>
        </div>
      </Card>

      {/* Innovations premium */}
      <section>
        <h2 className="text-2xl font-semibold">Nouveaux services</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <CoachPredictif />
          <SyntheseHebdomadaire />
          <AffichageBadges />
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Journal />
            <ChatBot />
          </div>
        </div>
      </section>
    </div>
  )
}
