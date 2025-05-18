import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AxiosError } from 'axios';
import PatientRadar from '../components/PatientRadar';


type Person = {
  id: string; 
  firstname: string;
  lastname: string;
  birthyear?: number;
  height?: number;
  weightStart?: number;
  weightGoal?: number;
  bmiStart?: string;
  bmiGoal?: string;
  activityProfile?: string;
};

type Physio = { date: string; weight: number };
type Activity = { date: string; steps: number; numberOfSteps: number; duration: number; consumedCalories: number; type: string };
type Psychic = { date: string; mood_score: number; feeling: string };

interface Merged {
  date: string;
  poids: number | null;
  pas: number | null;
  mood: number | null;
}


export default function PatientDetails() {
  const { id } = useParams();
  const location = useLocation() as { state?: { person?: Person } };

  const [person, setPerson] = useState<Person | null>(location.state?.person ?? null);
  const [physio, setPhysio] = useState<Physio[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [psychic, setPsychic] = useState<Psychic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState('all');

  const activityTypes = [...new Set(activities.map(a => a.type))];
  const filteredActivities = activities.filter(activity => 
    activityFilter === 'all' || activity.type === activityFilter
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const auth = localStorage.getItem('auth');
  if (!auth) {
          setError('Authentification requise');
          return;
        }

        const token = JSON.parse(auth).token;
        setAuthToken(token);

        const [personRes, physRes, actRes] = await Promise.all([
          !person && api.get(`/items/people/${id}`),
          api.get('/items/physiologicalData', { params: { 'filter[people_id][_eq]': id } }),
          api.get('/items/physicalActivities', { params: { 'filter[people_id][_eq]': id } }),
        ]);

        let psyData: Psychic[] = [];
        try {
          const r = await api.get('/items/psychicData', { params: { 'filter[people_id][_eq]': id } });
          psyData = r.data.data;
        } catch (err) {
          if ((err as AxiosError).response?.status !== 403) throw err;
        }

        setPerson(prev => prev || personRes?.data.data);
        setPhysio(physRes.data.data);
        setActivities(actRes.data.data);
        setPsychic(psyData);
        } catch (error) {
        console.error('Erreur:', error);
        setError('Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const stats = {
    steps: filteredActivities.reduce((sum, a) => sum + (a.numberOfSteps || 0), 0),
    duration: filteredActivities.reduce((sum, a) => sum + (a.duration || 0), 0),
    calories: filteredActivities.reduce((sum, a) => sum + (a.consumedCalories || 0), 0)
  };

  const mergedData = physio.map(p => ({
    date: p.date,
    poids: p.weight,
    pas: activities.find((a) => a.date === p.date)?.steps ?? null,
    mood: psychic.find((s) => s.date === p.date)?.mood_score ?? null,
  }));

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${Math.round(num / 1000)}k`;
    return num.toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins.toString().padStart(2, '0')}` : `${mins}min`;
  };

  const moodScoreMap: Record<string, number> = {
    hopeless: 0,
    lazy: 2,
    'losing motivation': 4,
    enduring: 6,
    addicted: 8,
    motivated: 10,
  };

  const last10Moods = [...psychic]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const etatPsy =
    last10Moods.length === 0
      ? 0
      : last10Moods.reduce((sum, mood) => {
          const score = moodScoreMap[mood.feeling] ?? 0;
          return sum + score;
        }, 0) / last10Moods.length;

  const totalSteps = activities.reduce((sum, a) => sum + (a.numberOfSteps || 0), 0);
  const totalDuration = activities.reduce((sum, a) => sum + (a.duration || 0), 0);
  const totalCalories = activities.reduce((sum, a) => sum + (a.consumedCalories || 0), 0);

  const sortedActivities = [...activities]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 10);

const pasMoyens =
  sortedActivities.reduce((sum, a) => sum + (a.numberOfSteps || 0), 0) /
  (sortedActivities.length || 1);

const caloriesMoyennesBrulees =
  sortedActivities.reduce((sum, a) => sum + (a.consumedCalories || 0), 0) /
  (sortedActivities.length || 1);

const latestPhysio = [...physio].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
const poidsActuel = latestPhysio?.weight ?? 50;
const taille = (person?.height ?? 170) /100; 
const imc = poidsActuel / (taille * taille);

console.log("poids:", poidsActuel, "taille:", taille, "imc:", imc);
console.log("total steps:", totalSteps, "moyenne:", pasMoyens);
console.log("total calories:", totalCalories, "moyenne:", caloriesMoyennesBrulees);



// Données pour le radar
const radarData = {
  imc,
  objectifImc: Number(person?.bmiGoal) || 25,
  pasMoyens: pasMoyens,
  objectifPas: 2000,
  caloriesBrulees: caloriesMoyennesBrulees,
  objectifCalories: 1000,
  caloriesAbsorbees: undefined, // Donnée manquante
  etatPsy: etatPsy,
};

if (loading) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>❌ {error}</p>
        <Link to="/patients" className="mt-2 inline-block text-blue-600 hover:underline">
          ← Retour aux patients
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Link to="/patients" className="inline-flex items-center text-blue-600 hover:underline">
        ← Liste des patients
      </Link>

      
      {person && (
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {person.firstname} {person.lastname}
              </h1>
              {person.birthyear && (
                <p className="text-gray-600">
                  {new Date().getFullYear() - person.birthyear} ans
                </p>
              )}
            </div>
          </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem 
              icon="📏" 
              label="Taille" 
              value={`${person.height || '-'} cm`}
            />
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                icon="⚖️"
                label="Poids initial"
                value={`${person.weightStart || '-'} kg`}
                highlight
              />
              <InfoItem
                icon="🎯"
                label="Objectif poids"
                value={`${person.weightGoal || '-'} kg`}
                highlight
              />
            </div>

            <InfoItem
              icon="🏃♂️"
              label="Profil d'activité"
              value={getActivityProfileLabel(person.activityProfile || '')}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-600 mb-1">IMC initial</p>
                <p className="font-semibold text-red-700 capitalize">
                  {person.bmiStart || '-'}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-600 mb-1">IMC cible</p>
                <p className="font-semibold text-green-700 capitalize">
                  {person.bmiGoal || '-'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold">Activités Physiques</h2>
          <select
            className="w-full md:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={activityFilter}
            onChange={e => setActivityFilter(e.target.value)}
          >
            <option value="all">Toutes les activités</option>
            {activityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatBox 
            label="Pas total" 
            value={stats.steps > 0 ? formatNumber(stats.steps) : '-'} 
            icon="👟" 
          />
          <StatBox 
            label="Durée totale" 
            value={stats.duration > 0 ? formatDuration(stats.duration) : '-'} 
            icon="⏱️" 
          />
          <StatBox 
            label="Calories brûlées" 
            value={stats.calories > 0 ? formatNumber(stats.calories) : '-'} 
            icon="🔥" 
          />
        </div>

        {filteredActivities.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Type</th>
                  <th className="p-3 text-right text-sm font-semibold text-gray-600">Pas</th>
                  <th className="p-3 text-right text-sm font-semibold text-gray-600">Durée</th>
                  <th className="p-3 text-right text-sm font-semibold text-gray-600">Calories</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredActivities.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-700">
                      {new Date(activity.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 capitalize">
                      {activity.type}
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-right">
                      {activity.numberOfSteps.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-right">
                      {activity.duration} min
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-right">
                      {activity.consumedCalories.toLocaleString()} kcal
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            🕸️ Aucune activité trouvée
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Évolution des données</h2>
        <div className="h-64 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData}>
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6B7280' }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
            <YAxis 
                tick={{ fill: '#6B7280' }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="poids" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Poids (kg)"
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="pas" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Pas"
                dot={{ fill: '#10B981', strokeWidth: 2 }}
              />
              {mergedData.some(d => d.mood) && (
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Humeur"
                  dot={{ fill: '#F59E0B', strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {psychic.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Suivi émotionnel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {psychic.map((p, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-2xl mr-4">
                  {getMoodEmoji(p.mood_score)}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(p.date).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-gray-600 mt-1">{p.feeling}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(p.mood_score / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {p.mood_score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {/*Radar*/}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Vue synthétique du patient</h1>
        <PatientRadar data={radarData} />
      </div>
    </div>
  );
}
const InfoItem = ({ 
  icon, 
  label, 
  value, 
  highlight = false 
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className={`flex items-center gap-3 p-3 ${highlight ? 'bg-blue-50 rounded-lg' : ''}`}>
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`font-semibold ${highlight ? 'text-blue-700' : 'text-gray-800'}`}>
        {value}
      </p>
    </div>
  </div>
);

const StatBox = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
  <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
    <span className="text-2xl mr-3">{icon}</span>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const getActivityProfileLabel = (profile?: string) => {
  const profiles: { [key: string]: string } = {
    sedentary: 'Sédentaire',
    light: 'Légèrement actif',
    active: 'Actif',
    athlete: 'Athlète'
  };
  return profile ? profiles[profile] || profile : '-';
};

const getMoodEmoji = (score: number) => {
  if (score >= 8) return '😊';
  if (score >= 5) return '🙂';
  if (score >= 3) return '😐';
  return '😞';
};