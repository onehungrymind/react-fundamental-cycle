import type { Project, Task } from '../types'
import type { TeamMember } from '../mocks/data'

// ============================================================
// API base URL
// ============================================================

const API_BASE = '/api'

// ============================================================
// Typed fetch functions
//
// These are plain async functions — not hooks.  They are used as
// the `queryFn` argument to useQuery().  Keeping fetch logic
// separate from the hooks makes them:
//   - Easy to test in isolation
//   - Reusable across prefetchQuery, getQueryData, etc.
//   - Readable: hooks declare *how to cache*, functions declare *how to fetch*
// ============================================================

export type ProjectWithTasks = Project & { tasks: Task[] }

// GET /api/projects — Returns all projects
export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`)
  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`)
  }
  return res.json() as Promise<Project[]>
}

// GET /api/projects/:id — Returns a single project with its tasks embedded
export async function fetchProject(id: string): Promise<ProjectWithTasks> {
  const res = await fetch(`${API_BASE}/projects/${id}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch project: ${res.status}`)
  }
  return res.json() as Promise<ProjectWithTasks>
}

// GET /api/team — Returns all team members
export async function fetchTeam(): Promise<TeamMember[]> {
  const res = await fetch(`${API_BASE}/team`)
  if (!res.ok) {
    throw new Error(`Failed to fetch team: ${res.status}`)
  }
  return res.json() as Promise<TeamMember[]>
}
