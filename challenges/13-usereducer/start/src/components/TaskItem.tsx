import { Link } from 'react-router-dom'
import type { Task } from '../types'
import { ASSIGNEE_NAMES } from '../data/tasks'

// TODO (Challenge 13):
//
// 1. Import TaskAction from '../reducers/taskReducer'
// 2. Import React.Dispatch from react
// 3. Add a `dispatch` prop: dispatch: React.Dispatch<TaskAction>
// 4. Import and render <TaskStatusButton task={task} dispatch={dispatch} />
// 5. Import and render <TaskAssignment task={task} dispatch={dispatch} />

interface TaskItemProps {
  task: Task;
  projectId: string;
  // TODO: add dispatch prop here
}

export function TaskItem({ task, projectId }: TaskItemProps) {
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
        {/* TODO: render TaskStatusButton here */}
        {/* TODO: render TaskAssignment here */}
      </div>
    </div>
  )
}

export default TaskItem
