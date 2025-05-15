// src/components/LogoutButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Déconnexion logique (par exemple, supprimer un token d'authentification)
    localStorage.removeItem('authToken'); // Exemple : supposer que le token est stocké dans localStorage
    navigate('/signin'); // Redirige l'utilisateur vers la page de connexion
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-500"
    >
      Déconnexion
    </button>
  );
};

export default LogoutButton;
