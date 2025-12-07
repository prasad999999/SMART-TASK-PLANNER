import { motion } from "framer-motion";
import { Sparkles, Clock, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRecommendationReason, calculateTaskScore, getTaskScoreBreakdown } from "@/utils/smartEngine";
import { format, subDays, setHours, setMinutes } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

interface RecommendedTaskProps {
  task: Task | null;
}

export function RecommendedTask({ task }: RecommendedTaskProps) {
  
  if (!task) {
    return (
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="gradient-bg rounded-xl p-2">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-display font-semibold">Smart Recommendation</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">All tasks completed! Great job!</p>
        </div>
      </motion.div>
    );
  }
  
  const reason = getRecommendationReason(task);
  const breakdown = getTaskScoreBreakdown(task);
  const score = calculateTaskScore(task);

  const priorityVariant = task.priority.toLowerCase() as "high" | "medium" | "low";
  const categoryVariant = task.category.toLowerCase() as "work" | "personal" | "study";

  // ⭐ Convert due_date → previous day 23:59 (deadline)
  const getDeadline = () => {
    // Parse safely as LOCAL date (NO UTC SHIFT)
    const [year, month, day] = task.due_date.split("-").map(Number);
    const localDate = new Date(year, month - 1, day);
    console.log(localDate+"localdate");
  
    // Deadline = previous day at 23:59
    const prevDay = subDays(localDate, 1);
    const endOfDay = setMinutes(setHours(prevDay, 23), 59);
  
    return endOfDay;
  };
  

  const deadline = getDeadline();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 gradient-bg opacity-10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="gradient-bg rounded-xl p-2">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-display font-semibold">Smart Recommendation</h2>
          </div>

          <Badge variant="default" className="gradient-bg border-0">
            Score: {score}
          </Badge>
          <Popover>
    <PopoverTrigger>
      <button className="text-muted-foreground hover:text-foreground">
        <Info className="h-4 w-4" />
      </button>
    </PopoverTrigger>

    <PopoverContent className="w-72 text-sm">
      <p className="font-semibold mb-2">How scores work</p>

      <p className="font-medium">Priority Weights:</p>
      <ul className="ml-4 list-disc text-muted-foreground mb-2">
        <li>High = 3</li>
        <li>Medium = 2</li>
        <li>Low = 1</li>
      </ul>

      <p className="font-medium">Urgency Weights:</p>
      <ul className="ml-4 list-disc text-muted-foreground mb-2">
        <li>Overdue = +5</li>
        <li>Due Today (&lt;24h) = +3</li>
        <li>Due in 1–3 days = +2</li>
        <li>Due This Week (&lt;7 days) = +1</li>
        <li>Later = +0</li>
      </ul>

      <p className="mt-2 font-medium">
        Final Score = Priority Weight + Urgency Weight
      </p>
    </PopoverContent>
  </Popover>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-lg mb-2">{task.title}</h3>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant={priorityVariant}>{task.priority}</Badge>
            <Badge variant={categoryVariant}>{task.category}</Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {/* ⭐ Display deadline: previous day @ 11:59 PM */}
              Due {format(deadline, "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Why this task?</span> {reason}
            

          </p>

          <Link to={`/tasks/${task.id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              View <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
