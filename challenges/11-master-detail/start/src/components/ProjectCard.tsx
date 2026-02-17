import { Link } from 'react-router-dom'
import { Card } from './Card'
import type { ProjectCardProps } from '../types'

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
