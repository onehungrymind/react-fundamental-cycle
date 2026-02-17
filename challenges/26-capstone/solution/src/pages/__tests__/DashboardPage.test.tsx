// Tests for Feature 2: DashboardPage
//
// Covers:
//   - Renders stat cards after projects load
//   - Correct counts: total, active, completed, archived
//   - Recently viewed section renders when projectIds are in Redux
//   - Empty state shown when no recently viewed projects

import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../test/utils'
import { DashboardPage } from '../DashboardPage'
import { projects } from '../../mocks/data'

describe('DashboardPage', () => {
  it('renders the heading', async () => {
    renderWithProviders(<DashboardPage />)
    expect(
      await screen.findByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument()
  })

  it('shows loading spinner while data is fetching', () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders stat cards with correct project counts', async () => {
    renderWithProviders(<DashboardPage />)

    const expectedTotal = projects.length
    const expectedActive = projects.filter((p) => p.status === 'active').length
    const expectedCompleted = projects.filter((p) => p.status === 'completed').length
    const expectedArchived = projects.filter((p) => p.status === 'archived').length

    await waitFor(() => {
      // Check all stat card labels are present
      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByText('Archived')).toBeInTheDocument()
    })

    // Check that the stat values match our mock data
    expect(
      screen.getByLabelText(`Total: ${expectedTotal}`),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(`Active: ${expectedActive}`),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(`Completed: ${expectedCompleted}`),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(`Archived: ${expectedArchived}`),
    ).toBeInTheDocument()
  })

  it('shows empty state for recently viewed when no projects have been viewed', async () => {
    renderWithProviders(<DashboardPage />)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /recently viewed/i }),
      ).toBeInTheDocument()
    })

    expect(screen.getByText(/no recently viewed projects/i)).toBeInTheDocument()
  })

  it('renders the All Projects section', async () => {
    renderWithProviders(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('All Projects')).toBeInTheDocument()
    })

    // All projects from mock data should appear
    for (const project of projects) {
      expect(screen.getByText(project.name)).toBeInTheDocument()
    }
  })

  it('project links point to the correct project URL', async () => {
    renderWithProviders(<DashboardPage />)

    await waitFor(() => {
      const websiteLink = screen.getByRole('link', { name: /website redesign/i })
      expect(websiteLink).toHaveAttribute('href', '/projects/proj-1')
    })
  })
})
