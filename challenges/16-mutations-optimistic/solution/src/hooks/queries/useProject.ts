import { useQuery } from '@tanstack/react-query'
import { fetchProject } from '../../api/projects'

// ============================================================
// useProject
//
// Fetches a single project (with its tasks) from /api/projects/:id.
//
// Query key: ["projects", projectId]
//   - Nested under ["projects"] so that invalidating the parent
//     key also marks this query stale.
//   - Each unique projectId gets its own cache entry.
//
// staleTime: 30_000 (30 seconds)
//
// enabled: projectId !== ''
//   - Prevents the query from firing with an empty string ID.
// ============================================================

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => fetchProject(projectId),
    staleTime: 30_000,
    enabled: projectId !== '',
  })
}
