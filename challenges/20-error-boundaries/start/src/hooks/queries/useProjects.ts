import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '../../api/projects'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 30_000,
  })
}
