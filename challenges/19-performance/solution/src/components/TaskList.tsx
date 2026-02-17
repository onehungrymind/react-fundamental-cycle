import { useState, useMemo, useCallback } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { TaskSearchInput } from './TaskSearchInput'
import { AddTaskForm } from './AddTaskForm'
import { useUpdateTask } from '../hooks/mutations/useUpdateTask'
import { useDeleteTask } from '../hooks/mutations/useDeleteTask'
import type { Task, TaskStatus } from '../types'
import type { ProjectDetailOutletContext } from '../pages/ProjectDetailPanel'

// Challenge 19 — Performance
//
// This is the SOLUTION version.  Three optimisations are applied:
//
// ─────────────────────────────────────────────────────────────
// OPTIMISATION 1: useMemo for the filtered task list
// ─────────────────────────────────────────────────────────────
// Problem: every render of TaskList (caused by any state/store
//   change) would recompute the filtered array from scratch.
// Fix: useMemo caches the filtered result.  The filter only runs
//   when `tasks` or `searchQuery` actually changes.
// When to skip: if the list has < 100 items and the filter is
//   trivial, the overhead of useMemo exceeds the saved work.
//   We add it here because it is the target of the challenge.
//
// ─────────────────────────────────────────────────────────────
// OPTIMISATION 2: useCallback for handlers passed to TaskItem
// ─────────────────────────────────────────────────────────────
// Problem: without useCallback, every render creates a new
//   function reference for handleStatusChange / handleAssign /
//   handleDelete.  React.memo on TaskItem compares props with ===.
//   A new function reference always fails ===, so memo can't help.
// Fix: useCallback returns the same reference as long as its
//   dependency array does not change.
// Dependency: [updateTaskMutation] / [deleteTaskMutation]
//   These mutation objects from TanStack Query are stable between
//   renders when no mutation is in flight, so the callbacks are
//   very stable in practice.
//
// ─────────────────────────────────────────────────────────────
// OPTIMISATION 3: React.memo on TaskItem (see TaskItem.tsx)
// ─────────────────────────────────────────────────────────────
// With stable function props (from useCallback) and a stable task
// reference (from TanStack Query's cache), React.memo can now skip
// re-rendering TaskItem instances whose props are unchanged.

interface TaskListProps {
  initialTasks?: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { projectId } = useParams<{ projectId: string }>();

  const ctx = useOutletContext<ProjectDetailOutletContext | undefined>();
  const tasks = initialTasks ?? ctx?.tasks ?? [];

  // Search state — every keystroke updates this, which re-renders TaskList.
  // With memo + useCallback, the TaskItem children are skipped.
  const [searchQuery, setSearchQuery] = useState('');

  // Mutations live in TaskList and are passed as stable callbacks.
  // This is the "lift mutations up" pattern required for memoisation to work.
  const updateTaskMutation = useUpdateTask(projectId ?? '');
  const deleteTaskMutation = useDeleteTask(projectId ?? '');

  // ── OPTIMISATION 1: useMemo ──────────────────────────────────
  // Cache the filtered list.  Only recomputes when tasks or searchQuery changes.
  // Without this: the filter runs on every render (e.g. sidebar toggle,
  // theme change, Redux dispatch) even when neither input changed.
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, searchQuery]);

  // ── OPTIMISATION 2: useCallback ─────────────────────────────
  // Each handler is stabilised.  As long as `updateTaskMutation`
  // identity doesn't change (it doesn't during a typing session),
  // these callbacks remain the same reference across re-renders.
  //
  // Without useCallback: new arrow functions are created every render,
  // causing React.memo on TaskItem to see changed props and re-render anyway.
  const handleStatusChange = useCallback(
    (taskId: string, newStatus: TaskStatus, completedAt?: string) => {
      updateTaskMutation.mutate({ taskId, data: { status: newStatus, completedAt } });
    },
    [updateTaskMutation],
  );

  const handleAssign = useCallback(
    (taskId: string, assigneeId: string | undefined) => {
      updateTaskMutation.mutate({ taskId, data: { assigneeId } });
    },
    [updateTaskMutation],
  );

  const handleDelete = useCallback(
    (taskId: string) => {
      deleteTaskMutation.mutate(taskId);
    },
    [deleteTaskMutation],
  );

  return (
    <div className="task-list">
      <h3 className="task-list__heading">Tasks</h3>

      {/* TaskSearchInput is a separate component (state colocation).
          Extracting it keeps TaskList focused on data + layout. */}
      <div className="task-list__search">
        <TaskSearchInput value={searchQuery} onChange={setSearchQuery} />
        {searchQuery.trim() !== '' && (
          <span className="task-list__search-count">
            {filteredTasks.length} of {tasks.length} tasks
          </span>
        )}
      </div>

      {filteredTasks.length === 0 && tasks.length > 0 ? (
        <p className="task-list__empty">
          No tasks match &ldquo;{searchQuery}&rdquo;.
        </p>
      ) : filteredTasks.length === 0 ? (
        <p className="task-list__empty">No tasks for this project yet.</p>
      ) : (
        <ul className="task-list__items">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              {/* ── OPTIMISATION 3: React.memo on TaskItem ──
                  Because onStatusChange, onAssign, onDelete are stable
                  useCallback references, and `task` is stable from the
                  TanStack Query cache when data hasn't changed,
                  React.memo skips re-rendering unchanged TaskItems. */}
              <TaskItem
                task={task}
                projectId={projectId ?? ''}
                onStatusChange={handleStatusChange}
                onAssign={handleAssign}
                onDelete={handleDelete}
                isDeleting={deleteTaskMutation.isPending}
              />
            </li>
          ))}
        </ul>
      )}

      <AddTaskForm projectId={projectId ?? ''} />
    </div>
  )
}

export default TaskList
