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

  // --- Calcul des indicateurs clés ---
  const heightM = (person.height ?? 0) / 100
  const lastEntry = mergedData.slice().reverse().find(d => d.poids !== null)
  const lastImc = lastEntry && heightM > 0
    ? lastEntry.poids! / (heightM * heightM)
    : 0

  const recentActs = activities.slice(-10)
  const avgSteps = recentActs.length
    ? recentActs.reduce((sum, a) => sum + a.numberOfSteps, 0) / recentActs.length
    : 0

  const recentMoods = psychic.slice(-10)
  const avgMood = recentMoods.length
    ? recentMoods.reduce((sum, p) => sum + p.mood_score, 0) / recentMoods.length
    : 0

  // --- Conseils selon IMC ---
  let imcAdvice = ''
  if (lastImc < 18.5) {
    imcAdvice = 'Votre IMC est bas : pensez à enrichir votre alimentation (protéines, bonnes graisses).'
  } else if (lastImc < 25) {
    imcAdvice = 'Votre IMC est dans la norme : maintenez votre équilibre avec une activité modérée.'
  } else if (lastImc < 30) {
    imcAdvice = 'IMC en surcharge pondérale : privilégiez des exercices cardio (marche rapide, vélo).'
  } else {
    imcAdvice = 'IMC élevé : consultez un professionnel et augmentez progressivement votre activité physique.'
  }

  // --- Conseils selon activité ---
  let actAdvice = ''
  if (avgSteps < 2000) {
    actAdvice = 'Votre niveau d’activité est faible : essayez d’ajouter 500 pas de plus chaque jour.'
  } else if (avgSteps < 5000) {
    actAdvice = 'Un bon départ ! Continuez sur cette lancée et visez 7000 pas quotidiens.'
  } else {
    actAdvice = 'Excellente activité ! Pensez à intégrer quelques séances de renforcement musculaire.'
  }

  // --- Conseils selon humeur ---
  let moodAdvice = ''
  if (avgMood < 3) {
    moodAdvice = 'Humeur basse : pratiquez une activité relaxante (méditation, yoga) et parlez-en à un proche.'
  } else if (avgMood < 6) {
    moodAdvice = 'Humeur moyenne : gardez vos routines positives, et variez les exercices pour vous motiver.'
  } else {
    moodAdvice = 'Humeur positive : continuez ainsi et partagez votre énergie autour de vous !'
  }

  // --- Données pour le radar ---
  const avgCal = activities.slice(-10).length
    ? activities.slice(-10).reduce((sum, a) => sum + a.consumedCalories, 0) / activities.slice(-10).length
    : 0

  const radarData = {
    imc: lastImc,
    objectifImc: Number(person.bmiGoal) || 25,
    pasMoyens: avgSteps,
    objectifPas: 2000,
    caloriesBrulees: avgCal,
    objectifCalories: 1000,
    etatPsy: avgMood,
  }

  // --- Smiley global ---
  const overallEmoji =
    avgMood >= 8 ? '😊' :
    avgMood >= 5 ? '🙂' :
    avgMood >= 3 ? '😐' :
    '😞'

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
          <li><strong>IMC :</strong> {imcAdvice}</li>
          <li><strong>Activité :</strong> {actAdvice}</li>
          <li><strong>Émotion :</strong> {moodAdvice}</li>
        </ul>
      </Card>
    </div>
  )
}
