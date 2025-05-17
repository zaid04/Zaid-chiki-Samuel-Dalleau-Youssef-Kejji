import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { AuthCtx } from '../contexts/AuthContext';
import api, { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();
  const { setAuth } = useContext(AuthCtx);
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(data: FormData) {
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', data);

      const auth = { email: data.email, token: res.data.access_token };
      localStorage.setItem('auth', JSON.stringify(auth));
      setAuthToken(auth.token);
      setAuth(auth);

      nav('/patients');
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMsg('Identifiants incorrects.');
      } else {
        setErrorMsg('Erreur serveur, réessayez plus tard.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-80 rounded-lg bg-white p-6 shadow-lg border border-green-200"
      >
        <h1 className="mb-4 text-center text-3xl font-bold text-green-600">
          Connexion
        </h1>

        <input
          {...register('email', { required: true })}
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded border border-green-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />

        <input
          {...register('password', { required: true })}
          type="password"
          placeholder="Mot de passe"
          className="mb-4 w-full rounded border border-green-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />

        {errorMsg && (
          <p className="mb-3 rounded bg-red-100 p-2 text-center text-sm text-red-700">
            {errorMsg}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full rounded bg-green-400 py-2 text-white font-semibold shadow hover:bg-green-500 transition disabled:opacity-50"
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
