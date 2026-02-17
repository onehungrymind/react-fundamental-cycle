// LoadingSpinner — accessible loading indicator.
//
// Uses a CSS animation rather than an SVG or image so it works without any
// external resources.  The visually-hidden text is picked up by screen
// readers while the spinning ring is hidden from assistive technology via
// aria-hidden.

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = 'Loading…' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status" aria-label={label}>
      <div className="loading-spinner__ring" aria-hidden="true" />
      <span className="loading-spinner__text">{label}</span>
    </div>
  )
}

export default LoadingSpinner
