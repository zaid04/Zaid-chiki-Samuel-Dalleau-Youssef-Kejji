import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const MAX_SCORE = 10;

// Normalisation améliorée : score diminue si on dépasse l'objectif
function normalize(value: number, target: number) {
  const ratio = value / target;
  const score = ratio * MAX_SCORE;
  if (score <= MAX_SCORE) return Math.round(score);
  return Math.max(0, Math.round(MAX_SCORE - (score - MAX_SCORE)));
}

export default function PatientRadar({ data }: { data: {
  imc: number;
  objectifImc: number;
  pasMoyens: number;
  objectifPas: number;
  caloriesBrulees: number;
  objectifCalories: number;
  caloriesAbsorbees?: number;
  etatPsy?: number;
} }) {
  const nav = useNavigate();

  const dataset = [
    {
      subject: 'IMC',
      value: normalize(data.imc, data.objectifImc),
      objectif: MAX_SCORE,
      onClick: () => nav('/detailpoid'),
    },
    {
      subject: 'Pas',
      value: normalize(data.pasMoyens, data.objectifPas),
      objectif: MAX_SCORE,
      onClick: () => nav('/activite'),
    },
    {
      subject: 'Calories brûlées',
      value: normalize(data.caloriesBrulees, data.objectifCalories),
      objectif: MAX_SCORE,
      onClick: () => nav('/activite'),
    },
    {
      subject: 'Calories absorbées',
      value: data.caloriesAbsorbees ? normalize(data.caloriesAbsorbees, 2000) : 5,
      objectif: MAX_SCORE,
      onClick: () => nav('/regime'),
    },
    {
      subject: 'État psycho',
      value: data.etatPsy ?? 5,
      objectif: MAX_SCORE,
      onClick: () => nav('/detailpsychologique'),
    },
  ];

  const imcScore = dataset.find(d => d.subject === 'IMC')?.value ?? 0;

  let radarColor = '#22c55e'; // Vert
  if (imcScore < 3) radarColor = '#ef4444'; // Rouge
  else if (imcScore < 7) radarColor = '#facc15'; // Jaune

  return (
    <div className="relative w-full h-[400px]">
      <ResponsiveContainer>
        <RadarChart data={dataset} outerRadius="80%">
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, MAX_SCORE]} />
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
            stroke="#facc15"
            fill="transparent"
            strokeDasharray="5 5"
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>

      {/* Clic zones */}
      <div className="absolute inset-0 flex items-center justify-center">
        {dataset.map((d, i) => (
          <button
            key={i}
            onClick={d.onClick}
            className="absolute w-24 h-24 rounded-full opacity-0 hover:opacity-30 hover:bg-blue-300"
            style={{
              transform: `rotate(${i * 72}deg) translateY(-140px) rotate(-${i * 72}deg)`,
              transformOrigin: 'center center',
            }}
            title={`Détail ${d.subject}`}
          />
        ))}
      </div>
    </div>
  );
}

