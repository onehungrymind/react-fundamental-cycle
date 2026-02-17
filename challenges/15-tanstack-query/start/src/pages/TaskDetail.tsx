import { useParams, Link, useOutletContext } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { TEAM_MEMBERS } from '../data/team'
import type { Task } from '../types'
import type { ProjectDetailOutletContext } from './ProjectDetailPanel'

// TaskDetail reads the task from the parent Outlet context set by
// ProjectDetailPanel.  This means no additional fetch is needed —
// ProjectDetailPanel already fetched the project+tasks and passed them
// down via <Outlet context={{ tasks }}>.

export function TaskDetail() {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
  const ctx = useOutletContext<ProjectDetailOutletContext | undefined>();

  if (projectId === undefined || taskId === undefined) {
    return (
      <div className="task-detail">
        <p>Invalid URL: missing project or task ID.</p>
      </div>
    );
  }

  const task = ctx?.tasks.find((t) => t.id === taskId);

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

  return <TaskDetailContent projectId={projectId} task={task} />;
}

interface TaskDetailContentProps {
  projectId: string;
  task: Task;
}

function TaskDetailContent({ projectId, task }: TaskDetailContentProps) {
  const member = TEAM_MEMBERS.find((m) => m.id === task.assigneeId);

  useDocumentTitle(`${task.title} | TaskFlow`);

  return (
    <div className="task-detail">
      <Link to={`/projects/${projectId}`} className="task-detail__back">
        <span className="task-detail__back-arrow">&#8592;</span>
        Back to tasks
      </Link>

      <h3 className="task-detail__title">{task.title}</h3>
      <p className="task-detail__description">{task.description}</p>

      <div className="task-detail__meta">
        <div className="task-detail__meta-item">
          <span className="task-detail__meta-label">Status</span>
          <span className="task-detail__meta-value">
            <span className={`status-badge status-badge--${task.status}`}>
              {task.status}
            </span>
          </span>
        </div>

        {member !== undefined && (
          <div className="task-detail__meta-item">
            <span className="task-detail__meta-label">Assignee</span>
            <span className="task-detail__meta-value">{member.name}</span>
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
