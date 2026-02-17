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

  // showForm controls whether the "New Project" modal is open.
  const [showForm, setShowForm] = useState(false);

  // toastMessage holds the text to display in the success toast, or null when
  // no toast should be shown.
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Custom hook: useProjectFilters
  //
  // Owns the activeFilter state and derives filteredProjects and statusCounts.
  // The component no longer needs its own activeFilter useState or the inline
  // filter derivation — all of that lives inside the hook.
  // -----------------------------------------------------------------------
  const { filteredProjects, activeFilter, setFilter } = useProjectFilters(projects);

  // -----------------------------------------------------------------------
  // Custom hook: useDocumentTitle
  //
  // Sets document.title whenever the title string changes.  The expression
  // passed here re-evaluates on every render; the hook's effect only fires
  // when the resulting string actually changes.
  // -----------------------------------------------------------------------
  useDocumentTitle(
    projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow',
  );

  // -----------------------------------------------------------------------
  // Custom hook: useKeyboardShortcut
  //
  // Registers Cmd+K (macOS) to open the modal.  The modifier 'meta' maps to
  // e.metaKey inside the hook.  For cross-platform support you could register
  // the hook twice — once with 'meta' and once with 'ctrl' — or extend the
  // hook to accept an array of modifiers.
  // -----------------------------------------------------------------------
  useKeyboardShortcut('k', 'meta', () => setShowForm(true));

  // -----------------------------------------------------------------------
  // Effect: Auto-dismiss toast after 3 seconds
  //
  // This effect stays inline in MainContent because it is tightly coupled to
  // the toastMessage state that lives here.  Extracting it into a useToast
  // hook is a good bonus exercise (see README).
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (toastMessage === null) return;

    const timerId = setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [toastMessage]);

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
    // Trigger the success toast — the inline effect above auto-clears it.
    setToastMessage('Project created successfully!');
  }

  // The "New Project" button is passed as the actions slot to PageLayout.
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
      {/* PageLayout provides the page-header (title + actions) and wraps content. */}
      <PageLayout title="Projects" actions={newProjectButton}>
        <p className="page-description">
          Here is a summary of your current projects.
        </p>

        {/* activeFilter and setFilter come from useProjectFilters — the component
            no longer owns the filter state directly. */}
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

      {/* Modal portal: renders into document.body via createPortal. */}
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

      {/* Toast: only rendered while toastMessage is not null. */}
      {toastMessage !== null && <Toast message={toastMessage} />}
    </main>
  )
}

export default MainContent
