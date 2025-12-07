import { motion } from "framer-motion";
import { format, subDays, setHours, setMinutes } from "date-fns";
import { Clock, Trash2, Edit, CheckCircle2, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteTask, updateTask } from "@/lib/taskService";

interface TaskCardProps {
  task: Task;
  index: number;
}

// ---- Date helpers ----

function getLocalDate(dateString: string) {
  const [y, m, d] = dateString.split("-").map(Number);
  // This creates a LOCAL date (no UTC shift)
  return new Date(y, m - 1, d);
}

function getDeadline(dateString: string) {
  const localDate = getLocalDate(dateString);
  const prevDay = subDays(localDate, 1);
  // Deadline: previous day at 23:59
  return setMinutes(setHours(prevDay, 23), 59);
}

// ---- Component ----

export function TaskCard({ task, index }: TaskCardProps) {
  const isCompleted = task.status === "done";

  // compute deadline once, if due_date exists
  const deadline = task.due_date ? getDeadline(task.due_date) : null;

  const now = new Date();
  const isOverdue =
    !!deadline && !isCompleted && deadline < now;

  const priorityVariant =
    task.priority.toLowerCase() as "high" | "medium" | "low";

  const categoryVariant =
    task.category.toLowerCase() as "work" | "personal" | "study";

  const toggleStatus = async () => {
    await updateTask(task.id, {
      status: isCompleted ? "todo" : "done",
    });
    window.location.reload(); // simplest refresh for now
  };

  const deleteTaskNow = async () => {
    await deleteTask(task.id);
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group bg-card rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
        isCompleted && "opacity-60",
        isOverdue && "border-destructive/30 bg-destructive/5"
      )}
    >
      <div className="flex items-start gap-4">
        {/* COMPLETE / UNCOMPLETE BUTTON */}
        <button
          onClick={toggleStatus}
          className="mt-1 flex-shrink-0 transition-colors"
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
          )}
        </button>

        {/* MAIN TASK BLOCK */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3
                className={cn(
                  "font-semibold text-foreground",
                  isCompleted && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>

              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description || "No description"}
              </p>
            </div>

            {/* EDIT + DELETE */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link to={`/tasks/${task.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={deleteTaskNow}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* BADGES */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant={priorityVariant}>{task.priority}</Badge>
            <Badge variant={categoryVariant}>{task.category}</Badge>

            {isOverdue && <Badge variant="destructive">Overdue</Badge>}
          </div>

          {/* DUE DATE */}
          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />

            <span className={cn(isOverdue && "text-destructive")}>
              {deadline
                ? <>
                    {isOverdue ? "Overdue: " : "Due "}
                    {format(deadline, "MMM d, yyyy 'at' h:mm a")}
                  </>
                : "No due date"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
