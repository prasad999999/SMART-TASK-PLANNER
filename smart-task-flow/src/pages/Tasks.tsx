import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { fetchTasks } from "@/lib/taskService";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

import type { Task, TaskFilters as TaskFiltersType, TaskSortBy } from "@/types/task";

export default function Tasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // NEW — filter + sort UI state
  const [filters, setFilters] = useState<TaskFiltersType>({
    priority: "ALL",
    category: "ALL",
    deadline: "ALL",
  });

  const [sortBy, setSortBy] = useState<TaskSortBy>("due_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Load tasks
  useEffect(() => {
    if (!user) return;
   
    loadTasks();
  }, [user]);

  const loadTasks = async () => {
    setLoading(true);
    const { data, error } = await fetchTasks(user!.id);
    if (!error) setTasks(data || []);
    setLoading(false);
  };


  // -----------------------------
  // APPLY FILTERS
  // -----------------------------
  const filteredTasks = tasks.filter((task) => {
    // Priority
    if (filters.priority !== "ALL" && task.priority !== filters.priority) return false;

    // Category
    if (filters.category !== "ALL" && task.category !== filters.category) return false;

    // Deadline
    if (filters.deadline === "TODAY") {
      const today = new Date().toISOString().split("T")[0];
      if (task.due_date !== today) return false;
    }

    if (filters.deadline === "THIS_WEEK") {
      const now = new Date();
      const weekLater = new Date();
      weekLater.setDate(now.getDate() + 7);

      const taskDate = task.due_date ? new Date(task.due_date) : null;
      if (!taskDate) return false;

      if (!(taskDate >= now && taskDate <= weekLater)) return false;
    }

    return true;
  });


  // -----------------------------
  // APPLY SORTING
  // -----------------------------
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let valA: any = a[sortBy];
    let valB: any = b[sortBy];

    // Convert dates to timestamps
    if (sortBy === "due_date" || sortBy === "created_at") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (sortBy === "priority") {
      const priorityOrder: any = { high: 1, medium: 2, low: 3 };
      valA = priorityOrder[a.priority];
      valB = priorityOrder[b.priority];
    }

    return sortOrder === "asc" ? valA - valB : valB - valA;
  });


  if (loading)
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading tasks...</p>
      </div>
    );

  return (
    <div className="container py-8">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-3xl font-display font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {sortedTasks.length} task{sortedTasks.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Link to="/tasks/create">
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-4 mb-6"
      >
        <TaskFilters
          filters={filters}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onFiltersChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
        />
      </motion.div>

      {/* Task List */}
      {sortedTasks.length > 0 ? (
        <div className="space-y-3">
          {sortedTasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <div className="bg-muted rounded-full p-4 w-fit mx-auto mb-4">
            <ListTodo className="h-8 w-8 text-muted-foreground" />
          </div>

          <h3 className="text-xl font-display font-semibold mb-2">
            No tasks found
          </h3>

          <p className="text-muted-foreground mb-6">
            Try adjusting filters or create your first task!
          </p>

          <Link to="/tasks/create">
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
