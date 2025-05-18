import { useOutletContext, Link } from 'react-router-dom';

const getMoodEmoji = (score: number) =>
  score >= 8 ? '😊' : score >= 5 ? '🙂' : score >= 3 ? '😐' : '😞';

export default function PatientEmotionSection() {
  const { psychic } = useOutletContext<{
    psychic: { date: string; mood_score: number; feeling: string }[];
  }>();

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
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Suivi émotionnel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {psychic.map((p, i) => (
            <div
              key={i}
              className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span className="text-2xl mr-4">{getMoodEmoji(p.mood_score)}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(p.date).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-gray-700 mt-1">{p.feeling}</p>
                <div className="flex items-center mt-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(p.mood_score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 ml-2">{p.mood_score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
);
}
