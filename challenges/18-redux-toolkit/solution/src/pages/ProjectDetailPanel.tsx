import { useEffect } from 'react'
import { useParams, Outlet } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProject } from '../hooks/queries/useProject'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAppDispatch } from '../store/redux/hooks'
import { addRecentlyViewed } from '../store/redux/recentlyViewedSlice'
import type { Task } from '../types'
import type { ProjectWithTasks } from '../api/projects'

// ProjectDetailPanel dispatches addRecentlyViewed(projectId) from the Redux
// store whenever a project is successfully loaded.  This keeps the
// recently-viewed list accurate without any prop-drilling.

export type ProjectDetailOutletContext = {
  tasks: Task[];
};

export function ProjectDetailPanel() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project, isPending, error, refetch } = useProject(projectId ?? '')

  const dispatch = useAppDispatch()

  // Track this project as recently viewed once the data has loaded
  useEffect(() => {
    if (projectId !== undefined && project !== undefined) {
      dispatch(addRecentlyViewed(projectId))
    }
  }, [projectId, project, dispatch])

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

      <Outlet context={outletContext} />
    </div>
  )
}

export default ProjectDetailPanel
