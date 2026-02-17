import { useQuery } from '@tanstack/react-query'
import { fetchProject } from '../../api/projects'

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => fetchProject(projectId),
    staleTime: 30_000,
    enabled: projectId !== '',
  })
}
