import { useParams, Outlet } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { INITIAL_PROJECTS } from '../data/projects'

export function ProjectDetailPanel() {
  const { projectId } = useParams<{ projectId: string }>();

  if (projectId === undefined) {
    return (
      <div className="project-detail-panel">
        <p>Invalid URL: missing project ID.</p>
      </div>
    );
  }

  const project = INITIAL_PROJECTS.find((p) => p.id === projectId);

  if (project === undefined) {
    return (
      <div className="project-detail-panel">
        <p>No project found with ID: <code>{projectId}</code></p>
      </div>
    );
  }

  return <ProjectDetailContent projectId={projectId} />;
}

interface ProjectDetailContentProps {
  projectId: string;
}

function ProjectDetailContent({ projectId }: ProjectDetailContentProps) {
  const project = INITIAL_PROJECTS.find((p) => p.id === projectId)!;

  useDocumentTitle(`${project.name} | TaskFlow`);

  const isOverdue =
    project.dueDate !== undefined && new Date(project.dueDate) < new Date();

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

      <Outlet />
    </div>
  )
}

export default ProjectDetailPanel
