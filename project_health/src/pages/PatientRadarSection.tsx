// src/pages/PatientRadarSection.tsx
import { useOutletContext, Link } from 'react-router-dom';
import Card from '../components/Card';
import PatientRadar from '../components/PatientRadar';

export default function PatientRadarSection() {
  const { person, physio, activities, psychic } = useOutletContext<{
    person: { height?: number; bmiGoal?: string };
    physio: { date: string; weight: number }[];
    activities: { date: string; numberOfSteps: number; consumedCalories: number }[];
    psychic: { date: string; mood_score: number }[];
  }>();

  // IMC
  const latest = physio
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
  const poids = latest?.weight ?? 0;
  const taille = (person.height ?? 170) / 100;
  const imc = poids / (taille * taille);

  // Moyenne humeur
  const last10 = psychic
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 10);
  const etatPsy =
    last10.length > 0
      ? last10.reduce((sum, p) => sum + p.mood_score, 0) / last10.length
      : 0;
  const overallEmoji =
    etatPsy >= 8 ? '😊' : etatPsy >= 5 ? '🙂' : etatPsy >= 3 ? '😐' : '😞';

  // Moyennes activités
  const recentActs = activities
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 10);
  const avgSteps =
    recentActs.reduce((s, a) => s + a.numberOfSteps, 0) /
    (recentActs.length || 1);
  const avgCal =
    recentActs.reduce((s, a) => s + a.consumedCalories, 0) /
    (recentActs.length || 1);

  const radarData = {
    imc,
    objectifImc: Number(person.bmiGoal) || 25,
    pasMoyens: avgSteps,
    objectifPas: 2000,
    caloriesBrulees: avgCal,
    objectifCalories: 1000,
    caloriesAbsorbees: undefined,
    etatPsy,
  };

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
        <Link to="/patients" className="hover:underline">
          ← Patients
        </Link>
        <span>/ Dashboard</span>
      </nav>
      <h2 className="text-2xl font-semibold">Vue synthétique</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <p className="text-5xl text-center">{overallEmoji}</p>
        </Card>
        <Card>
          <PatientRadar data={radarData} />
        </Card>
      </div>
    </div>
  );
}
