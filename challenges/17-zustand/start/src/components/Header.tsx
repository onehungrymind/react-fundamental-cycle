import { useTheme } from '../context/ThemeContext'
import { useAuth, DEFAULT_USER } from '../context/AuthContext'

// Challenge 17 — Zustand
//
// TODO: Add notification preferences using useNotificationPrefs() from
//       src/store/selectors.ts so the user can toggle showSuccessToasts
//       and showErrorToasts.

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      <div className="header-actions">
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
