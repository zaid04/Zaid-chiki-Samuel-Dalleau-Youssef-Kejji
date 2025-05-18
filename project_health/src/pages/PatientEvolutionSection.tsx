import { useOutletContext, Link } from 'react-router-dom'
import Card from '../components/Card'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend
} from 'recharts'

export default function PatientEvolutionSection() {
  const { mergedData } = useOutletContext<{ mergedData:any[] }>()

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
        <Link to="/patients" className="hover:underline">← Patients</Link>
        <Link to=".." className="hover:underline">/ Dashboard</Link>
      </nav>
      <h2 className="text-2xl font-semibold">Évolution des données</h2>

      <Card>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData} margin={{top:10,right:20,bottom:30,left:0}}>
              <XAxis
                dataKey="date"
                tick={{fontSize:12, fill:'#6B7280'}}
                angle={-45} textAnchor="end" height={50}
              />
              <YAxis tick={{fill:'#6B7280'}}/>
              <Tooltip contentStyle={{background:'#fff',borderRadius:8}}/>
              <Legend verticalAlign="top"/>
              <Line dataKey="poids" name="Poids (kg)" stroke="#3B82F6" dot={false}/>
              <Line dataKey="pas"   name="Pas"         stroke="#10B981" dot={false}/>
              {mergedData.some(d=>d.mood!==null)&&(
                <Line dataKey="mood" name="Humeur" stroke="#F59E0B" dot={false}/>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
