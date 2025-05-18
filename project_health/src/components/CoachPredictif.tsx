// src/components/CoachPredictif.tsx
import React, { useMemo } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { useOutletContext } from 'react-router-dom'

type Donnee = {
  date: string
  pas: number
  mood: number | null
  poids: number | null
}

export default function CoachPredictif() {
  const { mergedData } = useOutletContext<{ mergedData: Donnee[] }>()

  // 1) Garder les 14 derniers jours triés
  const last14 = useMemo(() => {
    return [...mergedData]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14)
      .map(d => ({
        date: d.date.slice(5), // MM-DD
        pas: d.pas,
        mood: d.mood,
        poids: d.poids,
      }))
  }, [mergedData])

  // 2) Forward‐fill mood et poids pour éviter les trous
  let currMood = last14.find(d => d.mood != null)?.mood ?? 0
  let currPoids = last14.find(d => d.poids != null)?.poids ?? 0
  const data = last14.map(d => {
    if (d.mood != null) currMood = d.mood
    if (d.poids != null) currPoids = d.poids
    return { date: d.date, pas: d.pas, mood: currMood, poids: currPoids }
  })

  // 3) Séparer en deux semaines
  const semaine1 = data.slice(0, 7)
  const semaine2 = data.slice(7)

  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / (arr.length || 1)

  const variationPas = semaine1.length
    ? ((avg(semaine2.map(d => d.pas)) - avg(semaine1.map(d => d.pas))) / avg(semaine1.map(d => d.pas))) * 100
    : 0

  const variationMood = avg(semaine2.map(d => d.mood)) - avg(semaine1.map(d => d.mood))
  const variationPoids = data.length
    ? data[data.length - 1].poids - data[0].poids
    : 0

  // 4) Générer suggestions
  const conseils: string[] = []
  if (variationPas > 10) conseils.push('👏 Vous avez augmenté vos pas de plus de 10% ! Continuez ainsi.')
  else if (variationPas < -10) conseils.push('📉 Vos pas ont chuté : relancez-vous avec 500 pas supplémentaires par jour.')
  else conseils.push('🚶 Pas stables : pourquoi ne pas tester un nouvel itinéraire cette semaine ?')

  if (variationMood > 1) conseils.push('😊 Votre humeur s’améliore : gardez vos routines positives.')
  else if (variationMood < -1) conseils.push('😔 Humeur à la baisse : pause méditation ou respiration recommandée.')
  else conseils.push('🙂 Humeur stable : continuez vos activités favorites.')

  if (variationPoids < -0.5) conseils.push('⚖️ Perte de poids modérée : veillez à un apport calorique suffisant.')
  else if (variationPoids > 0.5) conseils.push('🍎 Légère prise de poids : privilégiez protéines et réduisez les sucres simples.')
  else conseils.push('⚖️ Poids stable : maintenez votre équilibre alimentaire et sportif.')

  // Helper pour créer les mini‐graphiques
  const renderSpark = (key: 'pas' | 'mood' | 'poids', color: string, unit = '') => (
    <div className="w-full h-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v: number) => `${v}${unit}`} />
          <Area
            type="monotone"
            dataKey={key}
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow space-y-4">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Coach Prédictif</h3>

      {/* Pas */}
      {renderSpark('pas', '#10B981', ' pas')}
      <p className="text-gray-700 dark:text-gray-300">
        Variation pas : <strong>{variationPas.toFixed(1)}%</strong>
      </p>

      {/* Humeur */}
      {renderSpark('mood', '#F59E0B')}
      <p className="text-gray-700 dark:text-gray-300">
        Variation humeur : <strong>{variationMood >= 0 ? '+' : ''}{variationMood.toFixed(1)} pts</strong>
      </p>

      {/* Poids */}
      {renderSpark('poids', '#3B82F6', ' kg')}
      <p className="text-gray-700 dark:text-gray-300">
        Variation poids : <strong>{variationPoids >= 0 ? '+' : ''}{variationPoids.toFixed(1)} kg</strong>
      </p>

      {/* Conseils */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-2">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100">Vos conseils personnalisés</h4>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
          {conseils.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
