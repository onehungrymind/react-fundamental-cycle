// ProjectEmptyState is the index route under /projects.
//
// It renders in the right panel of ProjectsLayout when no project has been
// selected (i.e., the URL is exactly /projects with no :projectId segment).
//
// This is a common UX pattern: show a placeholder until the user makes a
// selection so the right panel is never blank or misleading.

export function ProjectEmptyState() {
  return (
    <div className="project-empty-state">
      <div className="project-empty-state__icon" aria-hidden="true">
        &#9776;
      </div>
      <h2 className="project-empty-state__heading">No project selected</h2>
      <p className="project-empty-state__message">
        Select a project from the list to view its details and tasks.
      </p>
    </div>
  )
}

export default ProjectEmptyState
