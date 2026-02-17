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
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      status: data.status,
      taskCount: 0,
      dueDate: data.dueDate !== '' ? data.dueDate : undefined,
    };

    setProjects((prev) => [...prev, newProject]);
    setShowForm(false);

    // TODO 3: After closing the modal, set a toast message so the user gets
    // visual confirmation that the project was created.  Something like:
    //   setToastMessage('Project created successfully!')
  }

  // TODO 1 — Dynamic document title
  // Add a useEffect that updates document.title whenever projects.length changes.
  // When there are projects: "Projects | TaskFlow"
  // When the list is empty:  "Get Started | TaskFlow"
  //
  // useEffect(() => {
  //   document.title = projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow';
  // }, [projects.length]);

  // TODO 2 — Keyboard shortcut (Cmd/Ctrl+K opens the modal)
  // Add a useEffect that attaches a 'keydown' listener to window on mount and
  // removes it on unmount.  The handler should check e.metaKey || e.ctrlKey
  // together with e.key === 'k', then call setShowForm(true).
  //
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => { ... };
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, []);

  // TODO 3 — Auto-dismiss toast
  // 1. Add a toastMessage state: useState<string | null>(null)
  // 2. In handleAddProject (above), call setToastMessage('Project created successfully!')
  // 3. Add a useEffect that starts a 3-second timer when toastMessage is set,
  //    then clears it.  Return a cleanup function that calls clearTimeout so the
  //    timer is cancelled if the component unmounts before the 3 seconds elapse.
  //
  // useEffect(() => {
  //   if (toastMessage === null) return;
  //   const id = setTimeout(() => setToastMessage(null), 3000);
  //   return () => clearTimeout(id);
  // }, [toastMessage]);

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

      {/* TODO 3: Render the Toast here when toastMessage is not null.
          Import Toast from './Toast' once you create it, or render the
          toast markup inline.  Example:
            {toastMessage !== null && <Toast message={toastMessage} />}
      */}
    </main>
  )
}

export default MainContent
