import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth, DEFAULT_USER } from '../context/AuthContext'

// Header exposes:
//   - Theme toggle (React Context)
//   - Auth sign in / sign out (React Context)
//   - Sidebar toggle button (prop passed from Layout via Redux dispatch)
//   - Notification preferences popover (local state — not in Redux store)
//
// Notification preferences were part of the Zustand store in ch17, but
// they are intentionally omitted from the Redux migration in ch18 to keep
// the slice surface focused.  They are managed with local useState here.

interface HeaderProps {
  title: string;
  subtitle: string;
  onToggleSidebar: () => void;
}

export function Header({ title, subtitle, onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();

  // Notification preferences kept as local state in this challenge
  const [showSuccess, setShowSuccess] = useState(true);
  const [showError, setShowError] = useState(true);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  return (
    <header className="app-header">
      <div className="header-brand">
        <button
          type="button"
          className="header-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          &#9776;
        </button>
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      <div className="header-actions">
        {/* Notification preferences */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="header-theme-btn"
            onClick={() => setShowNotifPanel((v) => !v)}
            aria-label="Notification preferences"
            title="Notification preferences"
            aria-expanded={showNotifPanel}
          >
            &#128276;
          </button>

          {showNotifPanel && (
            <div
              style={{
                position: 'absolute',
                top: '2.25rem',
                right: 0,
                zIndex: 500,
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                minWidth: '200px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
              role="dialog"
              aria-label="Notification preferences"
            >
              <p
                style={{
                  margin: '0 0 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-muted)',
                }}
              >
                Notifications
              </p>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  marginBottom: '0.375rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={showSuccess}
                  onChange={() => setShowSuccess((v) => !v)}
                />
                Success toasts
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={showError}
                  onChange={() => setShowError((v) => !v)}
                />
                Error toasts
              </label>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          className="header-theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '\uD83C\uDF19' : '\u2600\uFE0F'}
        </button>

        {user !== null ? (
          <div className="header-user">
            <img
              src={user.avatarUrl}
              alt={`${user.name}'s avatar`}
              className="header-avatar"
              width={32}
              height={32}
            />
            <span className="header-user-name">{user.name}</span>
            <button
              type="button"
              className="btn-secondary"
              onClick={logout}
              style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => login(DEFAULT_USER)}
            style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
