import { Link, useParams } from 'react-router-dom'
import type { ProjectCardProps } from '../types'

// ProjectListItem is the compact row displayed in the master list.
//
// It renders the project name, a status badge, and the task count.
// It highlights itself (adds --selected modifier class) when the project ID
// in the URL matches its own `id` prop.
//
// Why useParams instead of NavLink's isActive?
//   We use a <Link> (not a <NavLink>) so we can wrap the entire row element
//   as a link without losing control over the inner structure.  Reading
//   `projectId` from useParams lets us derive the selected state ourselves.
//
// Note: useParams<{ projectId?: string }> uses an optional type because this
// component can technically render inside ProjectsLayout even when the index
// route is active (no :projectId in the URL).

type ProjectListItemProps = Pick<ProjectCardProps, 'id' | 'name' | 'status' | 'taskCount'>;

export function ProjectListItem({ id, name, status, taskCount }: ProjectListItemProps) {
  // Read the current projectId from the URL.  It will be undefined when the
  // user is at /projects (the index route / empty state).
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
