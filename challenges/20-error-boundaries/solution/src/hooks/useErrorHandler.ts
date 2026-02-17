import { useState } from 'react'

// Challenge 20 — Error Boundaries
//
// useErrorHandler bridges async errors into the nearest ErrorBoundary.
//
// Problem: ErrorBoundary only catches errors thrown during rendering.
// Errors thrown inside event handlers, setTimeout, or fetch callbacks
// are NOT caught by error boundaries — they simply print to the console.
//
// Solution: store the error in state.  On the next render, if there is
// a non-null error, throw it immediately during the render phase.
// That throw propagates up the React tree and is caught by the nearest
// ErrorBoundary, which then renders its fallback UI.
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
//
// When handleError(err) is called:
//   1. setError(err) schedules a re-render
//   2. On the next render, `if (error) throw error` executes
//   3. React propagates the throw to the nearest ErrorBoundary
//   4. ErrorBoundary renders its fallback

export function useErrorHandler(): (error: Error) => void {
  const [error, setError] = useState<Error | null>(null)

  if (error !== null) {
    // Throwing during render causes React to propagate the error up
    // to the nearest ErrorBoundary in the component tree.
    throw error
  }

  return setError
}
