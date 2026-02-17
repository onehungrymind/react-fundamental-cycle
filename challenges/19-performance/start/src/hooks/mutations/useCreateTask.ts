import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '../../api/tasks'
import type { Task } from '../../types'
import type { ProjectWithTasks } from '../../api/projects'

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Task>) => createTask(projectId, data),

    onMutate: async (newTaskData) => {
      await queryClient.cancelQueries({ queryKey: ['projects', projectId] })

      const previous = queryClient.getQueryData<ProjectWithTasks>(['projects', projectId])

      queryClient.setQueryData<ProjectWithTasks>(['projects', projectId], (old) => {
        if (old === undefined) return old
        const optimisticTask: Task = {
          id: `temp-${Date.now()}`,
          title: newTaskData.title ?? 'New Task',
          description: newTaskData.description ?? '',
          status: 'Todo',
          projectId,
          createdAt: new Date().toISOString(),
          ...newTaskData,
        }
        return {
          ...old,
          tasks: [...old.tasks, optimisticTask],
          taskCount: old.taskCount + 1,
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
