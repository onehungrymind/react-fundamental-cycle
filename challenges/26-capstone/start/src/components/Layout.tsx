// TODO Feature 2: Add a Dashboard nav item pointing to /dashboard.
// The navItems array below currently only has Projects.
// Add: { label: 'Dashboard', path: '/dashboard', icon: '\u229E' }
// at the top of the array.

import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { useAppSelector, useAppDispatch } from '../store/redux/hooks'
import { toggle } from '../store/redux/sidebarSlice'
import type { NavItem } from '../types'
import '../App.css'

const navItems: NavItem[] = [
  // TODO Feature 2: add { label: 'Dashboard', path: '/dashboard', icon: '\u229E' } here
  { label: 'Projects',  path: '/projects',  icon: '\u25A6' },
]

export function Layout() {
  const isCollapsed = useAppSelector((s) => s.sidebar.isCollapsed)
  const dispatch = useAppDispatch()

  return (
    <div className={`app-grid${isCollapsed ? ' app-grid--sidebar-collapsed' : ''}`}>
      <Header
        title="TaskFlow"
        subtitle="Manage your work"
        onToggleSidebar={() => dispatch(toggle())}
      />
      <Sidebar navItems={navItems} isCollapsed={isCollapsed} />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
