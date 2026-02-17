import { useParams, Link } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { INITIAL_PROJECTS } from '../data/projects'
import type { ProjectCardProps } from '../types'

// ProjectDetailPage reads :projectId from the URL and renders a full-page
// detail view for the matching project.
//
// This is the STARTING POINT for Challenge 11.  Your task is to replace this
// full-page detail with a ProjectDetailPanel component that renders inside the
// right column of the master-detail layout (ProjectsLayout) and includes an
// <Outlet /> for TaskList and TaskDetail.
//
// See README.md for the complete list of tasks.

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();

  if (projectId === undefined) {
    return (
      <PageLayout title="Error">
        <p className="page-description">Invalid URL: missing project ID.</p>
        <Link to="/projects" className="btn-secondary">
          Back to Projects
        </Link>
      </PageLayout>
    );
  }

  const project = INITIAL_PROJECTS.find((p) => p.id === projectId);

  if (project === undefined) {
    return (
      <PageLayout title="Project Not Found">
        <p className="page-description">
          No project found with ID: <code>{projectId}</code>
        </p>
        <Link to="/projects" className="btn-secondary">
          Back to Projects
        </Link>
      </PageLayout>
    );
  }

  return <ProjectDetail project={project} />;
}

interface ProjectDetailProps {
  project: ProjectCardProps;
}

function ProjectDetail({ project }: ProjectDetailProps) {
  useDocumentTitle(`${project.name} | TaskFlow`);

  const isOverdue =
    project.dueDate !== undefined && new Date(project.dueDate) < new Date();

  const backLink = (
    <Link to="/projects" className="btn-secondary">
      Back to Projects
    </Link>
  );

  return (
    <PageLayout title={project.name} actions={backLink}>
      <p className="page-description">{project.description}</p>

      <div className="project-detail__meta">
        <div className="project-detail__meta-item">
          <span className="project-detail__meta-label">Status</span>
          <span className={`status-badge status-badge--${project.status}`}>
            {project.status}
          </span>
        </div>

        <div className="project-detail__meta-item">
          <span className="project-detail__meta-label">Tasks</span>
          <span className="project-detail__meta-value">{project.taskCount}</span>
        </div>

        {project.dueDate !== undefined && (
          <div className="project-detail__meta-item">
            <span className="project-detail__meta-label">Due Date</span>
            <span className="project-detail__meta-value">
              {project.dueDate}
              {isOverdue && (
                <span className="project-card__overdue" style={{ marginLeft: '0.5rem' }}>
                  &#9888; Overdue
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* TODO (Challenge 11): Replace this placeholder with a real TaskList
          component that reads tasks from src/data/tasks.ts */}
      <div className="project-detail__tasks-section">
        <h3 className="project-detail__tasks-heading">Tasks</h3>
        <p className="empty-state" style={{ paddingTop: '1rem' }}>
          Task list coming in Challenge 11 — implement TaskList here.
        </p>
      </div>
    </PageLayout>
  );
}

export default ProjectDetailPage
