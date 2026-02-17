interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__icon" aria-hidden="true">&#10003;</span>
      {message}
    </div>
  )
}

export default Toast
