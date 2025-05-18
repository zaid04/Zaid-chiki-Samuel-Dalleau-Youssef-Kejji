import { useOutletContext } from 'react-router-dom'
import Card from '../components/Card'

export default function PatientInfoSection() {
  const { person } = useOutletContext<{person:any}>()
  const age = person.birthyear ? new Date().getFullYear() - person.birthyear : '-'
  const infos = [
    { label:'Âge', value:`${age} ans` },
    { label:'Taille', value:`${person.height ?? '-'} cm` },
    { label:'Poids initial', value:`${person.weightStart ?? '-'} kg` },
    { label:'Objectif poids', value:`${person.weightGoal ?? '-'} kg` },
    { label:'IMC initial', value:person.bmiStart ?? '-' },
    { label:'IMC cible',   value:person.bmiGoal ?? '-' },
    { label:'Profil act.',value:person.activityProfile ?? '-' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {infos.map(i=>(
        <Card key={i.label}>
          <p className="text-sm text-gray-500 dark:text-gray-400">{i.label}</p>
          <p className="text-xl font-bold">{i.value}</p>
        </Card>
      ))}
    </div>
  )
}
