import { useState } from 'react';
import type { ProjectCardProps, ProjectStatus } from '../types';

interface UseProjectFiltersReturn {
  filteredProjects: ProjectCardProps[];
  activeFilter: ProjectStatus | 'all';
  setFilter: (filter: ProjectStatus | 'all') => void;
  statusCounts: Record<ProjectStatus | 'all', number>;
}

export function useProjectFilters(
  projects: ProjectCardProps[],
): UseProjectFiltersReturn {
  const [activeFilter, setFilter] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects: ProjectCardProps[] =
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
