import { useState } from 'react';
import type { ProjectStatus } from '../types';

interface UseProjectFiltersReturn<T extends { status: ProjectStatus }> {
  filteredProjects: T[];
  activeFilter: ProjectStatus | 'all';
  setFilter: (filter: ProjectStatus | 'all') => void;
  statusCounts: Record<ProjectStatus | 'all', number>;
}

export function useProjectFilters<T extends { status: ProjectStatus }>(
  projects: T[],
): UseProjectFiltersReturn<T> {
  const [activeFilter, setFilter] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects: T[] =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.status === activeFilter);

  const statusCounts: Record<ProjectStatus | 'all', number> = {
    all: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    archived: projects.filter((p) => p.status === 'archived').length,
  };

  return { filteredProjects, activeFilter, setFilter, statusCounts };
}
