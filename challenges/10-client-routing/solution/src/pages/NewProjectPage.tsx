import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AddProjectForm } from '../components/AddProjectForm'
import { PageLayout } from '../components/PageLayout'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { ProjectFormData } from '../types'

// NewProjectPage renders the AddProjectForm as a full page (not a modal).
//
// Key differences from the modal pattern in ch09:
//   - The form is a route, not a modal — the user can bookmark it or share the
//     URL.  The back button works naturally.
//   - onCancel navigates back to /projects (same as the browser Back button,
//     but explicit).
//   - onAddProject would ideally add the project to a shared store.  For now
//     it just navigates back — the list page still shows only the seed data.
//     Challenge 11 introduces a context that fixes this.
//
// useNavigate is the programmatic equivalent of clicking a <Link>.  It must be
// called from inside a component rendered within a Router context.

export function NewProjectPage() {
  const navigate = useNavigate();

  useDocumentTitle('New Project | TaskFlow');

  // Called when the form submits with valid data.
  // In this challenge we navigate back to /projects immediately.
  // The project is not added to the list yet — that requires shared state
  // (introduced in Challenge 11).
  function handleAddProject(_data: ProjectFormData) {
    navigate('/projects');
  }

  // "Back to Projects" link in the page header actions area.
  const backLink = (
    <Link to="/projects" className="btn-secondary">
      Back to Projects
    </Link>
  );

  return (
    <PageLayout title="New Project" actions={backLink}>
      <p className="page-description">
        Fill in the details below to create a new project.
      </p>

      {/* AddProjectForm is reused as-is — no changes to the component itself.
          onCancel navigates back to /projects (mirrors the modal close action). */}
      <div className="new-project-form-container">
        <AddProjectForm
          onAddProject={handleAddProject}
          onCancel={() => navigate('/projects')}
        />
      </div>
    </PageLayout>
  )
}

export default NewProjectPage
