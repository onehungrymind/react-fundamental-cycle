import type { Task, TaskStatus } from '../types'

// Challenge 19 — Performance
//
// TaskStatusButton now receives `onStatusChange` as a prop rather than
// calling a mutation hook directly.  This is necessary for React.memo
// on TaskItem to work: mutation objects from useMutation can change
// identity between renders, but a stable useCallback reference won't.
//
// The parent (TaskList) calls useUpdateTask once and stabilises the
// handler with useCallback.  That single stable reference flows through
// TaskItem -> TaskStatusButton.

interface TaskStatusButtonProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus, completedAt?: string) => void;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  Todo:       'To Do',
  InProgress: 'In Progress',
  InReview:   'In Review',
  Done:       'Done',
}

const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo:       ['InProgress'],
  InProgress: ['InReview'],
  InReview:   ['Done', 'InProgress'],
  Done:       [],
}

export function TaskStatusButton({ task, onStatusChange }: TaskStatusButtonProps) {
  const nextStatuses = VALID_TRANSITIONS[task.status];

  if (nextStatuses.length === 0) {
    return null;
  }

  function handleClick(newStatus: TaskStatus) {
    const completedAt = newStatus === 'Done' ? new Date().toISOString() : undefined;
    onStatusChange(task.id, newStatus, completedAt);
  }

  return (
    <>
      {nextStatuses.map((newStatus) => (
        <button
          key={newStatus}
          type="button"
          className="task-status-button"
          onClick={() => handleClick(newStatus)}
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
