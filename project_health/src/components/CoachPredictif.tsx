// src/components/CoachPredictif.tsx
import React, { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from 'recharts'

type Donnee = {
  date: string
  pas: number
  mood: number | null
  poids: number | null
}

export default function CoachPredictif() {
  const { mergedData } = useOutletContext<{ mergedData: Donnee[] }>()

  // 1. Trier et extraire les 14 derniers jours
  const data = useMemo(() => {
    return [...mergedData]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14)
      .map(d => ({
        date: d.date.slice(5), // MM-DD pour l'affichage
        pas: d.pas,
        mood: d.mood ?? undefined,
        poids: d.poids ?? undefined,
      }))
  }, [mergedData])

  // 2. Séparation en deux périodes de 7 jours
  const avant = data.slice(0, 7)
  const apres = data.slice(7)

  // 3. Calcul des variations
  const somme = (arr: number[]) => arr.reduce((s, v) => s + v, 0)
  const pasAvant = somme(avant.map(d => d.pas))
  const pasApres = somme(apres.map(d => d.pas))
  const variationPas = pasAvant > 0 ? ((pasApres - pasAvant) / pasAvant) * 100 : 0

  const moodAvant = avant.map(d => d.mood ?? 0)
  const moodApres = apres.map(d => d.mood ?? 0)
  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / (arr.length || 1)
  const variationMood = ((avg(moodApres) - avg(moodAvant)) / (avg(moodAvant) || 1)) * 100

  const poidsAvant = avant.map(d => d.poids ?? 0)
  const poidsApres = apres.map(d => d.poids ?? 0)
  const variationPoids =
    poidsAvant[0] > 0
      ? ((poidsApres[poidsApres.length - 1] - poidsAvant[0]) / poidsAvant[0]) * 100
      : 0

  // 4. Génération des conseils
  const conseils: string[] = []

  // Conseils pas
  if (variationPas < -10) {
    conseils.push(
      'Votre activité physique a baissé de plus de 10% : essayez un défi de 7 000 pas/jour sur 3 jours.'
    )
  } else if (variationPas > 10) {
    conseils.push('👏 Vous avez augmenté vos pas de plus de 10% ! Continuez sur cette lancée.')
  } else {
    conseils.push('Votre niveau de pas est stable : pourquoi ne pas tester une nouvelle balade ?')
  }

  // Conseils humeur
  if (variationMood < -10) {
    conseils.push(
      'Votre humeur a diminué : intégrez 5 minutes de méditation quotidienne ou une pause respiration.'
    )
  } else if (variationMood > 10) {
    conseils.push('😊 Belle progression d’humeur ! Gardez vos bonnes habitudes.')
  } else {
    conseils.push('Humeur stable : variez vos activités pour stimuler votre bien-être.')
  }

  // Conseils poids
  if (variationPoids > 2) {
    conseils.push(
      'Petit gain de poids détecté : privilégiez des repas riches en protéines et réduisez les sucres simples.'
    )
  } else if (variationPoids < -2) {
    conseils.push('Vous avez perdu du poids : veillez à un apport calorique suffisant et équilibré.')
  } else {
    conseils.push('Poids stable : continuez votre routine actuelle pour maintenir cet équilibre.')
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-xl font-bold">Coach Prédictif</h3>

      {/* Mini-graphique des pas */}
      <div className="w-full h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gradPas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v: number) => v.toLocaleString() + ' pas'} />
            <Area
              type="monotone"
              dataKey="pas"
              stroke="#10B981"
              fill="url(#gradPas)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Variation pas : <strong>{variationPas.toFixed(1)}%</strong>
      </p>

      {/* Mini-graphique humeur */}
      <div className="w-full h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gradMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v: number) => v.toFixed(1) + '/10'} />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#F59E0B"
              fill="url(#gradMood)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Variation humeur : <strong>{variationMood.toFixed(1)}%</strong>
      </p>

      {/* Mini-graphique poids */}
      <div className="w-full h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gradPoids" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v: number) => v.toFixed(1) + ' kg'} />
            <Area
              type="monotone"
              dataKey="poids"
              stroke="#3B82F6"
              fill="url(#gradPoids)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Variation poids : <strong>{variationPoids.toFixed(1)}%</strong>
      </p>

      {/* Suggestions */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-2">
        <h4 className="font-semibold">Vos conseils personnalisés</h4>
        <ul className="list-disc list-inside text-gray-800 dark:text-gray-200">
          {conseils.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
)
}
