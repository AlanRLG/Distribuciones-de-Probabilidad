import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSimulationOptions<T> {
  run: () => Promise<T>;
  runOnMount?: boolean;
}

export function useSimulation<T>({ run, runOnMount = true }: UseSimulationOptions<T>) {
  const [results, setResults] = useState<T | null>(null);
  const [loading, setLoading] = useState(runOnMount);
  const [error, setError] = useState<string | null>(null);
  const runRef = useRef(run);

  runRef.current = run;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runRef.current();
      setResults(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al conectar con el backend. ¿Está corriendo uvicorn en el puerto 8000?';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (runOnMount) {
      void execute();
    }
  }, [execute, runOnMount]);

  return { results, loading, error, execute };
}
