import { useState } from 'react'
import { ProjectCard } from './ProjectCard'
import { StatusFilter } from './StatusFilter'
import { AddProjectForm } from './AddProjectForm'
import { Modal } from './Modal'
import { PageLayout } from './PageLayout'
import type { ProjectCardProps, ProjectFormData, ProjectStatus } from '../types'

// proj-1 and proj-4 have past dueDates — they will show the overdue indicator.
// Projects live in useState so new projects can be appended via handleAddProject.
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
  // projects lives in state so handleAddProject can append to it.
  const [projects, setProjects] = useState<ProjectCardProps[]>(INITIAL_PROJECTS);

  // activeFilter controls which status tab is selected.
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | 'all'>('all');

  // showForm controls whether the "New Project" modal is open.
  // Unlike the start/ version, showForm does NOT hide the "New Project" button —
  // the button always shows and the form lives in a Modal overlay.
  const [showForm, setShowForm] = useState(false);

  // filteredProjects is derived from state on every render — not a second useState.
  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.status === activeFilter);

  // handleAddProject is the callback passed to AddProjectForm.
  // It receives validated form data and builds a full ProjectCardProps to add.
  function handleAddProject(data: ProjectFormData) {
    const newProject: ProjectCardProps = {
      // crypto.randomUUID() generates a UUID v4 with no external dependency.
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      status: data.status,
      taskCount: 0,
      // Only include dueDate if the user actually filled it in.
      dueDate: data.dueDate !== '' ? data.dueDate : undefined,
    };

    // Use the functional update form so we always build on the latest state.
    setProjects((prev) => [...prev, newProject]);
    // Close the modal after a successful submission.
    setShowForm(false);
  }

  // The "New Project" button is passed as the actions slot to PageLayout.
  // Keeping it here (as a prop) rather than hardcoding it inside PageLayout
  // demonstrates that PageLayout is fully generic — it does not know about
  // projects at all.
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
      {/* PageLayout provides the page-header (title + actions) and wraps content.
          Passing title and actions as props lets PageLayout stay generic. */}
      <PageLayout title="Projects" actions={newProjectButton}>
        <p className="page-description">
          Here is a summary of your current projects.
        </p>

        <StatusFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
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

      {/* Modal portal: renders into document.body via createPortal.
          AddProjectForm lives inside Modal as children — Modal does not
          know or care what its children are. */}
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
    </main>
  )
}

export default MainContent
