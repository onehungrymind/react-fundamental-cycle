export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

// ProjectStatus is a named union type so it can be shared across components.
export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  taskCount: number;
  dueDate?: string;
}

// TODO: Add ProjectFormData and FormErrors types here.
// ProjectFormData should mirror the four form fields: name, description,
// status (ProjectStatus), and dueDate (string).
// FormErrors should have optional name? and description? string fields.
