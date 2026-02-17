import { useState, useEffect, useCallback } from 'react'

// ============================================================
// Types
// ============================================================

export interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// ============================================================
// useFetch<T>
//
// Generic hook that wraps the browser fetch() API with:
//   - loading / error / success state
//   - AbortController cleanup on unmount / url change
//   - response.ok check before parsing JSON
//   - refetch() to re-trigger the request imperatively
//
// Usage:
//   const { data, isLoading, error, refetch } = useFetch<Project[]>('/api/projects');
//
// Lifecycle:
//   1. Effect fires  → isLoading: true, fetch in-flight
//   2a. Success      → isLoading: false, data: T
//   2b. HTTP error   → isLoading: false, error: Error('HTTP 404')
//   2c. Network err  → isLoading: false, error: Error('...')
//   2d. AbortError   → ignored (component unmounted or url changed)
//
// StrictMode note:
//   React 18 StrictMode mounts effects twice in dev.  The cleanup returned
//   from useEffect calls controller.abort() on the first run, cancelling
//   the stale request.  Only the second request completes and sets state.
// ============================================================

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Incrementing this counter is how we trigger a re-fetch without changing
  // the url.  useCallback ensures `refetch` is a stable reference.
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    // Create a new AbortController for each fetch so we can cancel it on
    // cleanup.  A single controller per effect instance is correct because
    // each effect invocation has its own controller and cleanup.
    const controller = new AbortController();

    // Reset to loading state at the start of each fetch
    setIsLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        // fetch() only rejects on network errors; HTTP 4xx/5xx resolve with
        // ok === false.  We must check before calling .json() so we don't
        // silently treat error bodies as valid data.
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json() as Promise<T>;
      })
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        // AbortError fires when controller.abort() is called during cleanup.
        // This is expected behaviour — not an error the UI needs to show.
        if (err instanceof Error && err.name === 'AbortError') return;

        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      });

    // Cleanup: abort the in-flight request when:
    //   - the component unmounts, OR
    //   - the effect re-runs because `url` or `fetchCount` changed
    return () => {
      controller.abort();
    };
  }, [url, fetchCount]);

  // Stable callback — incrementing fetchCount forces the effect to re-run.
  const refetch = useCallback(() => {
    setFetchCount((c) => c + 1);
  }, []);

  return { data, isLoading, error, refetch };
}
