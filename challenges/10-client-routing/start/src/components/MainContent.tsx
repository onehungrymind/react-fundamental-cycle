import { useState, useEffect } from 'react'
import { ProjectCard } from './ProjectCard'
import { StatusFilter } from './StatusFilter'
import { AddProjectForm } from './AddProjectForm'
import { Modal } from './Modal'
import { PageLayout } from './PageLayout'
import { Toast } from './Toast'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import { useProjectFilters } from '../hooks/useProjectFilters'
import type { ProjectCardProps, ProjectFormData } from '../types'

// TODO (Challenge 10, Task 2 & 7):
// Move INITIAL_PROJECTS to src/data/projects.ts so ProjectListPage and
// ProjectDetailPage can both import it.
//
// Then replace this component with ProjectListPage in src/pages/ProjectListPage.tsx.
// The "New Project" button should navigate to /projects/new instead of opening a
// modal — remove the modal and use useNavigate('/projects/new') from react-router-dom.

const INITIAL_PROJECTS: ProjectCardProps[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design.',
    status: 'active' as const,
    taskCount: 5,
    dueDate: '2025-03-15',
  },
  {
    id: 'proj-2',
    name: 'Mobile App MVP',
    description: 'Build the first version of the mobile app.',
    status: 'active' as const,
    taskCount: 4,
    dueDate: '2025-06-01',
  },
  {
    id: 'proj-3',
    name: 'API Migration',
    description: 'Migrate legacy REST endpoints to GraphQL.',
    status: 'completed' as const,
    taskCount: 3,
  },
  {
    id: 'proj-4',
    name: 'Design System',
    description: 'Create a shared component library with documented patterns.',
    status: 'active' as const,
    taskCount: 4,
    dueDate: '2024-12-01',
  },
  {
    id: 'proj-5',
    name: 'Analytics Dashboard',
    description: 'Internal dashboard for tracking key product metrics.',
    status: 'archived' as const,
    taskCount: 2,
  },
];

export function MainContent() {
  const [projects, setProjects] = useState<ProjectCardProps[]>(INITIAL_PROJECTS);
  const [showForm, setShowForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { filteredProjects, activeFilter, setFilter } = useProjectFilters(projects);

  useDocumentTitle(
    projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow',
  );

  useKeyboardShortcut('k', 'meta', () => setShowForm(true));

  useEffect(() => {
    if (toastMessage === null) return;

    const timerId = setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [toastMessage]);

  function handleAddProject(data: ProjectFormData) {
    const newProject: ProjectCardProps = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      status: data.status,
      taskCount: 0,
      dueDate: data.dueDate !== '' ? data.dueDate : undefined,
    };

    setProjects((prev) => [...prev, newProject]);
    setShowForm(false);
    setToastMessage('Project created successfully!');
  }

  // TODO (Challenge 10): Replace this button's onClick with useNavigate('/projects/new')
  const newProjectButton = (
    <button
      className="btn-primary"
      onClick={() => setShowForm(true)}
    >
      New Project
    </button>
  );

  return (
    <main className="app-main">
      <PageLayout title="Projects" actions={newProjectButton}>
        <p className="page-description">
          Here is a summary of your current projects.
        </p>

        <StatusFilter
          activeFilter={activeFilter}
          onFilterChange={setFilter}
        />

        <p className="filter-count">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>

        {filteredProjects.length === 0 ? (
          <p className="empty-state">No projects match the selected filter.</p>
        ) : (
          <div className="project-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </PageLayout>

      {/* TODO (Challenge 10): Remove this modal — New Project is now a page route */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="New Project"
      >
        <AddProjectForm
          onAddProject={handleAddProject}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {toastMessage !== null && <Toast message={toastMessage} />}
    </main>
  )
}

export default MainContent
