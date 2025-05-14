import { useEffect, useState } from 'react';
import api from '../services/api';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(url)
      .then(r => setData(r.data.data))
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
