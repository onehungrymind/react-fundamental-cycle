import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { DefaultErrorFallback } from './ErrorFallback'

// Challenge 20 — Error Boundaries
//
// Error boundaries MUST be class components.
//
// Two lifecycle methods are only available on class components:
//
//   getDerivedStateFromError(error)
//     Called synchronously during the render phase when a descendant throws.
//     Must be pure (no side effects).  Return value is merged into state.
//     Used to render the fallback UI.
//
//   componentDidCatch(error, errorInfo)
//     Called during the commit phase (after the DOM has been updated).
//     Safe for side effects: logging, analytics, error reporting services.
//
// A hook-based API for error boundaries has been discussed by the React team
// but is not available as of React 19.

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Optional render-prop for a custom fallback UI.
   * Receives the caught error and a resetError callback.
   * If omitted, DefaultErrorFallback is rendered.
   */
  fallback?: (props: { error: Error; resetError: () => void }) => ReactNode;
  /**
   * Optional callback invoked when an error is caught.
   * Use this to send the error to an external logging service.
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // ── getDerivedStateFromError ────────────────────────────────
  // Static method: called during the render phase.
  // React uses its return value to re-render with the fallback UI.
  // Cannot call setState here — just return the new state slice.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  // ── componentDidCatch ───────────────────────────────────────
  // Instance method: called during the commit phase.
  // errorInfo.componentStack is the React component stack trace.
  // Safe for logging, analytics, Sentry, etc.
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo)
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  // ── resetError ──────────────────────────────────────────────
  // Resets the boundary so the children are rendered again.
  // Passed to the fallback UI as the "Try Again" handler.
  // Note: this does NOT fix the underlying error — the children
  // will throw again unless the error was transient (e.g. a
  // network glitch, a missing key that has since been loaded).
  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.resetError,
        })
      }
      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}
