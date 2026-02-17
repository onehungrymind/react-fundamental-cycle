import { useParams, Outlet } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProject } from '../hooks/queries/useProject'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import type { Task } from '../types'
import type { ProjectWithTasks } from '../api/projects'

// ProjectDetailPanel fetches a single project (with its tasks) via TanStack Query.
//
// Changes from Challenge 14:
//   - useFetch<ProjectWithTasks> replaced by useProject(projectId)
//   - isLoading → isPending
//   - data is undefined (not null) when no cache entry exists
//   - error is typed as Error | null
//
// Caching behaviour:
//   First visit to proj-1   → isPending: true → fetch fires → data cached
//   Navigate to proj-2      → proj-2 fetches, proj-1 stays in cache (gcTime)
//   Navigate back to proj-1 → isPending: false → instant render from cache
//
// Outlet context:
//   The fetched tasks array is passed to child routes via Outlet context so
//   that TaskList can receive them via useOutletContext.

export type ProjectDetailOutletContext = {
  tasks: Task[];
};

export function ProjectDetailPanel() {
  const { projectId } = useParams<{ projectId: string }>();

  // useProject handles the empty string guard via the `enabled` option —
  // if projectId is undefined we pass '' which prevents the fetch.
  const { data: project, isPending, error, refetch } = useProject(projectId ?? '')

  if (projectId === undefined) {
    return (
      <div className="project-detail-panel">
        <p>Invalid URL: missing project ID.</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="project-detail-panel">
        <LoadingSpinner label="Loading project..." />
      </div>
    );
  }

  if (error !== null) {
    return (
      <div className="project-detail-panel">
        <ErrorMessage message={error.message} onRetry={() => void refetch()} />
      </div>
    );
  }

  if (project === undefined) {
    return null;
  }

  return <ProjectDetailContent project={project} />;
}

interface ProjectDetailContentProps {
  project: ProjectWithTasks;
}

function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  useDocumentTitle(`${project.name} | TaskFlow`);

  const isOverdue =
    project.dueDate !== undefined && new Date(project.dueDate) < new Date();

  const outletContext: ProjectDetailOutletContext = { tasks: project.tasks };

  return (
    <div className="project-detail-panel">
      <header className="project-detail-panel__header">
        <h2 className="project-detail-panel__title">{project.name}</h2>
        <p className="project-detail-panel__description">{project.description}</p>

        <div className="project-detail-panel__meta">
          <div className="project-detail-panel__meta-item">
            <span className="project-detail-panel__meta-label">Status</span>
            <span className="project-detail-panel__meta-value">
              <span className={`status-badge status-badge--${project.status}`}>
                {project.status}
              </span>
            </span>
          </div>

          <div className="project-detail-panel__meta-item">
            <span className="project-detail-panel__meta-label">Tasks</span>
            <span className="project-detail-panel__meta-value">
              {project.taskCount}
            </span>
          </div>

          {project.dueDate !== undefined && (
            <div className="project-detail-panel__meta-item">
              <span className="project-detail-panel__meta-label">Due Date</span>
              <span className="project-detail-panel__meta-value">
                {project.dueDate}
                {isOverdue && (
                  <span className="project-detail-panel__overdue">
                    {' '}&#9888; Overdue
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Pass the fetched tasks to child routes via Outlet context.
          The index route TaskList reads them via useOutletContext.
          The tasks/:taskId route TaskDetail reads them the same way. */}
      <Outlet context={outletContext} />
    </div>
  )
}

export default ProjectDetailPanel
