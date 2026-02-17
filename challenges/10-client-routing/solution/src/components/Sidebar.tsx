import { NavLink } from 'react-router-dom'
import type { NavItem } from '../types'

// Sidebar renders the navigation links using <NavLink> from react-router-dom.
//
// NavLink vs Link:
//   - <Link> renders a plain anchor element that handles client-side navigation.
//   - <NavLink> does everything <Link> does AND calls a className function with
//     { isActive } so we can apply different styles to the currently active link.
//
// The className prop on <NavLink> accepts either a string or a function.
// When a function is passed, React Router calls it on every render with
// { isActive, isPending } so we can return different class names based on state.
//
// isActive is true when the URL matches the NavLink's `to` prop.
// By default NavLink uses partial matching (prefix match).  For the /projects
// link we use `end` to require an exact match so /projects/new does not also
// highlight the Projects link.

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
                // Apply the active class only when this link's path matches the
                // current URL (isActive from NavLink's render prop).
                className={({ isActive }) =>
                  `sidebar-nav-link${isActive ? ' sidebar-nav-link--active' : ''}`
                }
                // `end` forces exact matching — prevents /projects from matching
                // when the URL is /projects/new or /projects/some-id.
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
