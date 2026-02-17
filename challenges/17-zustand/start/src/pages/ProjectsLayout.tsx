import { Outlet, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ProjectListItem } from '../components/ProjectListItem'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useProjects } from '../hooks/queries/useProjects'
import { useProjectFilters } from '../hooks/useProjectFilters'

// Challenge 17 — Zustand
//
// TODO: Replace the local filter state (useProjectFilters) with
//       useFilterPreferences() from src/store/selectors.ts so that
//       the active filter and sort order survive navigation.

export function ProjectsLayout() {
  const { data: projects = [], isPending, error, refetch } = useProjects()
  const queryClient = useQueryClient()

  // Filter state lives locally — it is lost when the user navigates away.
  const { filteredProjects, activeFilter, setFilter, statusCounts } =
    useProjectFilters(projects)

  function handleRefresh() {
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

        {/* Filter bar */}
        <div className="filter-bar" style={{ padding: '0.5rem 1.25rem 0' }}>
          {(['all', 'active', 'completed', 'archived'] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-btn${activeFilter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              {' '}
              <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>
                ({statusCounts[f]})
              </span>
            </button>
          ))}
        </div>

        {isPending && <LoadingSpinner label="Loading projects\u2026" />}

        {!isPending && error !== null && (
          <ErrorMessage message={error.message} onRetry={() => void refetch()} />
        )}

        {!isPending && error === null && (
          <ul>
            {filteredProjects.map((project) => (
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
