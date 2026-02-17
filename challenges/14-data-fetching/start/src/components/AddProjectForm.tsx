import { useState } from 'react'
import type { ProjectFormData, FormErrors, ProjectStatus } from '../types'

interface AddProjectFormProps {
  onAddProject: (data: ProjectFormData) => void;
  onCancel: () => void;
}

const INITIAL_FORM: ProjectFormData = {
  name: '',
  description: '',
  status: 'active',
  dueDate: '',
};

export function AddProjectForm({ onAddProject, onCancel }: AddProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors: FormErrors = {};

    if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name is required (minimum 3 characters)';
    }
    if (formData.description.trim() === '') {
      newErrors.description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddProject(formData);
    setFormData(INITIAL_FORM);
    setErrors({});
  }

  return (
    <section className="add-project-form" aria-label="Add new project">
      <form onSubmit={handleSubmit} noValidate>

        <div className="form-group">
          <label htmlFor="project-name" className="form-label form-label--required">
            Project Name
          </label>
          <input
            type="text"
            id="project-name"
            className={`form-input${errors.name ? ' form-input--error' : ''}`}
            value={formData.name}
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

        <div className="form-group">
          <label htmlFor="project-description" className="form-label form-label--required">
            Description
          </label>
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

        <div className="form-group">
          <label htmlFor="project-status" className="form-label">
            Status
          </label>
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

        <div className="form-group">
          <label htmlFor="project-due-date" className="form-label">
            Due Date{' '}
            <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
              (optional)
            </span>
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

        <div className="form-actions">
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
