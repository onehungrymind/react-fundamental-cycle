interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = 'Loading\u2026' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status" aria-label={label}>
      <div className="loading-spinner__ring" aria-hidden="true" />
      <span className="loading-spinner__text">{label}</span>
    </div>
  )
}

export default LoadingSpinner
