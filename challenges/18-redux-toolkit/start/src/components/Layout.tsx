import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { useSidebarState } from '../store/selectors'
import type { NavItem } from '../types'
import '../App.css'

// TODO (Challenge 18): Replace the Zustand selector with Redux equivalents.
//
// Current (Zustand):
//   const { isCollapsed, toggle } = useSidebarState()
//
// Target (Redux):
//   import { useAppSelector, useAppDispatch } from '../store/redux/hooks'
//   import { toggle } from '../store/redux/sidebarSlice'
//
//   const isCollapsed = useAppSelector((s) => s.sidebar.isCollapsed)
//   const dispatch = useAppDispatch()
//   // pass () => dispatch(toggle()) as onToggleSidebar

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/projects', icon: '\u229E' },
  { label: 'Projects',  path: '/projects', icon: '\u25A6' },
  { label: 'Team',      path: '/team',     icon: '\u25CF' },
]

export function Layout() {
  const { isCollapsed, toggle } = useSidebarState()

  return (
    <div className={`app-grid${isCollapsed ? ' app-grid--sidebar-collapsed' : ''}`}>
      <Header title="TaskFlow" subtitle="Manage your work" onToggleSidebar={toggle} />
      <Sidebar navItems={navItems} isCollapsed={isCollapsed} />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
