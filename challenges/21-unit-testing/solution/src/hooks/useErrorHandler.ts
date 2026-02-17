import { useState } from 'react'

// useErrorHandler bridges async errors into the nearest ErrorBoundary.
//
// Problem: ErrorBoundary only catches errors thrown during rendering.
// Errors thrown inside event handlers, setTimeout, or fetch callbacks
// are NOT caught by error boundaries.
//
// Solution: store the error in state.  On the next render, if there is
// a non-null error, throw it immediately during the render phase.
// That throw propagates up the React tree and is caught by the nearest
// ErrorBoundary.
//
// Usage:
//
//   const handleError = useErrorHandler();
//
//   async function loadData() {
//     try {
//       const result = await fetch('/api/data');
//       if (!result.ok) throw new Error(`HTTP ${result.status}`);
//       setData(await result.json());
//     } catch (err) {
//       handleError(err instanceof Error ? err : new Error(String(err)));
//     }
//   }

export function useErrorHandler(): (error: Error) => void {
  const [error, setError] = useState<Error | null>(null)

  if (error !== null) {
    throw error
  }

  return setError
}
