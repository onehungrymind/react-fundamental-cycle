import { useState } from 'react'
import type React from 'react'
import type { TaskAction } from '../reducers/taskReducer'

// TODO (Challenge 16):
//   - Replace dispatch prop with an onAdd callback:
//       onAdd: (data: Pick<Task, 'title' | 'description'>) => void
//   - Call useCreateTask mutation inside this component OR receive callback from parent
//   - Disable submit while mutation is pending (isPending)
//   - Clear form on success (use onSuccess in mutation or await mutateAsync)

interface AddTaskFormProps {
  dispatch: React.Dispatch<TaskAction>;
  projectId: string;
}

interface FieldState {
  title: string;
  description: string;
}

const EMPTY_FIELDS: FieldState = { title: '', description: '' };

export function AddTaskForm({ dispatch, projectId: _projectId }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<FieldState>(EMPTY_FIELDS);
  const [titleError, setTitleError] = useState<string | undefined>(undefined);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (fields.title.trim().length < 2) {
      setTitleError('Title must be at least 2 characters');
      return;
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // TODO: Replace with mutation call
    dispatch({
      type: 'ADD_TASK',
      payload: {
        task: {
          id,
          title: fields.title.trim(),
          description: fields.description.trim(),
          status: 'Todo',
          projectId: _projectId,
          createdAt,
        },
      },
    });

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
