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
      <nav className="header-nav" aria-label="Primary navigation">
        <span className="header-nav-placeholder">Nav goes here</span>
      </nav>
    </header>
  )
}

export default Header
