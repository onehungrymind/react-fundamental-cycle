import { Link } from 'react-router-dom'
import { Card } from './Card'
import type { ProjectCardProps } from '../types'

// ProjectCard wraps the entire card in a <Link> so clicking anywhere on it
// navigates to the project detail page at /projects/:id.
//
// Using <Link> (not <a>) ensures React Router intercepts the click and performs
// client-side navigation — no page reload, no scroll position lost.
//
// The .project-card-link class resets anchor styles so the card looks the same
// as before.  display: block makes the link fill the card's bounding box so the
// entire surface is clickable.

export function ProjectCard({
  id,
  name,
  description,
  status,
  taskCount,
  dueDate,
}: ProjectCardProps) {
  const isOverdue = dueDate !== undefined && new Date(dueDate) < new Date();

  const metaFooter = (
    <div className="project-card__meta">
      <span className="project-card__tasks">{taskCount} tasks</span>
      {dueDate && (
        <span className="project-card__due">Due: {dueDate}</span>
      )}
      {isOverdue && (
        <span className="project-card__overdue">&#9888; Overdue</span>
      )}
    </div>
  );

  return (
    // Link wraps the entire Card so the whole surface is a navigation target.
    // text-decoration and color are reset via the .project-card-link class.
    <Link to={`/projects/${id}`} className="project-card-link">
      <Card footer={metaFooter}>
        <div className="project-card__title-row">
          <h3 className="project-card__name">{name}</h3>
          <span className={`status-badge status-badge--${status}`}>{status}</span>
        </div>
        <p className="project-card__description">{description}</p>
      </Card>
    </Link>
  )
}

export default ProjectCard
