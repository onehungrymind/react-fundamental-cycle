import { useReducer } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { AddTaskForm } from './AddTaskForm'
import { taskReducer } from '../reducers/taskReducer'
import type { Task } from '../types'
import type { ProjectDetailOutletContext } from '../pages/ProjectDetailPanel'

// TaskList reads fetched tasks from the parent route's Outlet context,
// then manages all writes locally with useReducer.
//
// TODO (Challenge 16):
//   1. Remove useReducer and taskReducer imports
//   2. Read tasks directly from outlet context (no local state copy needed —
//      mutations will update the TanStack Query cache which re-renders via context)
//   3. Pass mutation callbacks instead of dispatch to TaskItem and AddTaskForm

interface TaskListProps {
  initialTasks?: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { projectId } = useParams<{ projectId: string }>();

  // Read tasks from the parent Outlet context (set by ProjectDetailPanel).
  const ctx = useOutletContext<ProjectDetailOutletContext | undefined>();
  const seedTasks = initialTasks ?? ctx?.tasks ?? [];

  // TODO: Replace useReducer with TanStack Query mutation hooks
  const [tasks, dispatch] = useReducer(taskReducer, seedTasks);

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
                dispatch={dispatch}
              />
            </li>
          ))}
        </ul>
      )}

      {/* TODO: Replace dispatch prop with mutation callback */}
      <AddTaskForm dispatch={dispatch} projectId={projectId ?? ''} />
    </div>
  )
}

export default TaskList
