// src/components/SyntheseHebdomadaire.tsx
import React, { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function SyntheseHebdomadaire() {
  const { mergedData } = useOutletContext<{
    mergedData: { date: string; poids: number | null; pas: number; mood: number | null }[]
  }>()

  const texte = useMemo(() => {
    const dernieres7 = mergedData.slice(-7)
    const pasMoyen = Math.round(dernieres7.reduce((s, d) => s + d.pas, 0) / 7)
    const poidsVals = dernieres7.filter(d => d.poids !== null).map(d => d.poids!)
    const deltaPoid = poidsVals.length > 1
      ? poidsVals[poidsVals.length - 1] - poidsVals[0]
      : 0
    const humeurMoy = dernieres7
      .filter(d => d.mood !== null)
      .reduce((s, d) => s + (d.mood || 0), 0) /
      dernieres7.filter(d => d.mood !== null).length

    return `Cette semaine, vous avez marché en moyenne ${pasMoyen.toLocaleString()} pas/jour.` +
      (deltaPoid !== 0
        ? ` Votre poids a ${deltaPoid > 0 ? 'augmenté' : 'diminué'} de ${Math.abs(deltaPoid).toFixed(1)} kg.`
        : '') +
      ` Votre humeur moyenne était de ${humeurMoy.toFixed(1)}/10.`
  }, [mergedData])

  return (
    <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Synthèse Hebdomadaire</h3>
      <p className="text-gray-700 dark:text-gray-300">{texte}</p>
    </div>
  )
}
