import type { Task } from '../types'

// ============================================================
// Mutation fetch functions
//
// These are plain async functions used as the `mutationFn`
// argument to useMutation().  They are separate from the query
// functions in api/projects.ts to keep concerns clear:
//   - projects.ts = read (GET)
//   - tasks.ts    = write (POST, PATCH, DELETE)
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL || '/api'

// POST /api/projects/:projectId/tasks — Create a new task
export async function createTask(
  projectId: string,
  data: Partial<Task>,
): Promise<Task> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Failed to create task: ${res.status}`)
  }
  return res.json() as Promise<Task>
}

// PATCH /api/tasks/:taskId — Update task fields (status, assigneeId, etc.)
export async function updateTask(
  taskId: string,
  data: Partial<Task>,
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Failed to update task: ${res.status}`)
  }
  return res.json() as Promise<Task>
}

// DELETE /api/tasks/:taskId — Delete a task
export async function deleteTask(taskId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error(`Failed to delete task: ${res.status}`)
  }
}
