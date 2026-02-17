export type ProjectStatus = "active" | "completed" | "archived";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  taskCount: number;
  dueDate?: string;
  createdBy: string;
  createdAt: string;
}
