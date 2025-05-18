// src/pages/PatientRadarSection.tsx
import { useOutletContext, Link } from 'react-router-dom'
import Card from '../components/Card'
import PatientRadar from '../components/PatientRadar'

export default function PatientRadarSection() {
  const {
    person,
    mergedData,
    activities,
    psychic,
  } = useOutletContext<{
    person: { height?: number; bmiGoal?: string }
    mergedData: { date: string; poids: number | null; pas: number; mood: number | null }[]
    activities: { numberOfSteps: number; duration: number; consumedCalories: number }[]
    psychic: { date: string; mood_score: number; feeling: string }[]
  }>()

  // --- Calcul du dernier IMC ---
  const heightM = (person.height ?? 0) / 100
  const lastEntry = mergedData.slice().reverse().find(d => d.poids !== null)
  const lastImc = lastEntry && heightM > 0
    ? lastEntry.poids! / (heightM * heightM)
    : 0

  // --- Moyennes des 10 dernières activités ---
  const recentActs = activities.slice(-10)
  const avgSteps = recentActs.length
    ? recentActs.reduce((sum, a) => sum + a.numberOfSteps, 0) / recentActs.length
    : 0
  const avgCal = recentActs.length
    ? recentActs.reduce((sum, a) => sum + a.consumedCalories, 0) / recentActs.length
    : 0

  // --- Moyenne des 10 dernières humeurs ---
  const recentMoods = psychic.slice(-10)
  const avgMood = recentMoods.length
    ? recentMoods.reduce((sum, p) => sum + p.mood_score, 0) / recentMoods.length
    : 0

  // --- Smiley global ---
  const overallEmoji =
    avgMood >= 8 ? '😊' :
    avgMood >= 5 ? '🙂' :
    avgMood >= 3 ? '😐' :
    '😞'

  // --- Données pour le radar ---
  const radarData = {
    imc: lastImc,
    objectifImc: Number(person.bmiGoal) || 25,
    pasMoyens: avgSteps,
    objectifPas: 2000,
    caloriesBrulees: avgCal,
    objectifCalories: 1000,
    etatPsy: avgMood,
  }

  return (
    <div className="space-y-6">
      {/* Fil d’Ariane */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
        <Link to="/patients" className="hover:underline">← Patients</Link>
        <span>/ Radar</span>
      </nav>

      {/* Titre */}
      <h2 className="text-2xl font-semibold">Vue synthétique</h2>

      {/* Contenu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emoji global */}
        <Card>
          <div className="text-6xl text-center">{overallEmoji}</div>
        </Card>

        {/* Radar */}
        <Card>
          <PatientRadar data={radarData} />
        </Card>
      </div>
    </div>
  )
}
