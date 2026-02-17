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

// ProjectFormData mirrors the shape of the "Add Project" form's fields.
export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
}

// FormErrors holds optional error messages for each validated field.
export interface FormErrors {
  name?: string;
  description?: string;
}

// Task types — added in Challenge 11 (master-detail pattern).
export type TaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  projectId: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}
