import './App.css'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { Footer } from './components/Footer'
import type { NavItem } from './types'

// TODO (Challenge 10, Task 4): Replace this entire component with a BrowserRouter
// wrapping a Routes tree. You will need:
//   - A redirect from / to /projects
//   - A layout route using the new Layout component
//   - Child routes for /projects, /projects/new, /projects/:projectId
//   - A catch-all * route for NotFoundPage
//
// The navItems paths should become real routes:
//   /projects  (Dashboard and Projects both point here for now)
//   /team      (will hit the 404 page — intentional)

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '#dashboard' },
  { label: 'Projects',  path: '#projects'  },
  { label: 'Team',      path: '#team'      },
]

export function App() {
  return (
    <div className="app-grid">
      <Header title="TaskFlow" subtitle="Manage your work" />
      <Sidebar navItems={navItems} />
      <MainContent />
      <Footer />
    </div>
  )
}

export default App
