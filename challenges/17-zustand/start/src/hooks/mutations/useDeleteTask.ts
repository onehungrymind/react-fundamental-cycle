import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '../../api/tasks'
import type { ProjectWithTasks } from '../../api/projects'

export const UNDO_WINDOW_MS = 3000

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['projects', projectId] })

      const previous = queryClient.getQueryData<ProjectWithTasks>(['projects', projectId])

      queryClient.setQueryData<ProjectWithTasks>(['projects', projectId], (old) => {
        if (old === undefined) return old
        return {
          ...old,
          tasks: old.tasks.filter((t) => t.id !== taskId),
          taskCount: Math.max(0, old.taskCount - 1),
        }
      })

      const undo = () => {
        if (previous !== undefined) {
          queryClient.setQueryData(['projects', projectId], previous)
        }
      }

      return { previous, undo }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['projects', projectId], context.previous)
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
    },
  })
}
