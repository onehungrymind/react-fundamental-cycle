import type { NavItem } from '../types'

// TODO (Challenge 10, Task 5): Replace the <a> tags with <Link> from
// react-router-dom.  Update item.path values to be real routes:
//   /projects  (Dashboard)
//   /projects  (Projects)
//   /team      (Team — will show 404)
//
// Use useLocation() or NavLink to apply the .sidebar-nav-link--active class
// when the current URL matches the link's path.

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
              {/* TODO: Replace <a> with <Link to={item.path}> from react-router-dom */}
              <a href={item.path} className="sidebar-nav-link">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
