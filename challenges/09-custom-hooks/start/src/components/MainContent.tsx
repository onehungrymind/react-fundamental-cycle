import { useState, useEffect } from 'react'
import { ProjectCard } from './ProjectCard'
import { StatusFilter } from './StatusFilter'
import { AddProjectForm } from './AddProjectForm'
import { Modal } from './Modal'
import { PageLayout } from './PageLayout'
import { Toast } from './Toast'
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

  // toastMessage holds the text to display in the success toast, or null when
  // no toast should be shown.  Only one toast is shown at a time.
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Effect 1 — Dynamic document title
  //
  // TODO: Extract this effect into src/hooks/useDocumentTitle.ts
  //       Signature: useDocumentTitle(title: string): void
  //       Then replace this block with a single call:
  //         useDocumentTitle(projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow')
  // -----------------------------------------------------------------------
  useEffect(() => {
    document.title =
      projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow';
  }, [projects.length]);

  // -----------------------------------------------------------------------
  // Effect 2 — Keyboard shortcut (Cmd/Ctrl+K opens the modal)
  //
  // TODO: Extract this effect into src/hooks/useKeyboardShortcut.ts
  //       Signature: useKeyboardShortcut(key: string, modifier: 'meta' | 'ctrl', callback: () => void): void
  //       Then replace this block with a single call:
  //         useKeyboardShortcut('k', 'meta', () => setShowForm(true))
  //
  // Note: the hook should accept a modifier parameter ('meta' | 'ctrl') rather
  // than hard-coding both modifiers like the inline version does.
  // -----------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowForm(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // -----------------------------------------------------------------------
  // Effect 3 — Auto-dismiss toast after 3 seconds
  //
  // This effect can stay here for now (it is part of the Bonus section in
  // the README if you want to extract it too).
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

  // filteredProjects is derived from state on every render — not a second useState.
  //
  // TODO: Extract activeFilter state + filter logic into src/hooks/useProjectFilters.ts
  //       Signature: useProjectFilters(projects: ProjectCardProps[]): UseProjectFiltersReturn
  //       Return shape: { filteredProjects, activeFilter, setFilter, statusCounts }
  //       Then replace the useState above and this derivation with:
  //         const { filteredProjects, activeFilter, setFilter } = useProjectFilters(projects)
  //       And pass setFilter as onFilterChange to StatusFilter instead of setActiveFilter.
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
    // Trigger the success toast — Effect 3 will auto-clear it after 3 seconds.
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

      {/* Toast: only rendered while toastMessage is not null.
          React removes it from the DOM the moment toastMessage becomes null,
          which happens when Effect 3's setTimeout fires after 3 seconds. */}
      {toastMessage !== null && <Toast message={toastMessage} />}
    </main>
  )
}

export default MainContent
