import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ProductivityChartProps {
  data: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
}

export function ProductivityChart({ data }: ProductivityChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-muted rounded-xl p-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-display font-semibold">Weekly Productivity</h2>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "var(--shadow-lg)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            <Bar 
              dataKey="completed" 
              name="Completed"
              fill="hsl(var(--success))" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="created" 
              name="Created"
              fill="hsl(var(--violet))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
