import type React from 'react'
import type { Task, TaskStatus } from '../types'
import { VALID_TRANSITIONS, type TaskAction } from '../reducers/taskReducer'

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
