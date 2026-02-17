import { useParams, Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { TASKS, ASSIGNEE_NAMES } from '../data/tasks'

// TaskDetail renders in ProjectDetailPanel's <Outlet /> when the URL is
// /projects/:projectId/tasks/:taskId.
//
// It reads BOTH :projectId and :taskId from useParams.  Both params are
// available because TaskDetail is a descendant of routes that define them:
//   /projects/:projectId         (defines projectId)
//     /projects/:projectId/tasks/:taskId  (defines taskId)
//
// The "Back to tasks" link navigates to /projects/:projectId which renders
// the TaskList (index route) inside ProjectDetailPanel's Outlet.

export function TaskDetail() {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();

  // Both params should always be defined given the route config, but we
  // check to keep TypeScript happy and handle unexpected edge cases.
  if (projectId === undefined || taskId === undefined) {
    return (
      <div className="task-detail">
        <p>Invalid URL: missing project or task ID.</p>
      </div>
    );
  }

  const task = TASKS.find((t) => t.id === taskId && t.projectId === projectId);

  if (task === undefined) {
    return (
      <div className="task-detail">
        <Link to={`/projects/${projectId}`} className="task-detail__back">
          <span className="task-detail__back-arrow">&#8592;</span>
          Back to tasks
        </Link>
        <p>No task found with ID: <code>{taskId}</code></p>
      </div>
    );
  }

  // Delegate to inner component so useDocumentTitle is called unconditionally.
  return <TaskDetailContent projectId={projectId} taskId={taskId} />;
}

// ---- Inner component: guaranteed task ----

interface TaskDetailContentProps {
  projectId: string;
  taskId: string;
}

function TaskDetailContent({ projectId, taskId }: TaskDetailContentProps) {
  const task = TASKS.find((t) => t.id === taskId)!;
  const assigneeName =
    task.assigneeId !== undefined ? ASSIGNEE_NAMES[task.assigneeId] : undefined;

  useDocumentTitle(`${task.title} | TaskFlow`);

  return (
    <div className="task-detail">
      {/* "Back to tasks" navigates to the task list (index route) */}
      <Link to={`/projects/${projectId}`} className="task-detail__back">
        <span className="task-detail__back-arrow">&#8592;</span>
        Back to tasks
      </Link>

      <h3 className="task-detail__title">{task.title}</h3>
      <p className="task-detail__description">{task.description}</p>

      {/* Task metadata */}
      <div className="task-detail__meta">
        <div className="task-detail__meta-item">
          <span className="task-detail__meta-label">Status</span>
          <span className="task-detail__meta-value">
            <span className={`status-badge status-badge--${task.status}`}>
              {task.status}
            </span>
          </span>
        </div>

        {assigneeName !== undefined && (
          <div className="task-detail__meta-item">
            <span className="task-detail__meta-label">Assignee</span>
            <span className="task-detail__meta-value">{assigneeName}</span>
          </div>
        )}

        {task.dueDate !== undefined && (
          <div className="task-detail__meta-item">
            <span className="task-detail__meta-label">Due Date</span>
            <span className="task-detail__meta-value">{task.dueDate}</span>
          </div>
        )}

        {task.completedAt !== undefined && (
          <div className="task-detail__meta-item">
            <span className="task-detail__meta-label">Completed</span>
            <span className="task-detail__meta-value">
              {new Date(task.completedAt).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="task-detail__meta-item">
          <span className="task-detail__meta-label">Created</span>
          <span className="task-detail__meta-value">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail
