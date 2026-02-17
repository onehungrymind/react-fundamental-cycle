import { useReducer } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { AddTaskForm } from './AddTaskForm'
import { taskReducer } from '../reducers/taskReducer'
import type { Task } from '../types'
import type { ProjectDetailOutletContext } from '../pages/ProjectDetailPanel'

// TaskList reads fetched tasks from the parent route's Outlet context.
//
// Challenge 14 change:
//   ProjectDetailPanel fetches the project (which includes its tasks) and
//   passes them down via <Outlet context={{ tasks }}>. TaskList reads them
//   with useOutletContext<ProjectDetailOutletContext>().
//
// This means TaskList no longer reads from the hardcoded TASKS array.
// It seeds its useReducer from the fetched tasks, then manages all further
// mutations locally (status updates, assignments, adding new tasks).
//
// The optional `initialTasks` prop is a fallback for contexts where there
// is no parent Outlet (e.g. when composed outside the router tree).

interface TaskListProps {
  initialTasks?: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { projectId } = useParams<{ projectId: string }>();

  // Read tasks from the parent Outlet context (set by ProjectDetailPanel).
  // If there is no outlet context the hook returns undefined.
  const ctx = useOutletContext<ProjectDetailOutletContext | undefined>();
  const seedTasks = initialTasks ?? ctx?.tasks ?? [];

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

      <AddTaskForm dispatch={dispatch} projectId={projectId ?? ''} />
    </div>
  )
}

export default TaskList
