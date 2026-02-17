// Challenge 24 — Accessibility Fundamentals
//
// SOLUTION VERSION — all accessibility issues fixed:
//
//   1. <nav> has aria-label="Main navigation" so screen readers
//      announce the landmark distinctly.
//   2. React Router v7's NavLink sets aria-current="page"
//      automatically on the active link. The `end` prop is
//      configured correctly per route so it fires at the right URL.

import { NavLink } from 'react-router-dom'
import type { NavItem } from '../types'

interface SidebarProps {
  navItems: NavItem[];
  isCollapsed: boolean;
}

export function Sidebar({ navItems, isCollapsed }: SidebarProps) {
  return (
    <aside className={`app-sidebar${isCollapsed ? ' app-sidebar--collapsed' : ''}`}>
      {/* FIX: aria-label identifies this nav landmark */}
      <nav aria-label="Main navigation">
        <ul className="sidebar-nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              {/* FIX: React Router v7 NavLink sets aria-current="page"
                  automatically on the active route. The `end` prop
                  ensures "/" only matches the exact home route. */}
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
