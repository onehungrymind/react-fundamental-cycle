import './App.css'

// TODO: Break this monolithic component into four separate files:
//
//   src/components/Header.tsx      — the <header> block below
//   src/components/Sidebar.tsx     — the <aside> block below
//   src/components/MainContent.tsx — the <main> block below
//   src/components/Footer.tsx      — the <footer> block below
//
// Then import all four here and replace the inline JSX with:
//   <Header />
//   <Sidebar />
//   <MainContent />
//   <Footer />
//
// Finally, update App.css so the .app-grid container uses CSS Grid with
// grid-template-areas: "header header" / "sidebar main" / "footer footer"

export function App() {
  return (
    <div className="app-grid">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-brand">
          <h1 className="header-title">TaskFlow</h1>
        </div>
        <nav className="header-nav" aria-label="Primary navigation">
          <span className="header-nav-placeholder">Nav goes here</span>
        </nav>
      </header>

      {/* ── Sidebar ────────────────────────────────────── */}
      <aside className="app-sidebar">
        <nav aria-label="Sidebar navigation">
          <ul className="sidebar-nav-list">
            <li>
              <a href="#dashboard" className="sidebar-nav-link sidebar-nav-link--active">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#projects" className="sidebar-nav-link">
                Projects
              </a>
            </li>
            <li>
              <a href="#team" className="sidebar-nav-link">
                Team
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ── Main content ───────────────────────────────── */}
      <main className="app-main">
        <div className="main-inner">
          <h2 className="main-heading">Welcome to TaskFlow</h2>
          <p className="main-description">
            Select a project from the sidebar to get started, or create a new one.
          </p>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="app-footer">
        <p>Built with React + TypeScript</p>
      </footer>
    </div>
  )
}

export default App
