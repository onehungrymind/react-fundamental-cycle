import { useState } from 'react'
import type React from 'react'
import { useCreateTask } from '../hooks/mutations/useCreateTask'

// AddTaskForm calls useCreateTask mutation directly.
// The projectId drives the mutation hook (determines which cache
// entry to update optimistically).

interface AddTaskFormProps {
  projectId: string;
}

interface FieldState {
  title: string;
  description: string;
}

const EMPTY_FIELDS: FieldState = { title: '', description: '' };

export function AddTaskForm({ projectId }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<FieldState>(EMPTY_FIELDS);
  const [titleError, setTitleError] = useState<string | undefined>(undefined);

  const createTask = useCreateTask(projectId);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (fields.title.trim().length < 2) {
      setTitleError('Title must be at least 2 characters');
      return;
    }

    createTask.mutate(
      {
        title: fields.title.trim(),
        description: fields.description.trim(),
        status: 'Todo',
      },
      {
        onSuccess: () => {
          setFields(EMPTY_FIELDS);
          setTitleError(undefined);
          setIsOpen(false);
        },
      },
    );
  }

  function handleCancel() {
    setFields(EMPTY_FIELDS);
    setTitleError(undefined);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <div className="add-task-form">
        <button
          type="button"
          className="add-task-form__toggle"
          onClick={() => setIsOpen(true)}
        >
          + Add task
        </button>
      </div>
    );
  }

  return (
    <div className="add-task-form">
      <form onSubmit={handleSubmit} noValidate>
        <div className="add-task-form__fields">
          <div className="add-task-form__row">
            <input
              type="text"
              className="add-task-form__input"
              placeholder="Task title"
              value={fields.title}
              onChange={(e) => {
                setFields({ ...fields, title: e.target.value });
                if (titleError !== undefined) setTitleError(undefined);
              }}
              aria-label="Task title"
              aria-describedby={titleError !== undefined ? 'add-task-title-error' : undefined}
              aria-invalid={titleError !== undefined}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              disabled={createTask.isPending}
            />
            <button
              type="submit"
              className="add-task-form__submit"
              disabled={createTask.isPending}
            >
              {createTask.isPending ? 'Adding…' : 'Add'}
            </button>
            <button
              type="button"
              className="add-task-form__cancel"
              onClick={handleCancel}
              disabled={createTask.isPending}
            >
              Cancel
            </button>
          </div>

          {titleError !== undefined && (
            <p id="add-task-title-error" className="add-task-form__error" role="alert">
              {titleError}
            </p>
          )}

          {createTask.isError && (
            <p className="add-task-form__error" role="alert">
              Failed to add task. Please try again.
            </p>
          )}

          <textarea
            className="add-task-form__textarea"
            placeholder="Description (optional)"
            value={fields.description}
            onChange={(e) => setFields({ ...fields, description: e.target.value })}
            aria-label="Task description"
            rows={2}
            disabled={createTask.isPending}
          />
        </div>
      </form>
    </div>
  )
}

export default AddTaskForm
