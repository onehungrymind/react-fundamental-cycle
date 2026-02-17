import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AddProjectForm } from '../components/AddProjectForm'
import { PageLayout } from '../components/PageLayout'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { ProjectFormData } from '../types'

export function NewProjectPage() {
  const navigate = useNavigate();

  useDocumentTitle('New Project | TaskFlow');

  function handleAddProject(_data: ProjectFormData) {
    // In this challenge project data is not persisted — a future challenge
    // will add a ProjectsContext with an addProject action.
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
