// Header renders the top bar of the application shell.
//
// Challenge 12 starting point:
//   - Title and subtitle are passed as props from Layout
//   - The user name "Sarah Chen" is HARDCODED here — no context yet
//   - There is no theme toggle — add one using useTheme() from ThemeContext
//
// Your tasks:
//   1. Import and call useTheme() to get { theme, toggleTheme }
//   2. Import and call useAuth() to get { user }
//   3. Render a theme toggle button that calls toggleTheme
//   4. Render the user's avatar and name (or a "Sign In" button if user is null)

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      {/* TODO: Replace this section with real theme toggle and auth UI */}
      <div className="header-actions">
        <span className="header-nav-placeholder">Sarah Chen</span>
      </div>
    </header>
  )
}

export default Header
