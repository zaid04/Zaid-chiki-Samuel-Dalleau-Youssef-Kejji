import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
import Protected from './components/Protected';

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/patients"
        element={
          <Protected>
            <Patients />
          </Protected>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <Protected>
            <PatientDetails />
          </Protected>
        }
      />

      {/* catch‑all : redirige vers / */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    
  );
}
