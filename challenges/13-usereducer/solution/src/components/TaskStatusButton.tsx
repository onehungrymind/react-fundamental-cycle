import type React from 'react'
import type { Task, TaskStatus } from '../types'
import { VALID_TRANSITIONS, type TaskAction } from '../reducers/taskReducer'

// TaskStatusButton renders one button for each valid next status.
//
// Key design decisions:
//
// 1. Reads VALID_TRANSITIONS directly — the state machine lives in one place
//    (the reducer file) and the UI derives from it rather than duplicating.
//
// 2. The `completedAt` timestamp is generated HERE, in the click handler,
//    not inside the reducer.  Reducers must be pure (no side effects, no
//    Date.now()), so any impure value that needs to end up in state must be
//    generated outside and passed via the action payload.
//
// 3. If the current status has no valid next states (i.e. the task is Done),
//    the component renders nothing.

interface TaskStatusButtonProps {
  task: Task;
  dispatch: React.Dispatch<TaskAction>;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  Todo:       'To Do',
  InProgress: 'In Progress',
  InReview:   'In Review',
  Done:       'Done',
}

export function TaskStatusButton({ task, dispatch }: TaskStatusButtonProps) {
  const nextStatuses = VALID_TRANSITIONS[task.status];

  if (nextStatuses.length === 0) {
    return null;
  }

  function handleClick(newStatus: TaskStatus) {
    // Generate the timestamp outside the reducer to keep the reducer pure.
    const completedAt = newStatus === 'Done' ? new Date().toISOString() : undefined;

    dispatch({
      type: 'UPDATE_STATUS',
      payload: { taskId: task.id, newStatus, completedAt },
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
