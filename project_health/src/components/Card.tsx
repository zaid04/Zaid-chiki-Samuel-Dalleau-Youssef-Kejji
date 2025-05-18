import { ReactNode } from 'react'

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="
      bg-white dark:bg-gray-800 
      text-gray-900 dark:text-gray-100
      rounded-2xl shadow-md 
      p-6
      transition-colors
    ">
      {children}
    </div>
  )
}
