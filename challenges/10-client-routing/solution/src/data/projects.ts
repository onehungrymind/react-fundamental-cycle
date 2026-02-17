import type { ProjectCardProps } from '../types'

// INITIAL_PROJECTS is the shared seed data for the app.
//
// Keeping it in a separate module (rather than inside a component) lets both
// ProjectListPage (which copies it into useState) and ProjectDetailPage (which
// searches it by ID) import the same source of truth without circular
// dependencies.
//
// In a later challenge this constant will be replaced by a shared context so
// that newly added projects are visible on the detail page immediately.

export const INITIAL_PROJECTS: ProjectCardProps[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design principles, improved accessibility, and responsive layouts.',
    status: 'active',
    taskCount: 5,
    dueDate: '2025-03-15',
  },
  {
    id: 'proj-2',
    name: 'Mobile App MVP',
    description: 'Build the first version of the mobile app targeting iOS and Android using React Native.',
    status: 'active',
    taskCount: 4,
    dueDate: '2025-06-01',
  },
  {
    id: 'proj-3',
    name: 'API Migration',
    description: 'Migrate legacy REST endpoints to GraphQL for improved developer experience and reduced over-fetching.',
    status: 'completed',
    taskCount: 3,
  },
  {
    id: 'proj-4',
    name: 'Design System',
    description: 'Create a shared component library with documented patterns, accessibility baked in, and Storybook integration.',
    status: 'active',
    taskCount: 4,
    dueDate: '2024-12-01',
  },
  {
    id: 'proj-5',
    name: 'Analytics Dashboard',
    description: 'Internal dashboard for tracking key product metrics including retention, activation, and revenue.',
    status: 'archived',
    taskCount: 2,
  },
]
