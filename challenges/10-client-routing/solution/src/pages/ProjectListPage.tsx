import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { StatusFilter } from '../components/StatusFilter'
import { PageLayout } from '../components/PageLayout'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import { useProjectFilters } from '../hooks/useProjectFilters'
import { INITIAL_PROJECTS } from '../data/projects'
import type { ProjectCardProps } from '../types'

// ProjectListPage renders the project grid with filter controls.
//
// Changes from the ch09 MainContent component:
//   1. The "New Project" button uses useNavigate('/projects/new') instead of
//      opening a modal.  The Modal and AddProjectForm are no longer imported here.
//   2. INITIAL_PROJECTS is imported from src/data/projects.ts (shared module).
//   3. useKeyboardShortcut navigates to /projects/new.
//
// Known limitation (addressed in Challenge 11):
//   Projects added on /projects/new do not appear here because each page has its
//   own local useState.  A shared context solves this in the next challenge.

export function ProjectListPage() {
  // projects lives in useState so items can be appended in future challenges.
  const [projects] = useState<ProjectCardProps[]>(INITIAL_PROJECTS);

  const navigate = useNavigate();

  const { filteredProjects, activeFilter, setFilter } = useProjectFilters(projects);

  useDocumentTitle(
    projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow',
  );

  // Cmd+K (macOS) / Ctrl+K navigates to the New Project page.
  useKeyboardShortcut('k', 'meta', () => navigate('/projects/new'));

  // The "New Project" button navigates to the /projects/new route.
  const newProjectButton = (
    <button
      className="btn-primary"
      onClick={() => navigate('/projects/new')}
    >
      New Project
    </button>
  );

  return (
    <div>
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
              // ProjectCard wraps itself in <Link to={`/projects/${id}`}>.
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </PageLayout>

    </div>
  )
}

export default ProjectListPage
