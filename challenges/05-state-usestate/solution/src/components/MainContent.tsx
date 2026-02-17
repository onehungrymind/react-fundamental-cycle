import { useState } from 'react'
import { ProjectCard } from './ProjectCard'
import { StatusFilter } from './StatusFilter'
import type { ProjectCardProps, ProjectStatus } from '../types'

// proj-1 and proj-4 have past dueDates — they will show the overdue indicator.
const projects: ProjectCardProps[] = [
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
  // activeFilter is the single piece of state — which status button is selected.
  // The initial value "all" means no filter is applied on first render.
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | 'all'>('all');

  // filteredProjects is DERIVED from activeFilter during render.
  // It is a plain const, NOT a second useState — storing it in state would force
  // manual synchronisation and inevitably cause bugs.
  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.status === activeFilter);

  return (
    <main className="app-main">
      <div className="main-inner">
        <h2 className="main-heading">Projects</h2>
        <p className="main-description">
          Here is a summary of your current projects.
        </p>

        {/* StatusFilter receives the current filter value and the setter.
            Passing setActiveFilter directly works because its signature matches
            the onFilterChange prop type exactly. */}
        <StatusFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Count line — both values are derived, no state needed. */}
        <p className="filter-count">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>

        {/* Ternary: empty state when the filtered list has no results. */}
        {filteredProjects.length === 0 ? (
          <p className="empty-state">No projects match the selected filter.</p>
        ) : (
          <div className="project-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default MainContent
