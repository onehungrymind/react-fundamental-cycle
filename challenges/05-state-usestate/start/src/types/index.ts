export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

// TODO: Extract the status union below into a named exported type called
//       ProjectStatus so it can be reused by StatusFilter.tsx:
//
//       export type ProjectStatus = "active" | "completed" | "archived";
//
//       Then update the `status` field in ProjectCardProps to use it:
//
//       status: ProjectStatus;

export interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  taskCount: number;
  dueDate?: string;
}
