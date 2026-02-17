import { ProjectCard } from './ProjectCard'

// TODO: Expand this array to at least 5 projects with a mix of statuses.
//       Use id strings "proj-1" through "proj-5".
//       Include at least two projects with a dueDate in the past (e.g. "2024-12-01").
//       Statuses needed: at least one "active", one "completed", one "archived".
//
//       Reminder — use "as const" on string literals so TypeScript keeps the
//       narrow union type instead of widening to string:
//         status: "active" as const

export function MainContent() {
  return (
    <main className="app-main">
      <div className="main-inner">
        <h2 className="main-heading">Projects</h2>
        <p className="main-description">
          Here is a summary of your current projects.
        </p>

        {/* TODO: Replace these three individual <ProjectCard /> instances with
                  a single .map() call over the projects array.
                  Use key={project.id} — never use array index as key.

            TODO: Add an empty-state message when projects.length === 0:
                  "No projects yet. Create your first project!"
                  Use a ternary so the project grid and the empty state are
                  mutually exclusive. */}

        <div className="project-grid">
          <ProjectCard
            id="proj-1"
            name="Website Redesign"
            description="Complete overhaul of the company website with modern design."
            status="active"
            taskCount={5}
            dueDate="2025-03-15"
          />
          <ProjectCard
            id="proj-2"
            name="Mobile App MVP"
            description="Build the first version of the mobile app."
            status="active"
            taskCount={4}
            dueDate="2025-06-01"
          />
          <ProjectCard
            id="proj-3"
            name="API Migration"
            description="Migrate legacy REST endpoints to GraphQL."
            status="completed"
            taskCount={3}
          />
        </div>
      </div>
    </main>
  )
}

export default MainContent
