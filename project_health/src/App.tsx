// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Patients from './pages/Patients'
import Protected from './components/Protected'
import PatientDetailsLayout from './pages/PatientDetailsLayout'
import AppShell from './components/AppShell'
import PatientChartLanding from './pages/PatientChartLanding'
import PatientActivitiesSection from './pages/PatientActivitiesSection'
import PatientEvolutionSection from './pages/PatientEvolutionSection'
import PatientEmotionSection from './pages/PatientEmotionSection'
import PatientRadarSection from './pages/PatientRadarSection'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/patients" element={<Protected><Patients/></Protected>} />

      <Route
        path="/patients/:id"
        element={<Protected><PatientDetailsLayout/></Protected>}
      >
        {/* Le Dashboard unique */}
        <Route element={<AppShell/>}>
          <Route index element={<PatientChartLanding/>} />
          {/* On garde ces sections si besoin de pages dédiées */}
          <Route path="activites" element={<PatientActivitiesSection/>} />
          <Route path="evolution" element={<PatientEvolutionSection/>} />
          <Route path="emotion" element={<PatientEmotionSection/>} />
          <Route path="radar" element={<PatientRadarSection/>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
