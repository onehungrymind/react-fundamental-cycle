import { Outlet, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ProjectListItem } from '../components/ProjectListItem'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useProjects } from '../hooks/queries/useProjects'
import { useAppSelector, useAppDispatch } from '../store/redux/hooks'
import { setStatusFilter, setSortOrder } from '../store/redux/filtersSlice'
import type { ProjectStatus } from '../types'

export function ProjectsLayout() {
  const { data: projects = [], isPending, error, refetch } = useProjects()
  const queryClient = useQueryClient()

  const statusFilter = useAppSelector((s) => s.filters.statusFilter)
  const sortOrder = useAppSelector((s) => s.filters.sortOrder)
  const dispatch = useAppDispatch()

  function handleRefresh() {
    void queryClient.invalidateQueries({ queryKey: ['projects'] })
  }

  const filtered =
    statusFilter === 'all'
      ? projects
      : projects.filter((p) => p.status === statusFilter)

  const sorted = [...filtered].sort((a, b) => {
    const cmp = a.name.localeCompare(b.name)
    return sortOrder === 'asc' ? cmp : -cmp
  })

  const statusCounts: Record<ProjectStatus | 'all', number> = {
    all: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    archived: projects.filter((p) => p.status === 'archived').length,
  }

  return (
    <div className="projects-layout">
      <ErrorBoundary>
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

          <div className="filter-bar" style={{ padding: '0.5rem 1.25rem 0' }}>
            {(['all', 'active', 'completed', 'archived'] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-btn${statusFilter === f ? ' active' : ''}`}
                onClick={() => dispatch(setStatusFilter(f))}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                {' '}
                <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>
                  ({statusCounts[f]})
                </span>
              </button>
            ))}
          </div>

          <div style={{ padding: '0.375rem 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sort:</span>
            <button
              type="button"
              className={`filter-btn${sortOrder === 'asc' ? ' active' : ''}`}
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => dispatch(setSortOrder('asc'))}
            >
              A &rarr; Z
            </button>
            <button
              type="button"
              className={`filter-btn${sortOrder === 'desc' ? ' active' : ''}`}
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => dispatch(setSortOrder('desc'))}
            >
              Z &rarr; A
            </button>
          </div>

          {isPending && <LoadingSpinner label="Loading projects\u2026" />}

          {!isPending && error !== null && (
            <ErrorMessage message={error.message} onRetry={() => void refetch()} />
          )}

          {!isPending && error === null && (
            <ul>
              {sorted.map((project) => (
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
      </ErrorBoundary>

      <section className="detail-panel" aria-label="Project detail">
        <Outlet />
      </section>
    </div>
  )
}

export default ProjectsLayout
