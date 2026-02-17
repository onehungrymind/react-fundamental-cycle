import { ProjectCard } from './ProjectCard'
import type { ProjectCardProps } from '../types'

// Five projects covering all three statuses.
// proj-1 and proj-4 have past dueDates so they will show the overdue indicator.
// Use "as const" on string literals to keep the narrow union type
// ('active' | 'completed' | 'archived') instead of widening to string.
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
  return (
    <main className="app-main">
      <div className="main-inner">
        <h2 className="main-heading">Projects</h2>
        <p className="main-description">
          Here is a summary of your current projects.
        </p>

        {/* Ternary: show empty state when there are no projects, otherwise
            render the grid. Use project.id as the key — never array index. */}
        {projects.length === 0 ? (
          <p className="empty-state">No projects yet. Create your first project!</p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default MainContent
