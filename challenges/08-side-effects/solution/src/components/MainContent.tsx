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
  // Runs whenever projects.length changes.  No cleanup needed because setting
  // document.title is idempotent — the old title is simply replaced.
  // The dependency array [projects.length] means this effect is skipped on
  // re-renders where the count did not change (e.g. filter change).
  // -----------------------------------------------------------------------
  useEffect(() => {
    document.title =
      projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow';
  }, [projects.length]);

  // -----------------------------------------------------------------------
  // Effect 2 — Keyboard shortcut (Cmd/Ctrl+K opens the modal)
  //
  // Empty dependency array [] means: attach the listener once on mount,
  // remove it on unmount.  The cleanup function is the returned arrow
  // function — React calls it before the component is removed from the DOM
  // and before re-running the effect (which never happens here due to []).
  //
  // Note: in React Strict Mode the component mounts, unmounts, and remounts
  // in development.  The cleanup correctly removes the first listener before
  // the second one is added, so you never end up with duplicate listeners.
  // -----------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        // Prevent the browser's default Cmd/Ctrl+K action (e.g. focus
        // the address bar in some browsers or open DevTools search).
        e.preventDefault();
        setShowForm(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup: remove the listener when the component unmounts so we don't
    // accumulate duplicate listeners if the component re-mounts.
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // empty array — runs only on mount / unmount

  // -----------------------------------------------------------------------
  // Effect 3 — Auto-dismiss toast after 3 seconds
  //
  // This effect runs whenever toastMessage changes.  If the new value is
  // null there is nothing to schedule, so we return early (the early return
  // is itself the cleanup — it returns undefined which is valid).
  //
  // When toastMessage is a string we start a 3-second timer.  The cleanup
  // function calls clearTimeout to cancel the timer if:
  //   a) The component unmounts before the 3 seconds elapse, or
  //   b) A second toast is triggered before the first one expires (causing
  //      the effect to re-run, which first calls the previous cleanup).
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (toastMessage === null) return;

    const timerId = setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    // Cleanup: cancel the pending timer.
    return () => {
      clearTimeout(timerId);
    };
  }, [toastMessage]);

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
