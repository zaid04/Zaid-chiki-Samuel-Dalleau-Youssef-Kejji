import { useOutletContext, Link } from 'react-router-dom';

export default function PatientInfoSection() {
  const { person } = useOutletContext<{
    person: {
      firstname: string;
      lastname: string;
      birthyear?: number;
      height?: number;
      weightStart?: number;
      weightGoal?: number;
      bmiStart?: string;
      bmiGoal?: string;
    };
  }>();

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 text-gray-800">
      <nav className="flex gap-4">
        <Link to="/patients" className="text-blue-600 hover:underline">
          ← Liste des patients
        </Link>
        <Link to=".." className="text-blue-600 hover:underline">
          ← Tableau de bord
        </Link>
      </nav>

      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Informations patient</h2>
        <p>
          <strong>Nom :</strong> {person.firstname} {person.lastname}
        </p>
        <p>
          <strong>Âge :</strong>{' '}
          {person.birthyear ? new Date().getFullYear() - person.birthyear : '-'} ans
        </p>
        <p>
          <strong>Taille :</strong> {person.height ?? '-'} cm
        </p>
        <p>
          <strong>Poids initial :</strong> {person.weightStart ?? '-'} kg
        </p>
        <p>
          <strong>Objectif poids :</strong> {person.weightGoal ?? '-'} kg
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-xs text-red-600 mb-1">IMC initial</p>
            <p className="font-semibold text-red-700 capitalize">{person.bmiStart ?? '-'}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-green-600 mb-1">IMC cible</p>
            <p className="font-semibold text-green-700 capitalize">{person.bmiGoal ?? '-'}</p>
          </div>
        </div>
      </section>
    </div>
);
}
