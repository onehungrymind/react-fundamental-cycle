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
