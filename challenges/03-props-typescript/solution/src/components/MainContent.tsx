import { ProjectCard } from './ProjectCard'
import type { ProjectCardProps } from '../types'

const projects: ProjectCardProps[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website',
    status: 'active',
    taskCount: 5,
    dueDate: '2025-03-15',
  },
  {
    id: '2',
    name: 'Mobile App MVP',
    description: 'Build the first version of the mobile app',
    status: 'active',
    taskCount: 4,
    dueDate: '2025-06-01',
  },
  {
    id: '3',
    name: 'API Migration',
    description: 'Migrate legacy REST endpoints to GraphQL',
    status: 'completed',
    taskCount: 3,
  },
]

export function MainContent() {
  return (
    <main className="app-main">
      <div className="main-inner">
        <h2 className="main-heading">Projects</h2>
        <p className="main-description">
          Here is a summary of your current projects.
        </p>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default MainContent
