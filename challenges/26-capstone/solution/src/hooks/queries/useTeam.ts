import { useQuery } from '@tanstack/react-query'
import { fetchTeam } from '../../api/projects'

// ============================================================
// useTeam — Challenge 26 Capstone
//
// Fetches the list of team members from /api/team.
// staleTime is set to 5 minutes because team membership
// changes far less frequently than tasks or projects.
// ============================================================

export function useTeam() {
  return useQuery({
    queryKey: ['team'],
    queryFn: fetchTeam,
    staleTime: 5 * 60 * 1000,
  })
}
