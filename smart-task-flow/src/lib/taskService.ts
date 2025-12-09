import { supabase } from "@/lib/supabaseClient";
import type { TaskPriority, TaskCategory, TaskStatus } from "@/types/task";

// CREATE TASK
export async function createTask(
  userId: string,
  task: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    category: TaskCategory;
    due_date: string; // ISO date string
  }
) {
  return await supabase.from("tasks").insert({
    user_id: userId,
    title: task.title,
    description: task.description,
    priority: task.priority.toLowerCase(),
    status: task.status.toLowerCase(),
    category: task.category,
    due_date: task.due_date,
  });
}

// FETCH ALL TASKS OF USER
export async function fetchTasks(userId: string) {
  return await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

// FETCH ONE TASK
export async function fetchTask(id: string) {
  return await supabase.from("tasks").select("*").eq("id", id).single();
}

// UPDATE TASK
export async function updateTask(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    category: TaskCategory;
    due_date: string;
  }>
) {
  // lowercase for DB consistency
  const formattedUpdates = {
    ...updates,
    priority: updates.priority?.toLowerCase(),
    status: updates.status?.toLowerCase(),
  };

  return await supabase.from("tasks").update(formattedUpdates).eq("id", id);
}

// DELETE TASK
export async function deleteTask(id: string) {
  return await supabase.from("tasks").delete().eq("id", id);
}
