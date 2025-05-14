// src/components/Protected.tsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthCtx } from '../contexts/AuthContext';

export default function Protected({ children }: { children: JSX.Element }) {
  const { auth } = useContext(AuthCtx);
  return auth ? children : <Navigate to="/login" replace />;
}
