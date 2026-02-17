export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  taskCount: number;
  dueDate?: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
}

export interface FormErrors {
  name?: string;
  description?: string;
}

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
