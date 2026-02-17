import type { Project } from '../types'
import type { Task } from '../types'

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@taskflow.dev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'Engineering Lead',
  },
  {
    id: 'tm-2',
    name: 'Marcus Johnson',
    email: 'marcus.j@taskflow.dev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    role: 'Senior Developer',
  },
  {
    id: 'tm-3',
    name: 'Emily Rodriguez',
    email: 'emily.r@taskflow.dev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    role: 'UX Designer',
  },
  {
    id: 'tm-4',
    name: 'David Kim',
    email: 'david.kim@taskflow.dev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    role: 'Full-Stack Developer',
  },
  {
    id: 'tm-5',
    name: 'Lisa Patel',
    email: 'lisa.p@taskflow.dev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    role: 'Product Manager',
  },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description:
      'Complete overhaul of the company website with modern design system and improved performance.',
    status: 'active',
    taskCount: 12,
    dueDate: '2025-03-15',
    createdBy: 'tm-1',
    createdAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'Mobile App MVP',
    description:
      'Build the first version of the mobile app targeting iOS and Android with React Native.',
    status: 'active',
    taskCount: 4,
    dueDate: '2025-06-01',
    createdBy: 'tm-2',
    createdAt: '2025-01-15T14:30:00Z',
  },
  {
    id: 'proj-3',
    name: 'API Migration',
    description:
      'Migrate legacy REST endpoints to GraphQL with improved type safety and documentation.',
    status: 'completed',
    taskCount: 3,
    createdBy: 'tm-1',
    createdAt: '2024-11-01T10:00:00Z',
  },
  {
    id: 'proj-4',
    name: 'Design System',
    description:
      'Create a shared component library with documented patterns, tokens, and accessibility guidelines.',
    status: 'active',
    taskCount: 4,
    dueDate: '2024-12-01',
    createdBy: 'tm-3',
    createdAt: '2024-10-15T08:00:00Z',
  },
  {
    id: 'proj-5',
    name: 'Analytics Dashboard',
    description:
      'Internal dashboard for tracking key product metrics and user engagement data.',
    status: 'archived',
    taskCount: 2,
    createdBy: 'tm-5',
    createdAt: '2024-08-20T11:00:00Z',
  },
];

export const tasks: Task[] = [
  // Website Redesign tasks (proj-1)
  {
    id: 'task-1',
    title: 'Design homepage mockup',
    description: 'Create high-fidelity mockup for the new homepage.',
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
    description: 'Build the main navigation component.',
    status: 'InProgress',
    assigneeId: 'tm-2',
    projectId: 'proj-1',
    dueDate: '2025-02-15',
    createdAt: '2025-01-12T10:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing.',
    status: 'Todo',
    projectId: 'proj-1',
    dueDate: '2025-02-20',
    createdAt: '2025-01-14T11:00:00Z',
  },
  // Mobile App MVP tasks (proj-2)
  {
    id: 'task-13',
    title: 'Set up React Native project',
    description: 'Initialize the React Native project.',
    status: 'Done',
    assigneeId: 'tm-4',
    projectId: 'proj-2',
    createdAt: '2025-01-15T15:00:00Z',
    completedAt: '2025-01-20T17:00:00Z',
  },
  {
    id: 'task-14',
    title: 'Authentication flow',
    description: 'Implement login and signup screens.',
    status: 'InProgress',
    assigneeId: 'tm-2',
    projectId: 'proj-2',
    dueDate: '2025-03-01',
    createdAt: '2025-01-20T09:00:00Z',
  },
];
