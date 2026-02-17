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

// NOTE FOR CHALLENGE 19:
// proj-1 has 12 tasks intentionally to make the performance problem visible.
// When you type in the search input, ALL 12 TaskItem components re-render on
// every keystroke — even those whose data hasn't changed.
// Open React DevTools Profiler and record while typing to see the flame graph.

export const tasks: Task[] = [
  // Website Redesign tasks (proj-1) — 12 tasks to make the problem visible
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
  {
    id: 'task-6',
    title: 'Accessibility audit',
    description:
      'Audit all pages for WCAG 2.1 AA compliance. Fix contrast ratios, missing ARIA labels, and keyboard traps.',
    status: 'Todo',
    assigneeId: 'tm-3',
    projectId: 'proj-1',
    dueDate: '2025-03-01',
    createdAt: '2025-01-17T09:00:00Z',
  },
  {
    id: 'task-7',
    title: 'SEO metadata setup',
    description:
      'Add meta tags, Open Graph, Twitter cards, and structured data for all key pages.',
    status: 'Todo',
    projectId: 'proj-1',
    dueDate: '2025-03-05',
    createdAt: '2025-01-18T10:00:00Z',
  },
  {
    id: 'task-8',
    title: 'Image optimisation pipeline',
    description:
      'Set up automated image conversion to WebP/AVIF and lazy loading for all media.',
    status: 'InProgress',
    assigneeId: 'tm-4',
    projectId: 'proj-1',
    dueDate: '2025-02-25',
    createdAt: '2025-01-19T11:00:00Z',
  },
  {
    id: 'task-9',
    title: 'Analytics integration',
    description:
      'Integrate analytics provider and configure event tracking for key user actions.',
    status: 'Todo',
    assigneeId: 'tm-5',
    projectId: 'proj-1',
    dueDate: '2025-03-10',
    createdAt: '2025-01-20T14:00:00Z',
  },
  {
    id: 'task-10',
    title: 'Error page designs',
    description:
      'Design and implement custom 404 and 500 error pages consistent with the new design system.',
    status: 'Done',
    assigneeId: 'tm-3',
    projectId: 'proj-1',
    createdAt: '2025-01-21T09:00:00Z',
    completedAt: '2025-01-30T15:00:00Z',
  },
  {
    id: 'task-11',
    title: 'Cookie consent banner',
    description:
      'Implement GDPR-compliant cookie consent banner with granular preference controls.',
    status: 'Todo',
    projectId: 'proj-1',
    dueDate: '2025-03-12',
    createdAt: '2025-01-22T10:00:00Z',
  },
  {
    id: 'task-12',
    title: 'Cross-browser testing',
    description:
      'Test all pages in Chrome, Firefox, Safari, and Edge. Fix layout issues and polyfill gaps.',
    status: 'Todo',
    assigneeId: 'tm-2',
    projectId: 'proj-1',
    dueDate: '2025-03-14',
    createdAt: '2025-01-23T11:00:00Z',
  },
  // Mobile App MVP tasks (proj-2)
  {
    id: 'task-13',
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
    id: 'task-14',
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
    id: 'task-15',
    title: 'Push notification system',
    description:
      'Integrate Firebase Cloud Messaging for push notifications on both platforms.',
    status: 'Todo',
    projectId: 'proj-2',
    dueDate: '2025-04-01',
    createdAt: '2025-01-22T10:00:00Z',
  },
  {
    id: 'task-16',
    title: 'Offline data sync',
    description:
      'Implement offline-first architecture with local database and background sync.',
    status: 'Todo',
    assigneeId: 'tm-4',
    projectId: 'proj-2',
    dueDate: '2025-05-01',
    createdAt: '2025-01-25T11:00:00Z',
  },
  // API Migration tasks (proj-3)
  {
    id: 'task-17',
    title: 'Schema design',
    description: 'Design the GraphQL schema with types, queries, and mutations.',
    status: 'Done',
    assigneeId: 'tm-1',
    projectId: 'proj-3',
    createdAt: '2024-11-01T10:30:00Z',
    completedAt: '2024-11-15T16:00:00Z',
  },
  {
    id: 'task-18',
    title: 'Resolver implementation',
    description:
      'Implement resolvers for all GraphQL operations with proper error handling.',
    status: 'Done',
    assigneeId: 'tm-2',
    projectId: 'proj-3',
    createdAt: '2024-11-10T09:00:00Z',
    completedAt: '2024-12-01T15:00:00Z',
  },
  {
    id: 'task-19',
    title: 'Client migration',
    description:
      'Update all frontend API calls from REST to GraphQL with Apollo Client.',
    status: 'Done',
    assigneeId: 'tm-4',
    projectId: 'proj-3',
    createdAt: '2024-11-20T10:00:00Z',
    completedAt: '2024-12-15T17:00:00Z',
  },
  // Design System tasks (proj-4)
  {
    id: 'task-20',
    title: 'Design token specification',
    description:
      'Define colors, spacing, typography, and breakpoint tokens for the design system.',
    status: 'Done',
    assigneeId: 'tm-3',
    projectId: 'proj-4',
    createdAt: '2024-10-15T09:00:00Z',
    completedAt: '2024-10-30T16:00:00Z',
  },
  {
    id: 'task-21',
    title: 'Button component variants',
    description:
      'Build primary, secondary, ghost, and danger button variants with all states.',
    status: 'InProgress',
    assigneeId: 'tm-3',
    projectId: 'proj-4',
    dueDate: '2024-11-15',
    createdAt: '2024-10-20T10:00:00Z',
  },
  {
    id: 'task-22',
    title: 'Form input components',
    description:
      'Build text input, select, checkbox, and radio components with validation states.',
    status: 'InReview',
    assigneeId: 'tm-4',
    projectId: 'proj-4',
    dueDate: '2024-11-20',
    createdAt: '2024-10-25T11:00:00Z',
  },
  {
    id: 'task-23',
    title: 'Storybook documentation',
    description:
      'Set up Storybook with stories for each component showing all variants and states.',
    status: 'Todo',
    projectId: 'proj-4',
    dueDate: '2024-12-01',
    createdAt: '2024-10-28T09:00:00Z',
  },
  // Analytics Dashboard tasks (proj-5)
  {
    id: 'task-24',
    title: 'Dashboard layout',
    description:
      'Design and implement the main dashboard grid layout with responsive card containers.',
    status: 'Done',
    assigneeId: 'tm-3',
    projectId: 'proj-5',
    createdAt: '2024-08-20T11:30:00Z',
    completedAt: '2024-09-05T16:00:00Z',
  },
  {
    id: 'task-25',
    title: 'Chart components',
    description:
      'Integrate charting library and build line, bar, and pie chart components.',
    status: 'Done',
    assigneeId: 'tm-4',
    projectId: 'proj-5',
    createdAt: '2024-08-25T10:00:00Z',
    completedAt: '2024-09-20T15:00:00Z',
  },
];
