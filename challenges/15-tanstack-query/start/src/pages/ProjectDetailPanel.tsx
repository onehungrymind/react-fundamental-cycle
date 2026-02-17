import { useParams, Outlet } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import type { Project, Task } from '../types'

// ProjectDetailPanel fetches a single project (with its tasks) from the API.
//
// TODO 1: Remove the useFetch import
// TODO 2: Import useProject from '../hooks/queries/useProject'
//         (you will create this file)
// TODO 3: Replace `useFetch<ProjectWithTasks>(...)` with `useProject(projectId ?? '')`
//         Note: TanStack Query uses `isPending` instead of `isLoading`.
//               The data from useProject is `ProjectWithTasks | undefined`
//               (not null), so guard conditions change slightly.

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

      <Outlet context={outletContext} />
    </div>
  )
}

export default ProjectDetailPanel
