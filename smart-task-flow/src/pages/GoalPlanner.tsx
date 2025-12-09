import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, CalendarDays, Clock } from "lucide-react";

export default function GoalPlanner() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  
  const generatePlan = async () => {
    if (!goal.trim()) return;

    setLoading(true);
    setPlan(null);


    const res = await fetch(`${API_URL}/api/generate-plan`, {
    
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal }),
    });

    const data = await res.json();
    setPlan(data);
    setLoading(false);
  };

  return (
    <div className="container py-10 max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl font-display font-bold mb-4 text-center"
      >
        AI Goal Planner
      </motion.h1>


      <p className="text-muted-foreground mb-8 text-lg">
        Transform your goal into a structured, timeline-based execution plan powered by AI.
      </p>

      {/* Goal Input */}
      <Textarea
        placeholder="e.g. Launch a product in 2 weeks"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="min-h-[130px] mb-4 text-lg"
      />

      <Button
        onClick={generatePlan}
        disabled={loading}
        variant="gradient"
        className="gap-2 w-full py-6 text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating Your Plan...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Generate Plan
          </>
        )}
      </Button>

      {/* AI Result */}
      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6 mt-10"
        >
          <h2 className="text-2xl font-display font-semibold mb-6">
            Suggested Task Plan
          </h2>

          {/* Timeline List */}
          <div className="relative border-l border-muted pl-6">
            {plan.tasks.map((task: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="mb-6 relative"
              >
                {/* <div className="absolute -left-[14px] top-2 w-3 h-3 rounded-full bg-primary shadow-md" /> */}

                <div className="border rounded-xl p-4 bg-background shadow-sm hover:shadow-md transition-all">
                  <p className="font-bold text-lg mb-2">{task.title}</p>

                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Clock className="h-4 w-4" />
                    Duration: {task.duration_days} days
                  </div>

                  {task.start_date && task.end_date && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <CalendarDays className="h-4 w-4" />
                      {task.start_date} → {task.end_date}
                    </div>
                  )}

                  {task.depends_on && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Depends on:</span>{" "}
                      {task.depends_on}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
