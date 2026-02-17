import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '../../api/projects'

// ============================================================
// useProjects
//
// Fetches the full list of projects from /api/projects.
//
// Query key: ["projects"]
//   - The outermost key segment.  Any call to
//     queryClient.invalidateQueries({ queryKey: ["projects"] })
//     will also invalidate individual project queries because
//     TanStack Query matches by prefix.
//
// staleTime: 30_000 (30 seconds)
//   - Within this window, navigating back to the projects list
//     shows the cached data instantly with no loading spinner.
//   - After 30s the data is "stale" — TanStack Query will show
//     the stale data immediately while refetching in the background.
// ============================================================

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 30_000,
  })
}
