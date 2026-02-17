import { NavLink } from 'react-router-dom'
import type { NavItem } from '../types'

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
