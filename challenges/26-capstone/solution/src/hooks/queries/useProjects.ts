import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '../../api/projects'

// ============================================================
// useProjects — Challenge 26 Capstone update
//
// Added refetchInterval: 30_000 for real-time polling.
// refetchIntervalInBackground: false pauses polling when the
// browser tab is hidden (TanStack Query listens to the
// Page Visibility API internally).  This avoids wasting
// bandwidth for background tabs while still keeping the data
// fresh whenever the user is actively looking at the app.
// ============================================================

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  })
}
