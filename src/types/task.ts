export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
  category: "Work" | "Personal" | "Study";
  due_date: string | null;
  created_at: string;
}

export type TaskPriority = Task["priority"];
export type TaskCategory = Task["category"];
export type TaskStatus = Task["status"];

export interface TaskFilters {
  priority: TaskPriority | "ALL";
  category: TaskCategory | "ALL";
  deadline: "ALL" | "TODAY" | "THIS_WEEK";
}

export type TaskSortBy = "due_date" | "priority" | "created_at";
export type SortOrder = "asc" | "desc";
