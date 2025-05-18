// src/pages/PatientEvolutionSection.tsx
import { useOutletContext, Link } from 'react-router-dom'
import Card from '../components/Card'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

export default function PatientEvolutionSection() {
  const {
    person,
    mergedData,
  } = useOutletContext<{
    person: { height?: number }
    mergedData: { date: string; poids: number | null; pas: number; mood: number | null }[]
  }>()

  // forward‐fill poids → imc, mood
  const heightM = (person.height ?? 0) / 100
  let lastImc = mergedData.find(d => d.poids !== null && heightM > 0)
    ? (mergedData.find(d => d.poids !== null)!.poids! / (heightM * heightM))
    : 0
  let lastMood = mergedData.find(d => d.mood !== null)?.mood ?? 0

  const ffill = mergedData.map(d => {
    if (d.poids !== null && heightM > 0) {
      lastImc = d.poids / (heightM * heightM)
    }
    if (d.mood !== null) {
      lastMood = d.mood
    }
    return {
      date: d.date,
      imc: lastImc,
      pas: d.pas,
      mood: lastMood,
    }
  })

  // find min/max for normalization
  const imcs = ffill.map(d => d.imc)
  const minImc = Math.min(...imcs)
  const maxImc = Math.max(...imcs)
  const maxPas = Math.max(...ffill.map(d => d.pas))

  // normalized dataset
  const data = ffill.map(d => ({
    date: d.date,
    imcNorm: maxImc > minImc ? (d.imc - minImc) / (maxImc - minImc) : 0,
    pasNorm: maxPas > 0 ? d.pas / maxPas : 0,
    moodNorm: d.mood / 10,
  }))

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
        <Link to="/patients" className="hover:underline">← Patients</Link>
        <span>/ Évolution</span>
      </nav>

      <h2 className="text-2xl font-semibold">Évolution normalisée (IMC, Pas, Humeur)</h2>

      <Card>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 30, left: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 1]}
                tickFormatter={v => `${Math.round(v * 100)}%`}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip
                formatter={(v: number, name: string) => `${(v * 100).toFixed(1)}%`}
                labelFormatter={label => new Date(label).toLocaleDateString('fr-FR')}
                contentStyle={{ background: '#fff', borderRadius: 8 }}
              />
              <Legend verticalAlign="top" />
              <Line
                type="monotone"
                dataKey="imcNorm"
                name="IMC"
                stroke="#3B82F6"
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="pasNorm"
                name="Pas"
                stroke="#10B981"
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="moodNorm"
                name="Humeur"
                stroke="#F59E0B"
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
