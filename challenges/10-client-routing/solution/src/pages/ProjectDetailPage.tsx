import { useParams, Link } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { INITIAL_PROJECTS } from '../data/projects'
import type { ProjectCardProps } from '../types'

// ProjectDetailPage reads the :projectId param from the URL and renders a
// detail view for the matching project.
//
// useParams<{ projectId: string }>() tells TypeScript the shape of the params
// object, but the values are still string | undefined at runtime.  React Router
// only guarantees the key exists when the route that defines it is matched — but
// TypeScript can't verify that statically, so it widens to undefined.
//
// Two undefined cases to handle:
//   1. projectId is undefined — component rendered outside a matching route.
//      In practice this should not happen with our route config, but TypeScript
//      requires the check.
//   2. The project with that ID does not exist — the URL was typed manually or
//      the project was deleted (not possible in this challenge, but good practice).
//
// This page reads from the INITIAL_PROJECTS constant directly.  Projects added
// via NewProjectPage do not appear here yet — they are in a separate useState
// in ProjectListPage.  Challenge 11 (Context) fixes this.

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();

  // Case 1: projectId param is missing entirely.
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

  // Search the shared project list by ID.
  const project = INITIAL_PROJECTS.find((p) => p.id === projectId);

  // Case 2: no project with this ID exists.
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

  // Happy path: render the project detail.
  // ProjectDetail is a separate inner component so useDocumentTitle can be
  // called unconditionally inside it (after confirming the project exists here).
  return <ProjectDetail project={project} />;
}

// ----- ProjectDetail (inner component) -----
// Hooks must be called at the top level of a component, unconditionally.
// We cannot call useDocumentTitle before the undefined checks above, so the
// rendering of the actual project content is delegated to this sub-component
// where the project is guaranteed to be defined.

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

      {/* Project metadata */}
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

      {/* Placeholder task list — populated in a future challenge */}
      <div className="project-detail__tasks-section">
        <h3 className="project-detail__tasks-heading">Tasks</h3>
        <p className="empty-state" style={{ paddingTop: '1rem' }}>
          Task management coming in a future challenge.
        </p>
      </div>
    </PageLayout>
  );
}

export default ProjectDetailPage
