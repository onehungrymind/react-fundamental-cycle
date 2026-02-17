// Challenge 24 — Accessibility Fundamentals
//
// START VERSION — accessibility issue:
//
//   Each button only has a `title` tooltip, not an aria-label.
//   The button text is "→ In Progress" etc. — it does NOT include
//   the task title, so a screen reader user cannot tell which task
//   the button belongs to when navigating by button.
//
// Your task: add aria-label="Change status of {task.title} to {newStatus}"
// to each button so the accessible name includes context.

import type { Task, TaskStatus } from '../types'

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
          // BUG: title is a tooltip, not reliably read by screen readers.
          // There is no aria-label, and the button text does not include
          // the task title — screen reader users cannot tell which task
          // this button belongs to.
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
