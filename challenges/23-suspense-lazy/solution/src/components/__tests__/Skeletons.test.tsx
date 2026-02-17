// Challenge 23 — Suspense & Lazy Loading
//
// Tests for skeleton loader components.
//
// These tests verify that:
//   1. Each skeleton renders without errors
//   2. Skeletons have accessible aria-label attributes so screen readers
//      announce loading state
//   3. Skeleton shapes are present (the .skeleton CSS class is applied)
//
// Skeletons are pure presentational components — no props, no logic.
// We just render them and assert on aria attributes and DOM structure.

import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/utils'
import { ProjectDetailSkeleton } from '../skeletons/ProjectDetailSkeleton'
import { FormSkeleton } from '../skeletons/FormSkeleton'
import { PageSkeleton } from '../skeletons/PageSkeleton'

describe('ProjectDetailSkeleton', () => {
  it('renders without errors', () => {
    const { container } = renderWithProviders(<ProjectDetailSkeleton />)
    expect(container.firstChild).not.toBeNull()
  })

  it('has an aria-hidden attribute to hide from screen readers', () => {
    const { container } = renderWithProviders(<ProjectDetailSkeleton />)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
  })

  it('has an aria-label describing the loading state', () => {
    const { container } = renderWithProviders(<ProjectDetailSkeleton />)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveAttribute('aria-label', 'Loading project...')
  })

  it('renders skeleton shape elements', () => {
    const { container } = renderWithProviders(<ProjectDetailSkeleton />)
    // Should contain at least one .skeleton element (the shimmer shapes)
    const skeletonEls = container.querySelectorAll('.skeleton')
    expect(skeletonEls.length).toBeGreaterThan(0)
  })

  it('renders 4 task card skeleton shapes', () => {
    const { container } = renderWithProviders(<ProjectDetailSkeleton />)
    const cards = container.querySelectorAll('.skeleton-card')
    expect(cards.length).toBe(4)
  })
})

describe('FormSkeleton', () => {
  it('renders without errors', () => {
    const { container } = renderWithProviders(<FormSkeleton />)
    expect(container.firstChild).not.toBeNull()
  })

  it('has an aria-hidden attribute', () => {
    const { container } = renderWithProviders(<FormSkeleton />)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
  })

  it('has an aria-label describing the loading state', () => {
    const { container } = renderWithProviders(<FormSkeleton />)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveAttribute('aria-label', 'Loading form...')
  })

  it('renders skeleton shape elements', () => {
    const { container } = renderWithProviders(<FormSkeleton />)
    const skeletonEls = container.querySelectorAll('.skeleton')
    expect(skeletonEls.length).toBeGreaterThan(0)
  })
})

describe('PageSkeleton', () => {
  it('renders without errors', () => {
    const { container } = renderWithProviders(<PageSkeleton />)
    expect(container.firstChild).not.toBeNull()
  })

  it('has an aria-hidden attribute', () => {
    const { container } = renderWithProviders(<PageSkeleton />)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
  })

  it('has an aria-label describing the loading state', () => {
    const { container } = renderWithProviders(<PageSkeleton />)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveAttribute('aria-label', 'Loading page...')
  })

  it('renders skeleton shape elements', () => {
    const { container } = renderWithProviders(<PageSkeleton />)
    const skeletonEls = container.querySelectorAll('.skeleton')
    expect(skeletonEls.length).toBeGreaterThan(0)
  })

  it('renders 6 card skeleton shapes', () => {
    const { container } = renderWithProviders(<PageSkeleton />)
    const cards = container.querySelectorAll('.skeleton-card')
    expect(cards.length).toBe(6)
  })
})
