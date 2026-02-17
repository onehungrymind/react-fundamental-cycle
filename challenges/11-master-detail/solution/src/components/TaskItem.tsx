import { Link } from 'react-router-dom'
import type { Task } from '../types'
import { ASSIGNEE_NAMES } from '../data/tasks'

// TaskItem renders a single compact task row inside the task list.
//
// Each task is wrapped in a <Link> that navigates to the task detail route:
//   /projects/:projectId/tasks/:taskId
//
// The `projectId` must be passed as a prop because TaskItem itself is not
// inside the :projectId route's param scope at render time — the parent
// TaskList reads projectId from useParams and passes it down.

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
