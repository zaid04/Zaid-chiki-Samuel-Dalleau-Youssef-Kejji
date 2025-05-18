import { useOutletContext, Link } from 'react-router-dom'
import Card from '../components/Card'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip
} from 'recharts'

export default function PatientEmotionSection() {
  const { psychic: raw } = useOutletContext<{ psychic:any[] }>()
  const data = raw
    .map(p=>({date:p.date,score:p.mood_score, feeling:p.feeling}))
    .sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime())

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
        <Link to="/patients" className="hover:underline">← Patients</Link>
        <Link to=".." className="hover:underline">/ Dashboard</Link>
      </nav>

      <h2 className="text-2xl font-semibold">Suivi émotionnel</h2>

      <Card>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top:10, right:20, bottom:30, left:0 }}>
              <XAxis
                dataKey="date"
                tick={{fontSize:12, fill:'#6B7280'}}
                angle={-45} textAnchor="end" height={50}
              />
              <YAxis domain={[0,10]} tick={{fill:'#6B7280'}} ticks={[0,2,4,6,8,10]}/>
              <Tooltip 
                formatter={(v:number)=>`${v}/10`}
                labelFormatter={l=>new Date(l).toLocaleDateString('fr-FR')}
                contentStyle={{background:'#fff',borderRadius:8}}
              />
              <Line dataKey="score" stroke="#F59E0B" strokeWidth={2} dot={{r:4}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((p,i)=>(
          <Card key={i}>
            <div className="flex items-center gap-4">
              <span className="text-3xl">
                {p.score>=8?'😊':p.score>=5?'🙂':p.score>=3?'😐':'😞'}
              </span>
              <div>
                <p className="text-sm font-medium">{new Date(p.date).toLocaleDateString('fr-FR')}</p>
                <p className="capitalize">{p.feeling}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
)
}
