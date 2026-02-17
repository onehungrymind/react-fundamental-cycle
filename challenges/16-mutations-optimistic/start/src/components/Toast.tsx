// Toast — simple notification component.
//
// TODO (Challenge 16): Update this component to support:
//   - variant: 'success' | 'error'  (error toasts should use red background)
//   - action?: { label: string; onClick: () => void }  (for Undo button on delete)

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
