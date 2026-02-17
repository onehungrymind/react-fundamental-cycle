import { Card } from './Card'
import type { ProjectCardProps } from '../types'

// TODO (Challenge 10, Task 6): Make ProjectCard navigable.
// When the user clicks the card, navigate to /projects/{id}.
// Options:
//   a) Wrap the entire Card in <Link to={`/projects/${id}`}> from react-router-dom
//      and style it so the link fills the card area (display: contents or block).
//   b) Use useNavigate() from react-router-dom inside an onClick handler.
//
// Don't forget to add `id` to the destructured props.

export function ProjectCard({
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
    <Card footer={metaFooter}>
      <div className="project-card__title-row">
        <h3 className="project-card__name">{name}</h3>
        <span className={`status-badge status-badge--${status}`}>{status}</span>
      </div>
      <p className="project-card__description">{description}</p>
    </Card>
  )
}

export default ProjectCard
