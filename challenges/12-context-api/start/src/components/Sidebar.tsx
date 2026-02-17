import { NavLink } from 'react-router-dom'
import type { NavItem } from '../types'

// Sidebar renders navigation links using <NavLink> from react-router-dom.
//
// NavLink vs Link:
//   - <Link> renders a plain anchor for client-side navigation.
//   - <NavLink> does everything <Link> does AND provides an isActive render
//     prop so we can apply active styles to the current route.
//
// The `end` prop forces exact matching — without it, the /projects link would
// appear active for all sub-routes like /projects/proj-1.

interface SidebarProps {
  navItems: NavItem[];
}

export function Sidebar({ navItems }: SidebarProps) {
  return (
    <aside className="app-sidebar">
      <nav aria-label="Sidebar navigation">
        <ul className="sidebar-nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav-link${isActive ? ' sidebar-nav-link--active' : ''}`
                }
                end
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
