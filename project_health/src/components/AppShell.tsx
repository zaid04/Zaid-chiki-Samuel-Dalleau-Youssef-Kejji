// src/components/AppShell.tsx
import { useEffect, useState } from 'react'
import { Outlet, Link, useOutletContext } from 'react-router-dom'

export default function AppShell() {
  // on attrape context de PatientDetailsLayout
  const context = useOutletContext()

  const [mobileNav, setMobileNav] = useState(false)
  const [dark, setDark] = useState(() => {
    // au load, on vérifie localStorage
    return localStorage.theme === 'light' ? false : true
  })

  // On gère la classe dark sur le html
  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      root.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }, [dark])

  const nav = [
    { to: '',          label: 'Dashboard' },
    { to: 'activites', label: 'Activités'  },
    { to: 'evolution', label: 'Évolution'  },
    { to: 'emotion',   label: 'Émotionnel'},
    { to: 'radar',     label: 'Radar'      },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-gray-800 shadow-lg">
        <div className="py-6 px-4 text-2xl font-bold">HealthApp</div>
        <nav className="flex-1 px-4 space-y-2">
          {nav.map(({to,label}) => (
            <Link
              key={to}
              to={to||''}
              className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setDark(d => !d)}
          className="m-4 p-2 bg-gray-100 dark:bg-gray-700 rounded"
          aria-label="Toggle theme"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-12 bg-white dark:bg-gray-800 flex items-center px-4 z-10">
        <button onClick={() => setMobileNav(v => !v)} className="text-xl">
          {mobileNav ? '✕' : '☰'}
        </button>
        <div className="flex-1 text-center font-bold">HealthApp</div>
        <button onClick={() => setDark(d => !d)} className="text-xl">
          {dark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Mobile nav */}
      {mobileNav && (
        <nav className="md:hidden fixed top-12 left-0 right-0 bg-white dark:bg-gray-800 p-2 z-10 space-y-1">
          {nav.map(({to,label}) => (
            <Link
              key={to}
              to={to||''}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={()=>setMobileNav(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}

      {/* Contenu */}
      <main className="flex-1 overflow-auto pt-12 md:pt-0 p-6">
        <Outlet context={context}/>
      </main>
    </div>
  )
}
