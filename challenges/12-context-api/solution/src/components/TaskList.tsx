import { useParams } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { TASKS } from '../data/tasks'

export function TaskList() {
  const { projectId } = useParams<{ projectId: string }>();

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
              <TaskItem task={task} projectId={projectId ?? ''} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TaskList
