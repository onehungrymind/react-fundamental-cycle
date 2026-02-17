import { http, HttpResponse, delay } from 'msw'
import { projects as initialProjects, tasks as initialTasks, teamMembers } from './data'
import type { Project } from '../types'
import type { Task } from '../types'

// Mutable copies — future challenges will add POST/PATCH/DELETE handlers
let projects = [...initialProjects]
let tasks = [...initialTasks]

function randomDelay() {
  return delay(200 + Math.random() * 300)
}

export const handlers = [
  // GET /api/projects — List all projects
  http.get('/api/projects', async () => {
    await randomDelay()
    return HttpResponse.json(projects)
  }),

  // GET /api/projects/:id — Get project with tasks
  http.get('/api/projects/:id', async ({ params }) => {
    await randomDelay()
    const project = projects.find((p) => p.id === params.id)
    if (!project) {
      return new HttpResponse(null, { status: 404 })
    }
    const projectTasks = tasks.filter((t) => t.projectId === params.id)
    return HttpResponse.json({ ...project, tasks: projectTasks })
  }),

  // POST /api/projects — Create project
  http.post('/api/projects', async ({ request }) => {
    await randomDelay()
    const body = (await request.json()) as Partial<Project>
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: body.name ?? 'Untitled Project',
      description: body.description ?? '',
      status: body.status ?? 'active',
      taskCount: 0,
      dueDate: body.dueDate,
      createdBy: body.createdBy ?? 'tm-1',
      createdAt: new Date().toISOString(),
    }
    projects = [...projects, newProject]
    return HttpResponse.json(newProject, { status: 201 })
  }),

  // PATCH /api/projects/:id — Update project
  http.patch('/api/projects/:id', async ({ params, request }) => {
    await randomDelay()
    const body = (await request.json()) as Partial<Project>
    const index = projects.findIndex((p) => p.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    projects = projects.map((p) =>
      p.id === params.id ? { ...p, ...body } : p
    )
    return HttpResponse.json(projects[index])
  }),

  // DELETE /api/projects/:id — Delete project
  http.delete('/api/projects/:id', async ({ params }) => {
    await randomDelay()
    const index = projects.findIndex((p) => p.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    projects = projects.filter((p) => p.id !== params.id)
    tasks = tasks.filter((t) => t.projectId !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),

  // GET /api/projects/:id/tasks — List tasks for project
  http.get('/api/projects/:id/tasks', async ({ params }) => {
    await randomDelay()
    const projectTasks = tasks.filter((t) => t.projectId === params.id)
    return HttpResponse.json(projectTasks)
  }),

  // POST /api/projects/:id/tasks — Create task
  http.post('/api/projects/:id/tasks', async ({ params, request }) => {
    await randomDelay()
    const body = (await request.json()) as Partial<Task>
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: body.title ?? 'Untitled Task',
      description: body.description ?? '',
      status: body.status ?? 'Todo',
      assigneeId: body.assigneeId,
      projectId: params.id as string,
      dueDate: body.dueDate,
      createdAt: new Date().toISOString(),
    }
    tasks = [...tasks, newTask]
    projects = projects.map((p) =>
      p.id === params.id ? { ...p, taskCount: p.taskCount + 1 } : p
    )
    return HttpResponse.json(newTask, { status: 201 })
  }),

  // PATCH /api/tasks/:id — Update task
  http.patch('/api/tasks/:id', async ({ params, request }) => {
    await randomDelay()
    const body = (await request.json()) as Partial<Task>
    const index = tasks.findIndex((t) => t.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    tasks = tasks.map((t) =>
      t.id === params.id ? { ...t, ...body } : t
    )
    const updated = tasks.find((t) => t.id === params.id)
    return HttpResponse.json(updated)
  }),

  // DELETE /api/tasks/:id — Delete task
  http.delete('/api/tasks/:id', async ({ params }) => {
    await randomDelay()
    const task = tasks.find((t) => t.id === params.id)
    if (!task) {
      return new HttpResponse(null, { status: 404 })
    }
    tasks = tasks.filter((t) => t.id !== params.id)
    projects = projects.map((p) =>
      p.id === task.projectId ? { ...p, taskCount: Math.max(0, p.taskCount - 1) } : p
    )
    return new HttpResponse(null, { status: 204 })
  }),

  // GET /api/team — List team members
  http.get('/api/team', async () => {
    await randomDelay()
    return HttpResponse.json(teamMembers)
  }),
]
