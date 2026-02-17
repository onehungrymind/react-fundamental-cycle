import type React from 'react'
import { Link } from 'react-router-dom'
import type { Task } from '../types'
import type { TaskAction } from '../reducers/taskReducer'
import { TEAM_MEMBERS } from '../data/team'
import { TaskStatusButton } from './TaskStatusButton'
import { TaskAssignment } from './TaskAssignment'

interface TaskItemProps {
  task: Task;
  projectId: string;
  dispatch: React.Dispatch<TaskAction>;
}

export function TaskItem({ task, projectId, dispatch }: TaskItemProps) {
  // Look up name from hardcoded TEAM_MEMBERS (team data not yet fetched from API)
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
