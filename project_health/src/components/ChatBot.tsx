// src/components/ChatBot.tsx
import React, { useState } from 'react'

export default function ChatBot() {
  const [messages, setMessages] = useState<{ de: 'utilisateur'|'bot'; texte: string }[]>([])
  const [input, setInput] = useState('')

  const envoyer = () => {
    if (!input) return
    const msgUser = { de: 'utilisateur', texte: input }
    setMessages([msgUser, ...messages])
    // réponse factice
    const reponse = `Bot : ${input}`
    setMessages([{ de: 'bot', texte: reponse }, msgUser, ...messages])
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.de === 'utilisateur' ? 'text-right' : 'text-left'}>
            <span
              className={`inline-block px-3 py-1 rounded ${
                m.de === 'utilisateur'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
              }`}
            >
              {m.texte}
            </span>
          </div>
        ))}
      </div>
      <div className="flex p-2 border-t">
        <input
          className="flex-1 p-2 rounded border mr-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && envoyer()}
          placeholder="Envoyer un message..."
        />
        <button onClick={envoyer} className="px-4 bg-green-600 text-white rounded">
          Envoyer
        </button>
      </div>
    </div>
  );
}
