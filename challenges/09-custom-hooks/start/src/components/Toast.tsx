// Toast displays a temporary success notification.
//
// Design decisions:
//   - Receives a message string and renders it in a fixed-position overlay.
//   - The parent (MainContent) owns the toastMessage state and the timer that
//     clears it.  Toast itself is a pure display component — no state, no
//     side effects.  This makes it easy to test and reuse.
//   - The CSS class .toast uses position: fixed so it floats above all other
//     content regardless of the scroll position of the page.

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
