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
// This is the STARTING POINT for Challenge 11 — this full-page list view
// will be replaced with the master panel in the master-detail layout.
//
// Your task: create ProjectsLayout.tsx that renders a narrow list on the
// left and an <Outlet /> on the right, then update App.tsx to use nested
// routes.  See README.md for full instructions.

export function ProjectListPage() {
  const [projects] = useState<ProjectCardProps[]>(INITIAL_PROJECTS);

  const navigate = useNavigate();

  const { filteredProjects, activeFilter, setFilter } = useProjectFilters(projects);

  useDocumentTitle(
    projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow',
  );

  useKeyboardShortcut('k', 'meta', () => navigate('/projects/new'));

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
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </PageLayout>
    </div>
  )
}

export default ProjectListPage
