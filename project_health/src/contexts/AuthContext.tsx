import { createContext, useState, ReactNode, useEffect } from 'react';
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
  // Initialise auth depuis localStorage, avec parse sécurisé et validation
  const [auth, setAuth] = useState<Auth>(() => {
    try {
      const stored = localStorage.getItem('auth');
      if (!stored) {
        console.log("Aucune donnée 'auth' dans localStorage");
        return null;
      }
      const parsed = JSON.parse(stored);
      
      // Validation basique
      if (parsed && typeof parsed.email === 'string' && typeof parsed.token === 'string') {
        console.log("Token récupéré au démarrage :", parsed.token);
        setAuthToken(parsed.token);
        return parsed;
      } else {
        console.warn("Données 'auth' invalides dans localStorage :", parsed);
        return null;
      }
    } catch (error) {
      console.error("Erreur lors du parsing de 'auth' dans localStorage :", error);
      return null;
    }
  });

  // Optionnel : synchroniser auth dans localStorage quand il change
  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
      setAuthToken(auth.token);
    } else {
      localStorage.removeItem('auth');
      setAuthToken('');
    }
  }, [auth]);

  return (
    <AuthCtx.Provider value={{ auth, setAuth }}>
      {children}
    </AuthCtx.Provider>
  );
}
