import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '../../api/tasks'
import type { ProjectWithTasks } from '../../api/projects'

// ============================================================
// useDeleteTask
//
// Optimistically removes the task from the cache immediately.
// The caller receives a `pendingDelete` state it can use to
// show an undo toast for 3 seconds.
//
// Undo pattern:
//   - onMutate removes the task from cache and returns snapshot
//   - Caller shows toast with "Undo" button for UNDO_WINDOW ms
//   - If undo is clicked: caller calls context.undo() which
//     restores the snapshot via setQueryData
//   - onSettled fires after the server confirms deletion and
//     re-syncs the cache either way
// ============================================================

export const UNDO_WINDOW_MS = 3000

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),

    onMutate: async (taskId) => {
      // 1. Cancel in-flight refetches.
      await queryClient.cancelQueries({ queryKey: ['projects', projectId] })

      // 2. Snapshot for rollback.
      const previous = queryClient.getQueryData<ProjectWithTasks>(['projects', projectId])

      // 3. Optimistically remove the task from the list.
      queryClient.setQueryData<ProjectWithTasks>(['projects', projectId], (old) => {
        if (old === undefined) return old
        return {
          ...old,
          tasks: old.tasks.filter((t) => t.id !== taskId),
          taskCount: Math.max(0, old.taskCount - 1),
        }
      })

      // 4. Expose an undo function via context.
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
