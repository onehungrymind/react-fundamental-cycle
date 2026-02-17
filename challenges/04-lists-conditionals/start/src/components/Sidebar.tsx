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
