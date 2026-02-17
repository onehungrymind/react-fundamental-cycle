// Challenge 24 — Accessibility Fundamentals
//
// START VERSION — accessibility issue:
//
//   NavLink does NOT set aria-current="page" on the active item.
//   Screen readers cannot tell which nav item is the current page.
//
// Your task: add aria-current="page" to the active NavLink.
// React Router v7's NavLink sets this automatically — verify that
// the `end` prop is configured correctly so it fires for the right routes.

import { NavLink } from 'react-router-dom'
import type { NavItem } from '../types'

interface SidebarProps {
  navItems: NavItem[];
  isCollapsed: boolean;
}

export function Sidebar({ navItems, isCollapsed }: SidebarProps) {
  return (
    <aside className={`app-sidebar${isCollapsed ? ' app-sidebar--collapsed' : ''}`}>
      {/* BUG: The nav lacks aria-label="Main navigation" */}
      <nav>
        <ul className="sidebar-nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              {/* BUG: NavLink does not receive aria-current="page".
                  React Router v7 sets it automatically but only when
                  the `end` prop is correctly set and no explicit
                  aria-current override suppresses it. */}
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
