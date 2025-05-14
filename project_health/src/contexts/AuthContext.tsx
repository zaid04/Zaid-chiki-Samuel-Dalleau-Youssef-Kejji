import { createContext, useState, ReactNode } from 'react';

export type Auth = { email: string; token: string } | null;

type AuthContextType = {
  auth: Auth;
  setAuth: (a: Auth) => void;
};

/**
 * Contexte d’authentification accessible partout.
 */
export const AuthCtx = createContext<AuthContextType>({} as AuthContextType);

/**
 * Place ce provider autour de <App/> dans main.tsx.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<Auth>(() =>
    JSON.parse(localStorage.getItem('auth') || 'null'),
  );

  return (
    <AuthCtx.Provider value={{ auth, setAuth }}>
      {children}
    </AuthCtx.Provider>
  );
}
