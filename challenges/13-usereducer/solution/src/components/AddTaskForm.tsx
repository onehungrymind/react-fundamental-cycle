import { useState } from 'react'
import type React from 'react'
import type { TaskAction } from '../reducers/taskReducer'

// AddTaskForm lets the user create a new task for the current project.
//
// Key design decisions:
//
// 1. IDs and timestamps are generated HERE (in the submit handler),
//    not inside the reducer.  The reducer is pure and must not call
//    crypto.randomUUID() or new Date().
//
// 2. The form owns its own local field state (title, description) via
//    useState.  Once submitted, it resets to blank.
//
// 3. `projectId` is threaded in from TaskList so the new task is
//    automatically associated with the correct project.

interface AddTaskFormProps {
  dispatch: React.Dispatch<TaskAction>;
  projectId: string;
}

interface FieldState {
  title: string;
  description: string;
}

const EMPTY_FIELDS: FieldState = { title: '', description: '' };

export function AddTaskForm({ dispatch, projectId }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<FieldState>(EMPTY_FIELDS);
  const [titleError, setTitleError] = useState<string | undefined>(undefined);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (fields.title.trim().length < 2) {
      setTitleError('Title must be at least 2 characters');
      return;
    }

    // Generate impure values BEFORE dispatching — never inside the reducer.
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    dispatch({
      type: 'ADD_TASK',
      payload: {
        task: {
          id,
          title: fields.title.trim(),
          description: fields.description.trim(),
          status: 'Todo',
          projectId,
          createdAt,
        },
      },
    });

    // Reset local form state
    setFields(EMPTY_FIELDS);
    setTitleError(undefined);
    setIsOpen(false);
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
            />
            <button type="submit" className="add-task-form__submit">
              Add
            </button>
            <button type="button" className="add-task-form__cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>

          {titleError !== undefined && (
            <p id="add-task-title-error" className="add-task-form__error" role="alert">
              {titleError}
            </p>
          )}

          <textarea
            className="add-task-form__textarea"
            placeholder="Description (optional)"
            value={fields.description}
            onChange={(e) => setFields({ ...fields, description: e.target.value })}
            aria-label="Task description"
            rows={2}
          />
        </div>
      </form>
    </div>
  )
}

export default AddTaskForm
