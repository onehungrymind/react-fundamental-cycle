import { Link } from 'react-router-dom'
import type { Task } from '../types'
import { ASSIGNEE_NAMES } from '../data/tasks'

interface TaskItemProps {
  task: Task;
  projectId: string;
}

export function TaskItem({ task, projectId }: TaskItemProps) {
  const assigneeName =
    task.assigneeId !== undefined ? ASSIGNEE_NAMES[task.assigneeId] : undefined;

  return (
    <Link
      to={`/projects/${projectId}/tasks/${task.id}`}
      className="task-item"
    >
      <span className="task-item__title">{task.title}</span>
      <span className={`status-badge status-badge--${task.status}`}>
        {task.status}
      </span>
      {assigneeName !== undefined && (
        <span className="task-item__assignee">{assigneeName}</span>
      )}
    </Link>
  )
}

export default TaskItem
