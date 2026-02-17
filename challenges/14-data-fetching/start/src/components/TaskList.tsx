import { useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { AddTaskForm } from './AddTaskForm'
import { taskReducer } from '../reducers/taskReducer'
import { TASKS } from '../data/tasks'

// TaskList owns the task state for the current project via useReducer.
//
// Challenge 14 — TODO:
//
// After completing ProjectDetailPanel to fetch project data via useFetch,
// update this component to accept an optional `initialTasks` prop so it can
// receive fetched tasks instead of reading from the hardcoded TASKS array.
//
// Signature change:
//
//   interface TaskListProps {
//     initialTasks?: Task[];
//   }
//
//   export function TaskList({ initialTasks }: TaskListProps) {
//     ...
//     const projectTasks = initialTasks
//       ?? (projectId !== undefined ? TASKS.filter(...) : [])
//     ...
//   }
//
// Once ProjectDetailPanel passes fetched tasks, you can remove the
// TASKS import entirely.

export function TaskList() {
  const { projectId } = useParams<{ projectId: string }>();

  const initialTasks = projectId !== undefined
    ? TASKS.filter((t) => t.projectId === projectId)
    : [];

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

      <AddTaskForm dispatch={dispatch} projectId={projectId ?? ''} />
    </div>
  )
}

export default TaskList
