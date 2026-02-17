import { NavLink } from 'react-router-dom'
import type { NavItem } from '../types'

interface SidebarProps {
  navItems: NavItem[];
  isCollapsed: boolean;
}

export function Sidebar({ navItems, isCollapsed }: SidebarProps) {
  return (
    <aside className={`app-sidebar${isCollapsed ? ' app-sidebar--collapsed' : ''}`}>
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
                title={isCollapsed ? item.label : undefined}
                aria-label={isCollapsed ? item.label : undefined}
              >
                {item.icon !== undefined ? (
                  <span className="sidebar-nav-link__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                ) : null}
                {!isCollapsed && (
                  <span className="sidebar-nav-link__label">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
