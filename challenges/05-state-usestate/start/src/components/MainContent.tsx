import { ProjectCard } from './ProjectCard'
import type { ProjectCardProps } from '../types'

// The projects array is the same data from Challenge 04.
// proj-1, proj-2, and proj-4 have past dueDates so they show the overdue indicator.
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
  // TODO 1: Import useState from 'react' at the top of this file.
  //
  // TODO 2: Import ProjectStatus from '../types' alongside ProjectCardProps.
  //
  // TODO 3: Declare a state variable for the active filter.
  //         The type should be ProjectStatus | "all" and the initial value "all":
  //
  //         const [activeFilter, setActiveFilter] =
  //           useState<ProjectStatus | "all">("all");
  //
  // TODO 4: Derive filteredProjects during render — do NOT put it in useState.
  //         Use .filter() to keep only projects whose status matches activeFilter,
  //         or return all projects when activeFilter is "all":
  //
  //         const filteredProjects =
  //           activeFilter === "all"
  //             ? projects
  //             : projects.filter((p) => p.status === activeFilter);
  //
  // TODO 5: Import StatusFilter from './StatusFilter' and render it above the
  //         count line. Pass activeFilter and setActiveFilter as props:
  //
  //         <StatusFilter
  //           activeFilter={activeFilter}
  //           onFilterChange={setActiveFilter}
  //         />
  //
  // TODO 6: Add a count line below StatusFilter:
  //
  //         <p className="filter-count">
  //           Showing {filteredProjects.length} of {projects.length} projects
  //         </p>
  //
  // TODO 7: Update the empty-state ternary to use filteredProjects instead of
  //         projects. Change the empty message to:
  //         "No projects match the selected filter."
  //         Update the .map() to iterate over filteredProjects too.

  return (
    <main className="app-main">
      <div className="main-inner">
        <h2 className="main-heading">Projects</h2>
        <p className="main-description">
          Here is a summary of your current projects.
        </p>

        {/* TODO: Add <StatusFilter> here once you create it */}

        {/* TODO: Add the count line "Showing X of Y projects" here */}

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
