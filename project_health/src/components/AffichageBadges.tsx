// src/components/AffichageBadges.tsx
import React from 'react'
import { useOutletContext } from 'react-router-dom'

export default function AffichageBadges() {
  const { activities, mergedData } = useOutletContext<{
    activities: { numberOfSteps: number }[]
    mergedData: { date: string; poids: number | null; pas: number; mood: number | null }[]
  }>()

  const totalPas = activities.reduce((s, a) => s + a.numberOfSteps, 0)
  const badges: string[] = []

  if (totalPas > 100_000) badges.push('🏃 Marathonien')
  if (mergedData.some(d => d.mood !== null && d.mood >= 8)) badges.push('😊 Positivité')
  if (mergedData.some(d => d.poids !== null && d.poids < 75)) badges.push('⚖️ Perte de poids')

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Vos Badges</h3>
      <div className="flex flex-wrap gap-2">
        {badges.length > 0
          ? badges.map((b, i) => (
              <span key={i} className="px-3 py-1 bg-yellow-200 dark:bg-yellow-700 rounded-full text-sm">
                {b}
              </span>
            ))
          : <p className="text-gray-500 dark:text-gray-400">Aucun badge débloqué pour le moment.</p>
        }
      </div>
    </div>
  )
}
