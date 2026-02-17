export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  taskCount: number;
  dueDate?: string;
}
