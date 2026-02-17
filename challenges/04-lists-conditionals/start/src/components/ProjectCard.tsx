import type { ProjectCardProps } from '../types'

export function ProjectCard({
  name,
  description,
  status,
  taskCount,
  dueDate,
}: ProjectCardProps) {
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
        {/* TODO: Add an "⚠ Overdue" indicator here when dueDate is in the past.
            Hint: derive a boolean — const isOverdue = dueDate !== undefined && new Date(dueDate) < new Date();
            Then use: {isOverdue && <span className="project-card__overdue">⚠ Overdue</span>} */}
      </div>
    </article>
  )
}

export default ProjectCard
