import { useState } from 'react'
import type { ProjectFormData, FormErrors, ProjectStatus } from '../types'

interface AddProjectFormProps {
  onAddProject: (data: ProjectFormData) => void;
  onCancel: () => void;
}

// INITIAL_FORM is a module-level constant so resetting the form is a single
// setFormData(INITIAL_FORM) call — no need to repeat the default values.
const INITIAL_FORM: ProjectFormData = {
  name: '',
  description: '',
  status: 'active',
  dueDate: '',
};

export function AddProjectForm({ onAddProject, onCancel }: AddProjectFormProps) {
  // Single state object for all field values — avoids five separate useState calls
  // and makes it trivial to reset the form after submission.
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM);

  // Separate state for validation errors.  Absent keys mean no error for that field.
  const [errors, setErrors] = useState<FormErrors>({});

  // handleSubmit is typed with React.FormEvent<HTMLFormElement> so TypeScript
  // knows we can call e.preventDefault() and that it's a form event.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Stop the browser from reloading the page via its default form submission.
    e.preventDefault();

    // Build the error object fresh on every submit attempt.
    const newErrors: FormErrors = {};

    if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name is required (minimum 3 characters)';
    }
    if (formData.description.trim() === '') {
      newErrors.description = 'Description is required';
    }

    // If there are any errors, display them and stop — do not call onAddProject.
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Validation passed: hand the data to the parent, then reset.
    onAddProject(formData);
    setFormData(INITIAL_FORM);
    setErrors({});
  }

  return (
    <section className="add-project-form" aria-label="Add new project">
      <h3 className="add-project-form__title">New Project</h3>

      {/* onSubmit on the <form> element — not on a button — so pressing Enter
          in any field also triggers validation and submission. */}
      <form onSubmit={handleSubmit} noValidate>

        {/* ---- Project Name ---- */}
        <div className="form-group">
          <label htmlFor="project-name" className="form-label form-label--required">
            Project Name
          </label>
          <input
            type="text"
            id="project-name"
            className={`form-input${errors.name ? ' form-input--error' : ''}`}
            value={formData.name}
            // React.ChangeEvent<HTMLInputElement> gives us e.target.value as string.
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g. Website Redesign"
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={errors.name !== undefined}
          />
          {errors.name && (
            <p id="name-error" className="form-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* ---- Description ---- */}
        <div className="form-group">
          <label htmlFor="project-description" className="form-label form-label--required">
            Description
          </label>
          {/* React.ChangeEvent<HTMLTextAreaElement> — note the different element type. */}
          <textarea
            id="project-description"
            className={`form-textarea${errors.description ? ' form-textarea--error' : ''}`}
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="What is this project about?"
            rows={3}
            aria-describedby={errors.description ? 'description-error' : undefined}
            aria-invalid={errors.description !== undefined}
          />
          {errors.description && (
            <p id="description-error" className="form-error" role="alert">
              {errors.description}
            </p>
          )}
        </div>

        {/* ---- Status ---- */}
        <div className="form-group">
          <label htmlFor="project-status" className="form-label">
            Status
          </label>
          {/* React.ChangeEvent<HTMLSelectElement> — cast the string value to the
              union type because TypeScript cannot infer it from the option elements. */}
          <select
            id="project-status"
            className="form-select"
            value={formData.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFormData({ ...formData, status: e.target.value as ProjectStatus })
            }
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* ---- Due Date (optional) ---- */}
        <div className="form-group">
          <label htmlFor="project-due-date" className="form-label">
            Due Date <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(optional)</span>
          </label>
          <input
            type="date"
            id="project-due-date"
            className="form-input"
            value={formData.dueDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </div>

        {/* ---- Actions ---- */}
        <div className="form-actions">
          {/* type="button" prevents this from triggering the form's onSubmit. */}
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add Project
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddProjectForm
