import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ProjectListItem } from '../components/ProjectListItem'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useFetch } from '../hooks/useFetch'
import type { Project } from '../types'

// ProjectsLayout fetches the project list from /api/projects.
//
// The master-list panel shows three states:
//   loading  — <LoadingSpinner />
//   error    — <ErrorMessage> with a Retry button
//   success  — list of <ProjectListItem> links
//
// The detail panel on the right is always rendered — it renders
// <ProjectEmptyState> (the index route) by default or the selected
// project's detail panel when a projectId is in the URL.

export function ProjectsLayout() {
  const { data: projects, isLoading, error, refetch } = useFetch<Project[]>('/api/projects');

  return (
    <div className="projects-layout">
      <aside className="master-list" aria-label="Project list">
        <div className="master-list__header">
          <span className="master-list__title">Projects</span>
          <Link to="/projects/new" className="master-list__new-link">
            + New
          </Link>
        </div>

        {isLoading && <LoadingSpinner label="Loading projects…" />}

        {!isLoading && error !== null && (
          <ErrorMessage message={error.message} onRetry={refetch} />
        )}

        {!isLoading && error === null && projects !== null && (
          <ul>
            {projects.map((project) => (
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
        )}
      </aside>

      <section className="detail-panel" aria-label="Project detail">
        <Outlet />
      </section>
    </div>
  )
}

export default ProjectsLayout
