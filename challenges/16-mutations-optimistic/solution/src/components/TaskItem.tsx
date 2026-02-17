import { Link } from 'react-router-dom'
import type { Task } from '../types'
import { TEAM_MEMBERS } from '../data/team'
import { TaskStatusButton } from './TaskStatusButton'
import { TaskAssignment } from './TaskAssignment'
import { useDeleteTask, UNDO_WINDOW_MS } from '../hooks/mutations/useDeleteTask'
import { Toast } from './Toast'
import { useState, useRef } from 'react'

// TaskItem uses mutation hooks directly — no dispatch prop needed.
//
// Delete flow:
//   1. User clicks Delete
//   2. useDeleteTask.onMutate removes the task optimistically from cache
//   3. The mutate() onSuccess callback receives `context` which includes `undo()`
//   4. Toast appears with "Undo" button for UNDO_WINDOW_MS
//   5. If Undo clicked: context.undo() restores cache snapshot
//   6. Timer expires: toast dismisses; onSettled invalidates to confirm server state

interface TaskItemProps {
  task: Task;
  projectId: string;
}

export function TaskItem({ task, projectId }: TaskItemProps) {
  const member = TEAM_MEMBERS.find((m) => m.id === task.assigneeId);
  const deleteMutation = useDeleteTask(projectId);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const undoFnRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOptimistic = task.id.startsWith('temp-');

  function handleDelete() {
    // mutate() receives the context returned from onMutate via the
    // onSuccess/onError/onSettled per-call callbacks.
    deleteMutation.mutate(task.id, {
      onSuccess: (_data, _vars, context) => {
        // context is typed as { previous, undo } | undefined
        if (context !== undefined) {
          undoFnRef.current = context.undo;
        }
        setShowUndoToast(true);
        timerRef.current = setTimeout(() => {
          setShowUndoToast(false);
          undoFnRef.current = null;
        }, UNDO_WINDOW_MS);
      },
    });
  }

  function handleUndo() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowUndoToast(false);
    if (undoFnRef.current !== null) {
      undoFnRef.current();
      undoFnRef.current = null;
    }
  }

  return (
    <>
      <div className={`task-item${isOptimistic ? ' task-item--optimistic' : ''}`}>
        <div className="task-item__top">
          <Link
            to={`/projects/${projectId}/tasks/${task.id}`}
            className="task-item__title"
          >
            {task.title}
          </Link>
          <span className={`status-badge status-badge--${task.status}`}>
            {task.status}
          </span>
          {member !== undefined && (
            <span className="task-item__assignee">{member.name}</span>
          )}
          <button
            type="button"
            className="task-delete-btn"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || isOptimistic}
            aria-label={`Delete task: ${task.title}`}
            title="Delete task"
          >
            &#10005;
          </button>
        </div>

        <div className="task-item__actions">
          <TaskStatusButton task={task} projectId={projectId} />
          <TaskAssignment task={task} projectId={projectId} />
        </div>
      </div>

      {showUndoToast && (
        <Toast
          message="Task deleted."
          variant="success"
          action={{ label: 'Undo', onClick: handleUndo }}
        />
      )}
    </>
  )
}

export default TaskItem
