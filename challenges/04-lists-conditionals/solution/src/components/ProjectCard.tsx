import type { ProjectCardProps } from '../types'

export function ProjectCard({
  name,
  description,
  status,
  taskCount,
  dueDate,
}: ProjectCardProps) {
  // Derive overdue status from the dueDate prop — no extra state needed.
  // new Date(dueDate) parses ISO-8601 strings like "2024-12-01" correctly.
  // We check dueDate !== undefined before constructing a Date so TypeScript
  // is happy and we avoid calling new Date(undefined).
  const isOverdue = dueDate !== undefined && new Date(dueDate) < new Date();

  return (
    <article className="project-card">
      <div className="project-card__header">
        <h3 className="project-card__name">{name}</h3>
        <span className={`status-badge status-badge--${status}`}>{status}</span>
      </div>
      <p className="project-card__description">{description}</p>
      <div className="project-card__meta">
        <span className="project-card__tasks">{taskCount} tasks</span>
        {dueDate && (
          <span className="project-card__due">Due: {dueDate}</span>
        )}
        {isOverdue && (
          <span className="project-card__overdue">⚠ Overdue</span>
        )}
      </div>
    </article>
  )
}

export default ProjectCard
