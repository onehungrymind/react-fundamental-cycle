export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

// ProjectStatus is extracted as a named type so it can be shared between
// ProjectCardProps and StatusFilter's prop types.
export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  taskCount: number;
  dueDate?: string;
}
