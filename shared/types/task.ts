export type TaskStatus = "Todo" | "InProgress" | "InReview" | "Done";

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
