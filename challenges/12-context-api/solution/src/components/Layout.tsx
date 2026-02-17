import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import type { NavItem } from '../types'
import '../App.css'

// Layout is a layout route component.
//
// It renders the persistent shell (Header, Sidebar, Footer) and uses <Outlet />
// as the slot where the currently matched child route renders.
//
// Header now calls useTheme() and useAuth() directly — no props needed.

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/projects' },
  { label: 'Projects',  path: '/projects'  },
  { label: 'Team',      path: '/team'      },
]

export function Layout() {
  return (
    <div className="app-grid">
      <Header title="TaskFlow" subtitle="Manage your work" />
      <Sidebar navItems={navItems} />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
