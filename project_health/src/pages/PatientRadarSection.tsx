import { useOutletContext, Link } from 'react-router-dom';
import PatientRadar from '../components/PatientRadar';

export default function PatientRadarSection() {
  const { person, physio, activities, psychic } = useOutletContext<{
    person: { height?: number; bmiGoal?: string };
    physio: { date: string; weight: number }[];
    activities: { date: string; numberOfSteps: number; consumedCalories: number }[];
    psychic: { date: string; mood_score: number; feeling: string }[];
  }>();

  const latest = [...physio].sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
  const poids = latest?.weight ?? 0;
  const taille = (person.height ?? 170) / 100;
  const imc = poids / (taille * taille);

  const last10 = [...psychic]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 10);
  const moodMap: Record<string, number> = {
    hopeless: 0,
    lazy: 2,
    'losing motivation': 4,
    enduring: 6,
    addicted: 8,
    motivated: 10,
  };
  const etatPsy =
    last10.length > 0
      ? last10.reduce((s, m) => s + (moodMap[m.feeling] || 0), 0) / last10.length
      : 0;

  const recent = [...activities]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 10);
  const avgSteps = recent.reduce((s, a) => s + a.numberOfSteps, 0) / (recent.length || 1);
  const avgCal = recent.reduce((s, a) => s + a.consumedCalories, 0) / (recent.length || 1);

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
    <div className="p-4 max-w-md mx-auto space-y-6 text-gray-800">
      <nav className="flex gap-4">
        <Link to="/patients" className="text-blue-600 hover:underline">
          ← Liste des patients
        </Link>
        <Link to=".." className="text-blue-600 hover:underline">
          ← Tableau de bord
        </Link>
      </nav>

      <h2 className="text-2xl font-semibold text-gray-900">Vue synthétique du patient</h2>
      <PatientRadar data={radarData} />
    </div>
);
}
