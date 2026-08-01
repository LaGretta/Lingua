import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

// Minimal data-fetching hook with loading/error and a reload trigger.
// 401s are handled globally by the API client (logout + redirect), so we just
// surface a friendly message here.
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    run()
      .then((d) => {
        if (alive) setData(d);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof ApiError ? e.message : String(e));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [run, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { data, loading, error, reload };
}
