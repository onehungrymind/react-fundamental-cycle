import type React from 'react'
import { Link } from 'react-router-dom'
import type { Task } from '../types'
import type { TaskAction } from '../reducers/taskReducer'
import { TEAM_MEMBERS } from '../data/team'
import { TaskStatusButton } from './TaskStatusButton'
import { TaskAssignment } from './TaskAssignment'

// TODO (Challenge 16):
//   - Replace dispatch prop with mutation callback props:
//       onStatusUpdate: (taskId: string, newStatus: TaskStatus) => void
//       onAssign: (taskId: string, assigneeId: string | undefined) => void
//       onDelete: (taskId: string) => void
//   - Add a delete button that calls onDelete
//   - Show task-item--optimistic class when mutation is pending

interface TaskItemProps {
  task: Task;
  projectId: string;
  dispatch: React.Dispatch<TaskAction>;
}

export function TaskItem({ task, projectId, dispatch }: TaskItemProps) {
  const member = TEAM_MEMBERS.find((m) => m.id === task.assigneeId);

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
        {member !== undefined && (
          <span className="task-item__assignee">{member.name}</span>
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
