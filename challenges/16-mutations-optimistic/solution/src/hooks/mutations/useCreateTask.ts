import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '../../api/tasks'
import type { Task } from '../../types'
import type { ProjectWithTasks } from '../../api/projects'

// ============================================================
// useCreateTask
//
// Optimistic pattern:
//   onMutate:   cancel queries → snapshot → add temp task to cache
//   onError:    restore snapshot
//   onSettled:  invalidate to sync with server (gets real ID)
//
// The temp task uses id: `temp-${Date.now()}` so it renders
// immediately in the list. After onSettled invalidates, the
// server's real task (with the canonical ID) replaces it.
// ============================================================

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Task>) => createTask(projectId, data),

    onMutate: async (newTaskData) => {
      // 1. Cancel any in-flight queries for this project so they don't
      //    overwrite our optimistic update.
      await queryClient.cancelQueries({ queryKey: ['projects', projectId] })

      // 2. Snapshot the current cache value for rollback.
      const previous = queryClient.getQueryData<ProjectWithTasks>(['projects', projectId])

      // 3. Optimistically insert the new task.
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

      // 4. Return snapshot as context for onError rollback.
      return { previous }
    },

    onError: (_err, _vars, context) => {
      // Roll back to the snapshot.
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['projects', projectId], context.previous)
      }
    },

    onSettled: () => {
      // Always sync with server — replaces temp ID with real ID.
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
    },
  })
}
