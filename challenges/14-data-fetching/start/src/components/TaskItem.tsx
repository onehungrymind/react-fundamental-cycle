import type React from 'react'
import { Link } from 'react-router-dom'
import type { Task } from '../types'
import type { TaskAction } from '../reducers/taskReducer'
import { ASSIGNEE_NAMES } from '../data/tasks'
import { TaskStatusButton } from './TaskStatusButton'
import { TaskAssignment } from './TaskAssignment'

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
        <TaskStatusButton task={task} dispatch={dispatch} />
        <TaskAssignment task={task} dispatch={dispatch} />
      </div>
    </div>
  )
}

export default TaskItem
