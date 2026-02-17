// TODO: Import NavItem from '../types', define SidebarProps,
//       then replace the hardcoded <li> elements with a .map() over navItems.

export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav aria-label="Sidebar navigation">
        <ul className="sidebar-nav-list">
          <li>
            <a href="#dashboard" className="sidebar-nav-link sidebar-nav-link--active">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#projects" className="sidebar-nav-link">
              Projects
            </a>
          </li>
          <li>
            <a href="#team" className="sidebar-nav-link">
              Team
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
