import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AddProjectForm } from '../components/AddProjectForm'
import { PageLayout } from '../components/PageLayout'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { ProjectFormData } from '../types'

// NewProjectPage renders the AddProjectForm as a full page (not inside the
// master-detail split).
//
// On submit (or cancel), the user is navigated back to /projects.

export function NewProjectPage() {
  const navigate = useNavigate();

  useDocumentTitle('New Project | TaskFlow');

  function handleAddProject(_data: ProjectFormData) {
    // In Challenge 12, wire this up with addProject from AuthContext or a
    // projects context so newly created projects appear in the master list.
    navigate('/projects');
  }

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
