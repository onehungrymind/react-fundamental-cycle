import { useState } from 'react';
import type { ProjectCardProps, ProjectStatus } from '../types';

// The shape of the object returned by useProjectFilters.
// Declaring an explicit interface (rather than relying on TypeScript inference)
// makes the public API of the hook clear and self-documenting.
interface UseProjectFiltersReturn {
  // The subset of projects that match the current activeFilter.
  filteredProjects: ProjectCardProps[];
  // The currently selected filter value.
  activeFilter: ProjectStatus | 'all';
  // Setter exposed to the consumer — named setFilter rather than setActiveFilter
  // to provide a clean external API that hides the internal state name.
  setFilter: (filter: ProjectStatus | 'all') => void;
  // Per-status counts derived from the full projects array (not the filtered
  // subset).  Used by the filter bar to show counts on each button.
  statusCounts: Record<ProjectStatus | 'all', number>;
}

// useProjectFilters encapsulates all filter-related state and derivations.
//
// Parameters:
//   projects — the full (unfiltered) list of projects from the parent component
//
// Returns an object with filteredProjects, activeFilter, setFilter, and
// statusCounts.  filteredProjects and statusCounts are derived on every render
// rather than stored in state — this avoids stale-state bugs.
//
// Usage:
//   const { filteredProjects, activeFilter, setFilter } = useProjectFilters(projects);

export function useProjectFilters(
  projects: ProjectCardProps[],
): UseProjectFiltersReturn {
  // The only piece of state this hook owns: which filter is active.
  const [activeFilter, setFilter] = useState<ProjectStatus | 'all'>('all');

  // Derive the filtered list on every render — not stored in state.
  // When activeFilter is 'all', return the full list unchanged.
  const filteredProjects: ProjectCardProps[] =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.status === activeFilter);

  // Derive the per-status counts on every render — not stored in state.
  // The explicit type annotation ensures all four keys are always present.
  const statusCounts: Record<ProjectStatus | 'all', number> = {
    all: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    archived: projects.filter((p) => p.status === 'archived').length,
  };

  return { filteredProjects, activeFilter, setFilter, statusCounts };
}
