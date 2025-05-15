import { useContext } from 'react';
import { AuthCtx } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../services/api';

export default function LogoutButton() {
  const { setAuth } = useContext(AuthCtx);
  const nav = useNavigate();

  function handleLogout() {
    localStorage.removeItem('auth');  // Supprime le token stocké
    setAuthToken(null);                // Supprime l'Authorization dans axios
    setAuth(null);                    // Met le contexte à null
    nav('/login');                   // Redirige vers la page de connexion
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      Déconnexion
    </button>
  );
}
