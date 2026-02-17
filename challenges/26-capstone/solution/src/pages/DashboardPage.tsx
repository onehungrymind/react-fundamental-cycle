// Challenge 26 — Capstone: Feature 2 — Project Dashboard
//
// Lazy-loaded page that shows a summary of all projects.
// Stats are derived from the TanStack Query cache (no extra API calls).
// Recently viewed projects come from Redux state.

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProjects } from '../hooks/queries/useProjects'
import { useAppSelector } from '../store/redux/hooks'
import { StatCard } from '../components/StatCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'

export function DashboardPage() {
  useDocumentTitle('Dashboard | TaskFlow')

  const { data: projects = [], isPending, error, refetch } = useProjects()
  const recentlyViewedIds = useAppSelector((s) => s.recentlyViewed.projectIds)

  // Derive counts from cached data — no extra network requests
  const stats = useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === 'active').length,
      completed: projects.filter((p) => p.status === 'completed').length,
      archived: projects.filter((p) => p.status === 'archived').length,
      totalTasks: projects.reduce((sum, p) => sum + p.taskCount, 0),
      overdue: projects.filter(
        (p) =>
          p.status === 'active' &&
          p.dueDate !== undefined &&
          new Date(p.dueDate) < new Date(),
      ).length,
    }
  }, [projects])

  // Match recently viewed IDs to project objects (preserving order)
  const recentlyViewed = useMemo(
    () =>
      recentlyViewedIds
        .map((id) => projects.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => p !== undefined),
    [recentlyViewedIds, projects],
  )

  if (isPending) {
    return (
      <div className="page-layout">
        <LoadingSpinner label="Loading dashboard..." />
      </div>
    )
  }

  if (error !== null) {
    return (
      <div className="page-layout">
        <ErrorMessage message={error.message} onRetry={() => void refetch()} />
      </div>
    )
  }

  return (
    <div className="page-layout">
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
      </div>
      <p className="page-description">
        Overview of all your projects and tasks.
      </p>

      {/* Stats grid */}
      <section aria-label="Project statistics">
        <h3 className="dashboard-section-title">Projects</h3>
        <div className="dashboard-stats">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Active" value={stats.active} accent />
          <StatCard label="Completed" value={stats.completed} />
          <StatCard label="Archived" value={stats.archived} />
        </div>
      </section>

      <section aria-label="Task statistics" style={{ marginTop: '2rem' }}>
        <h3 className="dashboard-section-title">Tasks</h3>
        <div className="dashboard-stats">
          <StatCard label="Total Tasks" value={stats.totalTasks} />
          <StatCard label="Overdue Projects" value={stats.overdue} />
        </div>
      </section>

      {/* Recently viewed */}
      <section
        aria-label="Recently viewed projects"
        style={{ marginTop: '2rem' }}
      >
        <h3 className="dashboard-section-title">Recently Viewed</h3>
        {recentlyViewed.length === 0 ? (
          <p className="dashboard-empty">
            No recently viewed projects. Open a project from the sidebar to see
            it here.
          </p>
        ) : (
          <ul className="dashboard-recent-list">
            {recentlyViewed.map((project) => (
              <li key={project.id} className="dashboard-recent-item">
                <Link
                  to={`/projects/${project.id}`}
                  className="dashboard-recent-link"
                >
                  <div className="dashboard-recent-info">
                    <span className="dashboard-recent-name">{project.name}</span>
                    <span
                      className={`status-badge status-badge--${project.status}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <span className="dashboard-recent-meta">
                    {project.taskCount} task{project.taskCount !== 1 ? 's' : ''}
                    {project.dueDate !== undefined && (
                      <>
                        {' '}
                        &middot; Due{' '}
                        {new Date(project.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* All projects table */}
      <section aria-label="All projects" style={{ marginTop: '2rem' }}>
        <h3 className="dashboard-section-title">All Projects</h3>
        {projects.length === 0 ? (
          <p className="dashboard-empty">
            No projects yet.{' '}
            <Link to="/projects/new">Create your first project</Link>.
          </p>
        ) : (
          <ul className="dashboard-project-list">
            {projects.map((project) => (
              <li key={project.id} className="dashboard-project-item">
                <Link
                  to={`/projects/${project.id}`}
                  className="dashboard-project-link"
                >
                  <span className="dashboard-project-name">{project.name}</span>
                  <span
                    className={`status-badge status-badge--${project.status}`}
                  >
                    {project.status}
                  </span>
                  <span className="dashboard-project-tasks">
                    {project.taskCount} task{project.taskCount !== 1 ? 's' : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default DashboardPage
