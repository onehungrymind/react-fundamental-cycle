import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import type { NavItem } from '../types'

// Layout is a layout route component.
//
// It renders the persistent shell (Header, Sidebar, Footer) and uses <Outlet />
// as the slot where the currently matched child route's element renders.
//
// Because Layout is the element of a path-less Route, React Router never
// unmounts it between navigations — only the content inside <Outlet /> swaps.
// This means the sidebar highlights update instantly and the header never
// flickers.
//
// navItems are defined here (co-located with the layout that uses them) rather
// than in App.tsx so the routing configuration in App.tsx stays focused on
// routes, not on what labels appear in the sidebar.

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
      {/* app-main is the CSS grid area for the page content column. */}
      <main className="app-main">
        {/* <Outlet /> is where React Router renders the matched child route.
            Navigating from /projects to /projects/new swaps only this slot. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
