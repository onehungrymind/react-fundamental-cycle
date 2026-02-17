import { useParams, useOutletContext } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { AddTaskForm } from './AddTaskForm'
import type { Task } from '../types'
import type { ProjectDetailOutletContext } from '../pages/ProjectDetailPanel'

// TaskList reads tasks from the parent Outlet context (set by ProjectDetailPanel).
// No local state or useReducer needed — mutations update the TanStack Query cache,
// which causes ProjectDetailPanel to re-render via useProject, which updates the
// Outlet context that TaskList reads.
//
// Data flow:
//   useProject cache → ProjectDetailPanel → Outlet context → TaskList → TaskItem
//   useMutation → queryClient.setQueryData → cache update → re-render chain above

interface TaskListProps {
  initialTasks?: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { projectId } = useParams<{ projectId: string }>();

  const ctx = useOutletContext<ProjectDetailOutletContext | undefined>();
  const tasks = initialTasks ?? ctx?.tasks ?? [];

  return (
    <div className="task-list">
      <h3 className="task-list__heading">Tasks</h3>

      {tasks.length === 0 ? (
        <p className="task-list__empty">No tasks for this project yet.</p>
      ) : (
        <ul className="task-list__items">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskItem
                task={task}
                projectId={projectId ?? ''}
              />
            </li>
          ))}
        </ul>
      )}

      <AddTaskForm projectId={projectId ?? ''} />
    </div>
  )
}

export default TaskList
