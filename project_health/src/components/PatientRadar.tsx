import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts'
import { useNavigate } from 'react-router-dom'

const MAX_SCORE = 10

export default function PatientRadar({
  data
}: {
  data: {
    bmiProgress: number       // 0 à 1
    objectifProgress: number  // toujours 1
    pasMoyens: number
    objectifPas: number
    caloriesBrulees: number
    objectifCalories: number
    etatPsy: number           // 0 à 1
  }
}) {
  const nav = useNavigate()

  // Prépare chaque score sur 0–MAX_SCORE
  const scores = {
    BMI: Math.round(data.bmiProgress * MAX_SCORE),
    Pas: Math.round((data.pasMoyens / data.objectifPas) * MAX_SCORE),
    'Calories brûlées': Math.round((data.caloriesBrulees / data.objectifCalories) * MAX_SCORE),
    'État psycho': Math.round(data.etatPsy * MAX_SCORE),
  }

  const dataset = [
    {
      subject: 'Progrès BMI',
      value: scores.BMI,
      objectif: MAX_SCORE,
      onClick: () => nav('/detailpoid'),
    },
    {
      subject: 'Pas',
      value: Math.min(scores.Pas, MAX_SCORE),
      objectif: MAX_SCORE,
      onClick: () => nav('/activite'),
    },
    {
      subject: 'Calories brûlées',
      value: Math.min(scores['Calories brûlées'], MAX_SCORE),
      objectif: MAX_SCORE,
      onClick: () => nav('/activite'),
    },
    {
      subject: 'État psycho',
      value: scores['État psycho'],
      objectif: MAX_SCORE,
      onClick: () => nav('/detailpsychologique'),
    },
  ]

  // Choix de la couleur selon progrès BMI
  const bmiScore = scores.BMI
  let radarColor = '#22c55e'   // vert
  if (bmiScore < 4) radarColor = '#ef4444'   // rouge
  else if (bmiScore < 7) radarColor = '#facc15' // jaune

  return (
    <div className="relative w-full h-[400px]">
      <ResponsiveContainer>
        <RadarChart data={dataset} outerRadius="75%">
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" stroke="#666" />
          <PolarRadiusAxis angle={30} domain={[0, MAX_SCORE]} tickCount={6} />
          <Radar
            name="Actuel"
            dataKey="value"
            stroke={radarColor}
            fill={radarColor}
            fillOpacity={0.6}
          />
          <Radar
            name="Objectif"
            dataKey="objectif"
            stroke="#888"
            fill="transparent"
            strokeDasharray="4 4"
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>

      {/* Zones cliquables */}
      <div className="absolute inset-0 flex items-center justify-center">
        {dataset.map((d, i) => (
          <button
            key={i}
            onClick={d.onClick}
            className="absolute w-24 h-24 rounded-full opacity-0 hover:opacity-30 hover:bg-blue-300"
            style={{
              transform: `rotate(${i * (360 / dataset.length)}deg) translateY(-140px) rotate(-${i * (360 / dataset.length)}deg)`,
              transformOrigin: 'center center',
            }}
            title={`Voir détail ${d.subject}`}
          />
        ))}
      </div>
    </div>
  )
}
