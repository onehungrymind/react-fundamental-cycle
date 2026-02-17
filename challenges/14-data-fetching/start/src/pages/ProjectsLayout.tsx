import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ProjectListItem } from '../components/ProjectListItem'
import { INITIAL_PROJECTS } from '../data/projects'

// Challenge 14 — TODO: Replace hardcoded data with a fetch call.
//
// Steps:
//   1. Import the `useFetch` hook from '../hooks/useFetch'
//   2. Import the `Project` type from '../types'
//   3. Import `LoadingSpinner` and `ErrorMessage` components
//   4. Replace `INITIAL_PROJECTS` with:
//
//        const { data: projects, isLoading, error, refetch } =
//          useFetch<Project[]>('/api/projects');
//
//   5. Render <LoadingSpinner /> while isLoading is true
//   6. Render <ErrorMessage message={error.message} onRetry={refetch} /> on error
//   7. Map over `projects` (which will be non-null when isLoading and error are
//      both falsy) — remember to handle the null case before mapping
//
// The master-list panel structure and ProjectListItem rendering stay the same —
// only the data source changes.

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
