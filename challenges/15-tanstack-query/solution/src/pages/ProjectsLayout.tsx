import { Outlet, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ProjectListItem } from '../components/ProjectListItem'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useProjects } from '../hooks/queries/useProjects'

// ProjectsLayout fetches the project list via TanStack Query.
//
// Changes from Challenge 14:
//   - useFetch<Project[]> replaced by useProjects()
//   - isLoading → isPending (TanStack Query naming)
//   - data is undefined (not null) when no data exists yet
//   - Added "Refresh" button that invalidates all project queries
//
// Caching behaviour:
//   First visit   → isPending: true → fetch fires → data cached
//   Second visit  → isPending: false → instant render from cache
//   After 30s     → data is "stale" → background refetch on remount
//   Refresh click → all ["projects"] queries invalidated → refetch

export function ProjectsLayout() {
  const { data: projects, isPending, error, refetch } = useProjects()
  const queryClient = useQueryClient()

  function handleRefresh() {
    // invalidateQueries marks ALL queries whose key starts with ["projects"]
    // as stale, including individual project detail queries.  The next
    // component render with a matching query will trigger a background refetch.
    void queryClient.invalidateQueries({ queryKey: ['projects'] })
  }

  return (
    <div className="projects-layout">
      <aside className="master-list" aria-label="Project list">
        <div className="master-list__header">
          <span className="master-list__title">Projects</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleRefresh}
              className="master-list__new-link"
              title="Refresh project list"
              aria-label="Refresh project list"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              &#8635; Refresh
            </button>
            <Link to="/projects/new" className="master-list__new-link">
              + New
            </Link>
          </div>
        </div>

        {isPending && <LoadingSpinner label="Loading projects…" />}

        {!isPending && error !== null && (
          <ErrorMessage message={error.message} onRetry={() => void refetch()} />
        )}

        {!isPending && error === null && projects !== undefined && (
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
