import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ListTodo
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecommendedTask } from "@/components/dashboard/RecommendedTask";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { getTaskStats, getProductivityData } from "@/utils/smartEngine";
import { useAuth } from "@/contexts/AuthContext";

import { fetchTasks } from "@/lib/taskService";
import type { Task } from "@/types/task";

export default function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from Supabase
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      const { data, error } = await fetchTasks(user.id);

      if (error) {
        console.error("❌ Failed to load tasks:", error);
      } else {
        setTasks(
          data.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            priority: t.priority,        // "high" | "medium" | "low"
            category: t.category,        // "Work" | "Personal" | "Study"
            status: t.status,            // "todo" | "in_progress" | "done"
            due_date: t.due_date,        // FIX: use due_date (snake_case)
            created_at: t.created_at,    // FIX: match interface
          }))
        );
        
      }

      setLoading(false);
    };

    load();
  }, [user]);

  const stats = getTaskStats(tasks);
  console.log(stats.completed);
  console.log(stats.dueToday);
  console.log(stats.overdue);
  console.log(stats.pending);
  
  const productivityData = getProductivityData(tasks);

  const recommendedTask =
  [...tasks]
    .filter((t) => t.status === "in_progress" || t.status === "todo")
    .sort((a, b) => {
      const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };

      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return new Date(a.due_date + "T00:00:00").getTime() -
       new Date(b.due_date + "T00:00:00").getTime();

    })[0] || null;



  return (
    <div className="container py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your productivity and manage tasks efficiently
          </p>
        </div>

        <Link to="/tasks/create">
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Task
          </Button>
        </Link>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          Loading your tasks...
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Due Today"
              value={stats.dueToday}
              icon={CalendarClock}
              variant="primary"
              delay={0}
            />
            <StatCard
              title="Overdue"
              value={stats.overdue}
              icon={AlertTriangle}
              variant="destructive"
              delay={0.1}
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              variant="success"
              delay={0.2}
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              variant="warning"
              delay={0.3}
            />
          </div>

          {/* Recommended Task + Chart */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <RecommendedTask task={recommendedTask} />
            <ProductivityChart data={productivityData} />
          </div>
        </>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="text-lg font-display font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          <Link to="/tasks">
            <Button variant="outline" className="gap-2">
              <ListTodo className="h-4 w-4" />
              View All Tasks
            </Button>
          </Link>

          <Link to="/tasks/create">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Task
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
