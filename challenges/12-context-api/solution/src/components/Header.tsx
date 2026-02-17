import { useTheme } from '../context/ThemeContext'
import { useAuth, DEFAULT_USER } from '../context/AuthContext'

// Header renders the top bar of the application shell.
//
// Challenge 12 changes:
//   - useTheme() provides { theme, toggleTheme } — no prop drilling needed
//   - useAuth() provides { user, login, logout } — no prop drilling needed
//   - Theme toggle button sets data-theme on <html> via ThemeContext
//   - User avatar and name from AuthContext (or "Sign In" when logged out)
//
// Both hooks throw if called outside their providers, which is fine here
// because Header is always rendered inside <ThemeProvider> and <AuthProvider>
// (both are at the root of the tree in App.tsx).

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();

  return (
    <header className="app-header">
      {/* ---- Brand ---- */}
      <div className="header-brand">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      {/* ---- Actions (theme + auth) ---- */}
      <div className="header-actions">
        {/* Theme toggle */}
        <button
          type="button"
          className="header-theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Auth area */}
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
