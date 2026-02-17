// ErrorMessage — displays an error with a Retry button.
//
// The `onRetry` callback is wired to `refetch` from `useFetch`.
// Clicking Retry increments the internal fetchCount, which forces the
// useEffect to re-run and kick off a new fetch request.

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <p className="error-message__title">Something went wrong</p>
      <p className="error-message__text">{message}</p>
      <button
        type="button"
        className="error-message__retry"
        onClick={onRetry}
      >
        &#8635; Retry
      </button>
    </div>
  )
}

export default ErrorMessage
