import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '../../api/projects'

// TODO Feature 3: Add refetchInterval and refetchIntervalInBackground to
// enable real-time polling every 30 seconds. Polling should pause when
// the browser tab is hidden.
//
// Hint: TanStack Query's refetchIntervalInBackground: false pauses polling
// when the Page Visibility API reports the tab as hidden.

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 30_000,
    // TODO Feature 3: add refetchInterval: 30_000,
    // TODO Feature 3: add refetchIntervalInBackground: false,
  })
}
