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
    person: { height?: number; bmiGoal?: string; activityProfile?: string }
    mergedData: { date: string; poids: number | null; pas: number; mood: number | null }[]
    activities: { numberOfSteps: number; duration: number; consumedCalories: number }[]
    psychic: { date: string; mood_score: number; feeling: string }[]
  }>()

  // --- Calcul du progrès BMI (proximité de l'objectif) ---
  const heightM = (person.height ?? 0) / 100
  const lastEntry = mergedData.slice().reverse().find(d => d.poids !== null)
  const currentBMI = lastEntry && heightM > 0
    ? lastEntry.poids! / (heightM * heightM)
    : 0
  const targetBMI = Number(person.bmiGoal) || currentBMI
  // 1 = objectif atteint; 0 = pas commencé
  const bmiProgress = targetBMI !== 0
    ? 1 - Math.abs(currentBMI - targetBMI) / targetBMI
    : 1

  // --- Moyennes des 10 dernières activités ---
  const recentActs = activities.slice(-10)
  const avgSteps = recentActs.length
    ? recentActs.reduce((sum, a) => sum + a.numberOfSteps, 0) / recentActs.length
    : 0

  // --- Moyenne des 10 dernières humeurs ---
  const recentMoods = psychic.slice(-10)
  const avgMood = recentMoods.length
    ? recentMoods.reduce((sum, p) => sum + p.mood_score, 0) / recentMoods.length
    : 0

  // --- Calcul des calories moyennes brûlées ---
  const avgCal = recentActs.length
    ? recentActs.reduce((sum, a) => sum + a.consumedCalories, 0) / recentActs.length
    : 0

  // --- Smiley global ---
  const overallEmoji =
    avgMood >= 8 ? '😊' :
    avgMood >= 5 ? '🙂' :
    avgMood >= 3 ? '😐' :
    '😞'

  // --- Préparation des données du radar ---
  const radarData = {
    bmiProgress,
    objectifProgress: 1,
    pasMoyens: avgSteps,
    objectifPas: 2000,
    caloriesBrulees: avgCal,
    objectifCalories: 1000,
    etatPsy: avgMood / 10,
  }

  // --- Conseils personnalisés ---
  let bmiAdvice = ''
  if (bmiProgress < 0.5) {
    bmiAdvice = 'Vous êtes loin de votre objectif de BMI : poursuivez vos efforts de manière équilibrée.'
  } else if (bmiProgress < 1) {
    bmiAdvice = 'Vous approchez de votre BMI cible : maintenez votre routine actuelle.'
  } else {
    bmiAdvice = 'Félicitations, vous avez atteint votre BMI ! Pensez à stabiliser votre poids.'
  }

  let stepAdvice = ''
  if (avgSteps < 2000) {
    stepAdvice = 'Activité faible : ajoutez 500 pas de plus chaque jour pour progresser.'
  } else if (avgSteps < 7000) {
    stepAdvice = 'Bon rythme ! Visez 10 000 pas pour un maximum de bénéfices.'
  } else {
    stepAdvice = 'Excellente activité : continuez et intégrez des exercices de renforcement.'
  }

  let moodAdvice = ''
  if (avgMood < 4) {
    moodAdvice = 'Humeur basse : privilégiez la relaxation (méditation, yoga).'
  } else if (avgMood < 7) {
    moodAdvice = 'Humeur moyenne : gardez vos habitudes positives et variez vos activités.'
  } else {
    moodAdvice = 'Humeur excellente : partagez votre énergie autour de vous !'
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
        <Link to="/patients" className="hover:underline">← Patients</Link>
        <span>/ Synthèse</span>
      </nav>

      <h2 className="text-2xl font-semibold">Vue synthétique & Conseils</h2>

      {/* Grille Radar + Emoji */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="text-6xl text-center">{overallEmoji}</div>
        </Card>
        <Card>
          <PatientRadar data={radarData} />
        </Card>
      </div>

      {/* Conseils personnalisés */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Conseils Personnalisés</h3>
        <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-300">
          <li><strong>Progrès BMI :</strong> {bmiAdvice}</li>
          <li><strong>Activité :</strong> {stepAdvice}</li>
          <li><strong>Émotion :</strong> {moodAdvice}</li>
        </ul>
      </Card>
    </div>
  )
}
