import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '../../api/tasks'
import type { Task } from '../../types'
import type { ProjectWithTasks } from '../../api/projects'

interface UpdateTaskVariables {
  taskId: string;
  data: Partial<Task>;
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }: UpdateTaskVariables) =>
      updateTask(taskId, data),

    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['projects', projectId] })

      const previous = queryClient.getQueryData<ProjectWithTasks>(['projects', projectId])

      queryClient.setQueryData<ProjectWithTasks>(['projects', projectId], (old) => {
        if (old === undefined) return old
        return {
          ...old,
          tasks: old.tasks.map((task) =>
            task.id === taskId ? { ...task, ...data } : task,
          ),
        }
      })

      return { previous }
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
