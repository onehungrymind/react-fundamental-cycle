import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ProjectListItem } from '../components/ProjectListItem'
import { INITIAL_PROJECTS } from '../data/projects'

// ProjectsLayout is the master-detail container.
//
// Challenge 12 note: the project list still comes from the static
// INITIAL_PROJECTS constant. A future challenge (Context for data) would
// lift this into a ProjectsContext so newly created projects appear here.

export function ProjectsLayout() {
  return (
    <div className="projects-layout">
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

      <section className="detail-panel" aria-label="Project detail">
        <Outlet />
      </section>
    </div>
  )
}

export default ProjectsLayout
