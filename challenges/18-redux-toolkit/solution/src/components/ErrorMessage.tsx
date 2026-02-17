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
