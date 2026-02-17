import { useParams } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { TASKS } from '../data/tasks'

// TODO (Challenge 13):
//
// 1. Import useReducer from react
// 2. Import taskReducer from '../reducers/taskReducer'
// 3. Replace the static `projectTasks` slice with:
//
//    const projectTasks = TASKS.filter(t => t.projectId === projectId);
//    const [tasks, dispatch] = useReducer(taskReducer, projectTasks);
//
// 4. Pass `dispatch` down to <TaskItem> and <AddTaskForm>
// 5. Import and render <AddTaskForm> below the task list, passing
//    dispatch and projectId

export function TaskList() {
  const { projectId } = useParams<{ projectId: string }>();

  // Static tasks — replace with useReducer in Challenge 13
  const projectTasks = projectId !== undefined
    ? TASKS.filter((t) => t.projectId === projectId)
    : [];

  return (
    <div className="task-list">
      <h3 className="task-list__heading">Tasks</h3>

      {projectTasks.length === 0 ? (
        <p className="task-list__empty">No tasks for this project yet.</p>
      ) : (
        <ul className="task-list__items">
          {projectTasks.map((task) => (
            <li key={task.id}>
              {/* TODO: pass dispatch to TaskItem */}
              <TaskItem task={task} projectId={projectId ?? ''} />
            </li>
          ))}
        </ul>
      )}

      {/* TODO: render <AddTaskForm dispatch={dispatch} projectId={projectId ?? ''} /> here */}
    </div>
  )
}

export default TaskList
