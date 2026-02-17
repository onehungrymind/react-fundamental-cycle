import { useParams } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { TASKS } from '../data/tasks'

// TaskList renders all tasks that belong to the currently selected project.
//
// It is the index child of the :projectId route, so it renders inside
// ProjectDetailPanel's <Outlet /> when the URL is /projects/:projectId (with
// no further segments).
//
// useParams reads :projectId from the closest ancestor route — in this case
// the /projects/:projectId route that wraps ProjectDetailPanel.
//
// Tasks are filtered from the hardcoded TASKS array.  In a later challenge
// this will come from an API call.

export function TaskList() {
  const { projectId } = useParams<{ projectId: string }>();

  // projectId should always be defined here because TaskList is only ever
  // rendered inside the :projectId route, but we check to satisfy TypeScript.
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
              {/* Pass projectId down so TaskItem can build the correct URL */}
              <TaskItem task={task} projectId={projectId ?? ''} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TaskList
