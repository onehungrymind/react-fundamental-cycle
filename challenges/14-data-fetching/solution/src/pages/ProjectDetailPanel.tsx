import { useParams, Outlet } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import type { Project, Task } from '../types'

// ProjectDetailPanel fetches a single project (with its tasks) from the API.
//
// The API response for GET /api/projects/:id includes the tasks array:
//   { ...project, tasks: Task[] }
//
// We call useFetch at the top level of the component (before any conditional
// returns) because hooks cannot be called inside conditions.
//
// Outlet context:
//   The fetched tasks array is passed to child routes via Outlet context so
//   that TaskList can receive them via useOutletContext.

export type ProjectDetailOutletContext = {
  tasks: Task[];
};

type ProjectWithTasks = Project & { tasks: Task[] };

export function ProjectDetailPanel() {
  const { projectId } = useParams<{ projectId: string }>();

  // Hook must be called unconditionally — we guard the actual URL with the
  // fallback empty string (which produces a 404 from the API handler,
  // triggering the error state).
  const { data: project, isLoading, error, refetch } =
    useFetch<ProjectWithTasks>(`/api/projects/${projectId ?? ''}`);

  if (projectId === undefined) {
    return (
      <div className="project-detail-panel">
        <p>Invalid URL: missing project ID.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="project-detail-panel">
        <LoadingSpinner label="Loading project..." />
      </div>
    );
  }

  if (error !== null) {
    return (
      <div className="project-detail-panel">
        <ErrorMessage message={error.message} onRetry={refetch} />
      </div>
    );
  }

  if (project === null) {
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
