import { Link, useParams } from 'react-router-dom'
import type { ProjectStatus } from '../types'

// ProjectListItem now accepts Project fields directly instead of ProjectCardProps,
// since the data comes from the API response which uses the Project type.

interface ProjectListItemProps {
  id: string;
  name: string;
  status: ProjectStatus;
  taskCount: number;
}

export function ProjectListItem({ id, name, status, taskCount }: ProjectListItemProps) {
  const { projectId } = useParams<{ projectId?: string }>();

  const isSelected = projectId === id;

  return (
    <Link
      to={`/projects/${id}`}
      className={`project-list-item${isSelected ? ' project-list-item--selected' : ''}`}
      aria-current={isSelected ? 'page' : undefined}
    >
      <div className="project-list-item__info">
        <p className="project-list-item__name">{name}</p>
        <div className="project-list-item__meta">
          <span className={`status-badge status-badge--${status}`}>{status}</span>
          <span className="project-list-item__task-count">{taskCount} tasks</span>
        </div>
      </div>
    </Link>
  )
}

export default ProjectListItem
