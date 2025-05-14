import { createContext, useState, ReactNode } from 'react';
import { setAuthToken } from '../services/api';

export type Auth = { email: string; token: string } | null;

type AuthContextType = {
  auth: Auth;
  setAuth: (a: Auth) => void;
};

/** Contexte d’authentification partagé dans toute l’app */
export const AuthCtx = createContext<AuthContextType>({} as AuthContextType);

/** Provider – place‑le autour de <App /> dans main.tsx */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Recharge le token dès l’init pour que toutes les requêtes aient Authorization
  const [auth, setAuth] = useState<Auth>(() => {
    const saved = JSON.parse(localStorage.getItem('auth') || 'null');
    if (saved?.token) setAuthToken(saved.token);    // définit Axios Authorization
    return saved;
  });

  return (
    <AuthCtx.Provider value={{ auth, setAuth }}>
      {children}
    </AuthCtx.Provider>
  );
}
