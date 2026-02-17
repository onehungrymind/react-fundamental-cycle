import type React from 'react'

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastProps {
  message: string;
  variant?: 'success' | 'error';
  action?: ToastAction;
}

const VARIANT_STYLES: Record<'success' | 'error', React.CSSProperties> = {
  success: {
    backgroundColor: '#166534',
    color: '#dcfce7',
  },
  error: {
    backgroundColor: '#991b1b',
    color: '#fee2e2',
  },
}

const VARIANT_ICONS: Record<'success' | 'error', string> = {
  success: '\u2713',
  error: '\u2715',
}

export function Toast({ message, variant = 'success', action }: ToastProps) {
  return (
    <div
      className="toast"
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      style={VARIANT_STYLES[variant]}
    >
      <span className="toast__icon" aria-hidden="true">
        {VARIANT_ICONS[variant]}
      </span>
      {message}
      {action !== undefined && (
        <button
          type="button"
          onClick={action.onClick}
          style={{
            marginLeft: '0.75rem',
            padding: '0.125rem 0.625rem',
            border: '1px solid currentColor',
            borderRadius: '4px',
            background: 'transparent',
            color: 'inherit',
            font: 'inherit',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            opacity: 0.9,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default Toast
