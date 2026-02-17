import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '../../api/tasks'
import type { Task } from '../../types'
import type { ProjectWithTasks } from '../../api/projects'

// ============================================================
// useUpdateTask
//
// Used for both status changes and assignee changes.
// Same optimistic pattern: snapshot → update → rollback on error.
//
// The projectId is needed to know which cache entry to update.
// ============================================================

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
      // 1. Prevent stale refetch from overwriting our optimistic update.
      await queryClient.cancelQueries({ queryKey: ['projects', projectId] })

      // 2. Snapshot for rollback.
      const previous = queryClient.getQueryData<ProjectWithTasks>(['projects', projectId])

      // 3. Optimistically update the task in the cache.
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
