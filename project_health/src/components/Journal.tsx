// src/components/Journal.tsx
import React, { useState } from 'react'

const analyseSentiment = (texte: string) => {
  const positifs = ['bien', 'heureux', 'super', 'content', 'motivé']
  const negatifs = ['mal', 'triste', 'fatigué', 'anxieux', 'déprimé']
  let score = 0
  texte.split(/\s+/).forEach(mot => {
    const lm = mot.toLowerCase()
    if (positifs.includes(lm)) score += 1
    if (negatifs.includes(lm)) score -= 1
  })
  // Ramène la valeur sur [0,1]
  return Math.max(Math.min((score + 3) / 6, 1), 0)
}

export default function Journal() {
  const [entries, setEntries] = useState<{ texte: string; date: string; sentiment: number }[]>([])
  const [texte, setTexte] = useState('')

  const ajouter = () => {
    if (!texte) return
    const sentiment = analyseSentiment(texte)
    setEntries([{ texte, date: new Date().toISOString(), sentiment }, ...entries])
    setTexte('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <textarea
          className="flex-1 p-2 border rounded"
          placeholder="Votre journal..."
          value={texte}
          onChange={e => setTexte(e.target.value)}
        />
        <button onClick={ajouter} className="px-4 bg-blue-600 text-white rounded">
          Ajouter
        </button>
      </div>
      <div className="space-y-2">
        {entries.map((e, i) => (
          <div key={i} className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{new Date(e.date).toLocaleString()}</span>
              <span>{Math.round(e.sentiment * 10)}/10 😊</span>
            </div>
            <p className="mt-1">{e.texte}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
