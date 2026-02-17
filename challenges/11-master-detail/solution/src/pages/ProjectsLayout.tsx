import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ProjectListItem } from '../components/ProjectListItem'
import { INITIAL_PROJECTS } from '../data/projects'

// ProjectsLayout is the master-detail container.
//
// Structure:
//   <aside class="master-list">   — left column, always visible, scrollable
//     list of ProjectListItem rows
//   <section class="detail-panel"> — right column
//     <Outlet />                   — renders ProjectEmptyState, ProjectDetailPanel,
//                                    etc. depending on the current URL
//
// Why a layout route (Outlet) instead of conditional rendering?
//   Using a nested route with <Outlet /> means:
//   - The master list never unmounts when the selection changes — scroll
//     position is preserved.
//   - The URL is the single source of truth for which project is selected.
//   - Deep-linking (/projects/proj-2) works without any lifting of state.
//
// The project list is derived from the same INITIAL_PROJECTS constant used
// throughout the app.  In Challenge 12 (Context) this will come from a
// shared store so newly created projects appear immediately.

export function ProjectsLayout() {
  return (
    <div className="projects-layout">
      {/* ---- Master list (left panel) ---- */}
      <aside className="master-list" aria-label="Project list">
        <div className="master-list__header">
          <span className="master-list__title">Projects</span>
          <Link to="/projects/new" className="master-list__new-link">
            + New
          </Link>
        </div>

        <ul>
          {INITIAL_PROJECTS.map((project) => (
            <li key={project.id}>
              {/* ProjectListItem reads useParams to determine if it is selected */}
              <ProjectListItem
                id={project.id}
                name={project.name}
                status={project.status}
                taskCount={project.taskCount}
              />
            </li>
          ))}
        </ul>
      </aside>

      {/* ---- Detail panel (right panel) ---- */}
      {/* <Outlet /> renders:
            - ProjectEmptyState when URL is /projects (no project selected)
            - ProjectDetailPanel when URL is /projects/:projectId
            - (ProjectDetailPanel's own Outlet handles task routes) */}
      <section className="detail-panel" aria-label="Project detail">
        <Outlet />
      </section>
    </div>
  )
}

export default ProjectsLayout
