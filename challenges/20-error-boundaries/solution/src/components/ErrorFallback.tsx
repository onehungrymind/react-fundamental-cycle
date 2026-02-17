// Challenge 20 — Error Boundaries
//
// Fallback UI components used by ErrorBoundary instances.
//
// DefaultErrorFallback — used for section-level boundaries
//   (project list, project detail, task form).
//   Offers a "Try Again" button that calls resetError() to re-render
//   the failed section, and a "Report Issue" mailto link.
//
// GlobalErrorFallback — used by the top-level boundary in App.tsx.
//   Because the entire React tree has crashed, we cannot trust any
//   React state or routing to work.  The only safe recovery is a
//   full page reload via window.location.reload().

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

export function DefaultErrorFallback({ error, resetError }: FallbackProps) {
  return (
    <div className="error-state" role="alert">
      <h3>Something went wrong</h3>
      <p>{error.message}</p>
      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={resetError}
          className="btn btn-primary"
        >
          Try Again
        </button>
        <a
          href="mailto:support@taskflow.dev"
          className="btn btn-ghost"
        >
          Report Issue
        </a>
      </div>
    </div>
  )
}

export function GlobalErrorFallback({ error }: FallbackProps) {
  return (
    <div className="error-state error-state--global" role="alert">
      <h2>TaskFlow encountered an error</h2>
      <p style={{ maxWidth: '480px', textAlign: 'center' }}>{error.message}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="btn btn-primary"
        style={{ marginTop: '0.5rem' }}
      >
        Reload Application
      </button>
    </div>
  )
}
