import type { Task, TaskStatus } from '../types'
import { useUpdateTask } from '../hooks/mutations/useUpdateTask'

// TaskStatusButton calls useUpdateTask directly.
// It needs the projectId to know which cache entry to update.

interface TaskStatusButtonProps {
  task: Task;
  projectId: string;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  Todo:       'To Do',
  InProgress: 'In Progress',
  InReview:   'In Review',
  Done:       'Done',
}

// Valid status transitions — same state machine as the old reducer
const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo:       ['InProgress'],
  InProgress: ['InReview'],
  InReview:   ['Done', 'InProgress'],
  Done:       [],
}

export function TaskStatusButton({ task, projectId }: TaskStatusButtonProps) {
  const updateTask = useUpdateTask(projectId);
  const nextStatuses = VALID_TRANSITIONS[task.status];

  if (nextStatuses.length === 0) {
    return null;
  }

  function handleClick(newStatus: TaskStatus) {
    const completedAt = newStatus === 'Done' ? new Date().toISOString() : undefined;
    updateTask.mutate({
      taskId: task.id,
      data: { status: newStatus, completedAt },
    });
  }

  return (
    <>
      {nextStatuses.map((newStatus) => (
        <button
          key={newStatus}
          type="button"
          className="task-status-button"
          onClick={() => handleClick(newStatus)}
          disabled={updateTask.isPending}
          title={`Move to ${STATUS_LABELS[newStatus]}`}
        >
          <span className="task-status-button__arrow">&#8594;</span>
          {STATUS_LABELS[newStatus]}
        </button>
      ))}
    </>
  )
}

export default TaskStatusButton
