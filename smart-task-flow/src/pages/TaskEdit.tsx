import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/tasks/TaskForm";
import { supabase } from "@/lib/supabaseClient";

export default function TaskEdit() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTask() {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setTask(data);
      setLoading(false);
    }

    loadTask();
  }, [id]);

  if (loading) return <p className="p-6">Loading task...</p>;
  if (!task) return <p className="p-6">Task not found.</p>;

  return (
    <div className="container py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link to="/tasks">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Button>
        </Link>
        <h1 className="text-3xl font-display font-bold">Edit Task</h1>
        <p className="text-muted-foreground mt-1">
          Update your task details
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6"
      >
        <TaskForm task={task} isEditing />
      </motion.div>
    </div>
  );
}
