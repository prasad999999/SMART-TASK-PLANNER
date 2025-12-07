import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/tasks/TaskForm";

export default function TaskCreate() {
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

        <h1 className="text-3xl font-display font-bold">Create New Task</h1>
        <p className="text-muted-foreground mt-1">
          Add a new task to your list
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6"
      >
        <TaskForm />
      </motion.div>
    </div>
  );
}
