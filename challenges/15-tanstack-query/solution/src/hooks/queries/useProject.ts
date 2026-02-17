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
//   - Navigating back to the same project within 30s shows cached
//     data with no loading spinner.
//
// enabled: projectId !== ''
//   - Prevents the query from firing with an empty string ID
//     (which would result in a 404).  TanStack Query will stay
//     in the "pending" state until projectId is non-empty.
// ============================================================

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => fetchProject(projectId),
    staleTime: 30_000,
    enabled: projectId !== '',
  })
}
