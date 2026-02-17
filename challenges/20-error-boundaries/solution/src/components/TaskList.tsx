import { useState, useMemo, useCallback } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { TaskSearchInput } from './TaskSearchInput'
import { AddTaskForm } from './AddTaskForm'
import { ErrorBoundary } from './ErrorBoundary'
import { useUpdateTask } from '../hooks/mutations/useUpdateTask'
import { useDeleteTask } from '../hooks/mutations/useDeleteTask'
import type { Task, TaskStatus } from '../types'
import type { ProjectDetailOutletContext } from '../pages/ProjectDetailPanel'

// Challenge 20 — Error Boundaries
//
// This is the SOLUTION version.
//
// The AddTaskForm section is wrapped in an ErrorBoundary.
//
// Isolation effect: if the form crashes during render, the task list
// (search, task items, task count) remains fully functional.  The form
// section shows a "Try Again" fallback instead of crashing the whole panel.
//
// Design question: should individual TaskItem rows each be wrapped?
//   - Pro: a single broken task card doesn't remove the whole list
//   - Con: 12 boundaries in the DOM for a 12-task project is noisy
//   - Practical answer: wrap the <ul> (the whole list) in one boundary,
//     which protects the form and header from task-level crashes.
//   - This solution wraps only the form for demonstration purposes.

interface TaskListProps {
  initialTasks?: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { projectId } = useParams<{ projectId: string }>();

  const ctx = useOutletContext<ProjectDetailOutletContext | undefined>();
  const tasks = initialTasks ?? ctx?.tasks ?? [];

  const [searchQuery, setSearchQuery] = useState('');

  const updateTaskMutation = useUpdateTask(projectId ?? '');
  const deleteTaskMutation = useDeleteTask(projectId ?? '');

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, searchQuery]);

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

      {/*
        ErrorBoundary around AddTaskForm.
        If the form throws during render (e.g. a validation state bug),
        the task list above remains visible and usable.
        resetError() re-mounts AddTaskForm so the user can try again.
      */}
      <ErrorBoundary>
        <AddTaskForm projectId={projectId ?? ''} />
      </ErrorBoundary>
    </div>
  )
}

export default TaskList
