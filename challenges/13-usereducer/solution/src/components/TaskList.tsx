import { useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { AddTaskForm } from './AddTaskForm'
import { taskReducer } from '../reducers/taskReducer'
import { TASKS } from '../data/tasks'

// TaskList owns the task state for the current project via useReducer.
//
// Challenge 13 changes vs Challenge 12:
//
//   - The static `TASKS` array is now only used as the *initial* state for
//     useReducer.  After mount, all mutations go through `dispatch`.
//
//   - `dispatch` is a stable reference (guaranteed by React) — it's safe
//     to pass as a prop without wrapping in useCallback or useMemo.
//
//   - AddTaskForm is rendered below the list so users can add new tasks.
//     It receives dispatch and projectId.
//
// Note: because each project's task list is mounted independently (route
// changes unmount/remount the component), state resets when you navigate
// away. A later challenge could hoist state into a TasksContext to persist
// it across route changes.

export function TaskList() {
  const { projectId } = useParams<{ projectId: string }>();

  // Derive the initial task slice for this project from the static data.
  // After this point, all updates go through dispatch.
  const initialTasks = projectId !== undefined
    ? TASKS.filter((t) => t.projectId === projectId)
    : [];

  // useReducer returns [state, dispatch].
  // dispatch is guaranteed stable across renders — no need for useCallback.
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

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

      {/* AddTaskForm dispatches ADD_TASK; ID and createdAt generated there */}
      <AddTaskForm dispatch={dispatch} projectId={projectId ?? ''} />
    </div>
  )
}

export default TaskList
