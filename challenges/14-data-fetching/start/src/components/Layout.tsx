import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import type { NavItem } from '../types'
import '../App.css'

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
