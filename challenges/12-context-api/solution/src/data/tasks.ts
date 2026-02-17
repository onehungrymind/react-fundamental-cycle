import type { Task } from '../types'

export const TASKS: Task[] = [
  // ---- Website Redesign (proj-1) ----
  {
    id: 'task-1',
    title: 'Design homepage mockup',
    description:
      'Create high-fidelity mockup for the new homepage including hero section, features grid, and testimonials.',
    status: 'Done',
    assigneeId: 'tm-3',
    projectId: 'proj-1',
    dueDate: '2025-02-01',
    createdAt: '2025-01-10T09:30:00Z',
    completedAt: '2025-01-28T16:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Implement responsive navigation',
    description:
      'Build the main navigation component with mobile hamburger menu and desktop dropdown.',
    status: 'InProgress',
    assigneeId: 'tm-2',
    projectId: 'proj-1',
    dueDate: '2025-02-15',
    createdAt: '2025-01-12T10:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Set up CI/CD pipeline',
    description:
      'Configure GitHub Actions for automated testing, building, and deployment to staging.',
    status: 'Todo',
    projectId: 'proj-1',
    dueDate: '2025-02-20',
    createdAt: '2025-01-14T11:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Performance audit',
    description:
      'Run Lighthouse audits and identify top performance bottlenecks. Target 90+ scores.',
    status: 'Todo',
    assigneeId: 'tm-4',
    projectId: 'proj-1',
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'task-5',
    title: 'Content migration',
    description:
      'Migrate existing blog posts and documentation to the new CMS structure.',
    status: 'InReview',
    assigneeId: 'tm-5',
    projectId: 'proj-1',
    dueDate: '2025-02-28',
    createdAt: '2025-01-16T14:00:00Z',
  },
  // ---- Mobile App MVP (proj-2) ----
  {
    id: 'task-6',
    title: 'Set up React Native project',
    description:
      'Initialize the React Native project with TypeScript, navigation, and state management.',
    status: 'Done',
    assigneeId: 'tm-4',
    projectId: 'proj-2',
    createdAt: '2025-01-15T15:00:00Z',
    completedAt: '2025-01-20T17:00:00Z',
  },
  {
    id: 'task-7',
    title: 'Authentication flow',
    description:
      'Implement login, signup, and password reset screens with biometric authentication support.',
    status: 'InProgress',
    assigneeId: 'tm-2',
    projectId: 'proj-2',
    dueDate: '2025-03-01',
    createdAt: '2025-01-20T09:00:00Z',
  },
  {
    id: 'task-8',
    title: 'Push notification system',
    description:
      'Integrate Firebase Cloud Messaging for push notifications on both platforms.',
    status: 'Todo',
    projectId: 'proj-2',
    dueDate: '2025-04-01',
    createdAt: '2025-01-22T10:00:00Z',
  },
  {
    id: 'task-9',
    title: 'Offline data sync',
    description:
      'Implement offline-first architecture with local database and background sync.',
    status: 'Todo',
    assigneeId: 'tm-4',
    projectId: 'proj-2',
    dueDate: '2025-05-01',
    createdAt: '2025-01-25T11:00:00Z',
  },
]

export const ASSIGNEE_NAMES: Record<string, string> = {
  'tm-1': 'Sarah Chen',
  'tm-2': 'Marcus Johnson',
  'tm-3': 'Emily Rodriguez',
  'tm-4': 'David Kim',
  'tm-5': 'Lisa Patel',
}
