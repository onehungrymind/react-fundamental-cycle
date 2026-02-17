import type React from 'react'
import { Link } from 'react-router-dom'
import type { Task } from '../types'
import type { TaskAction } from '../reducers/taskReducer'
import { ASSIGNEE_NAMES } from '../data/tasks'
import { TaskStatusButton } from './TaskStatusButton'
import { TaskAssignment } from './TaskAssignment'

// TaskItem renders a single task row.
//
// Challenge 13 changes vs Challenge 12:
//
//   - Now accepts a `dispatch` prop (React.Dispatch<TaskAction>)
//   - The title is still a link to the task detail page
//   - TaskStatusButton shows valid next-state buttons (driven by VALID_TRANSITIONS)
//   - TaskAssignment shows an assignee dropdown
//   - The component itself never calls dispatch — it delegates to its children

interface TaskItemProps {
  task: Task;
  projectId: string;
  dispatch: React.Dispatch<TaskAction>;
}

export function TaskItem({ task, projectId, dispatch }: TaskItemProps) {
  const assigneeName =
    task.assigneeId !== undefined ? ASSIGNEE_NAMES[task.assigneeId] : undefined;

  return (
    <div className="task-item">
      <div className="task-item__top">
        <Link
          to={`/projects/${projectId}/tasks/${task.id}`}
          className="task-item__title"
        >
          {task.title}
        </Link>
        <span className={`status-badge status-badge--${task.status}`}>
          {task.status}
        </span>
        {assigneeName !== undefined && (
          <span className="task-item__assignee">{assigneeName}</span>
        )}
      </div>

      <div className="task-item__actions">
        {/* Buttons for valid next statuses — dispatches UPDATE_STATUS */}
        <TaskStatusButton task={task} dispatch={dispatch} />

        {/* Assignee dropdown — dispatches ASSIGN_TASK / UNASSIGN_TASK */}
        <TaskAssignment task={task} dispatch={dispatch} />
      </div>
    </div>
  )
}

export default TaskItem
