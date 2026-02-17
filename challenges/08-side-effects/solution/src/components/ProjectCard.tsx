import { Card } from './Card'
import type { ProjectCardProps } from '../types'

// ProjectCard uses the generic Card component.
//
// Composition decisions:
//   - The card header slot (title prop on Card) cannot hold the status badge
//     alongside the title, so instead we render a custom title row in children
//     and leave Card's title prop unused.  The .card-body becomes our canvas.
//   - The meta row (task count, due date, overdue) goes into the footer slot
//     via Card's footer prop — it is visually separated with a top border.
//
// Result: ProjectCard contains zero card-frame markup; Card owns all of it.

export function ProjectCard({
  name,
  description,
  status,
  taskCount,
  dueDate,
}: ProjectCardProps) {
  // Derive overdue status from the dueDate prop — no extra state needed.
  const isOverdue = dueDate !== undefined && new Date(dueDate) < new Date();

  // The footer slot: task count, optional due date, optional overdue badge.
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
    // Card handles the border, border-radius, background, hover shadow.
    // No className needed here — the default .card styling is sufficient.
    <Card footer={metaFooter}>
      {/* Title row: project name + status badge side-by-side.
          We render this inside children (card-body) rather than using Card's
          title prop so we can place the badge next to the name. */}
      <div className="project-card__title-row">
        <h3 className="project-card__name">{name}</h3>
        <span className={`status-badge status-badge--${status}`}>{status}</span>
      </div>

      <p className="project-card__description">{description}</p>
    </Card>
  )
}

export default ProjectCard
