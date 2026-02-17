import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/utils'
import { server } from '../../mocks/server'
import { http, HttpResponse } from 'msw'
import { ProjectDetailPanel } from '../ProjectDetailPanel'
import type { ProjectWithTasks } from '../../api/projects'

const MOCK_PROJECT: ProjectWithTasks = {
  id: 'proj-1',
  name: 'Alpha Project',
  description: 'Test project',
  status: 'active',
  taskCount: 2,
  createdAt: new Date().toISOString(),
  tasks: [
    {
      id: 'task-1',
      projectId: 'proj-1',
      title: 'Write tests',
      description: '',
      status: 'Todo',
      createdAt: new Date().toISOString(),
    },
  ],
}

describe('ProjectDetailPanel', () => {
  it('renders the project title after loading', async () => {
    server.use(
      http.get('/api/projects/proj-1', () =>
        HttpResponse.json(MOCK_PROJECT),
      ),
    );

    renderWithProviders(
      <ProjectDetailPanel />,
      { route: '/projects/proj-1', path: '/projects/:projectId' },
    );

    const heading = await screen.findByRole('heading', { name: 'Alpha Project' });
    expect(heading).toBeInTheDocument();
  });

  it('renders the status badge', async () => {
    server.use(
      http.get('/api/projects/proj-1', () =>
        HttpResponse.json(MOCK_PROJECT),
      ),
    );

    renderWithProviders(
      <ProjectDetailPanel />,
      { route: '/projects/proj-1', path: '/projects/:projectId' },
    );

    const badge = await screen.findByText('active');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('status-badge--active');
  });

  it('shows error message on API failure', async () => {
    server.use(
      http.get('/api/projects/proj-1', () =>
        HttpResponse.json({ message: 'Not found' }, { status: 404 }),
      ),
    );

    renderWithProviders(
      <ProjectDetailPanel />,
      { route: '/projects/proj-1', path: '/projects/:projectId' },
    );

    const errorEl = await screen.findByRole('alert');
    expect(errorEl).toBeInTheDocument();
  });
});
