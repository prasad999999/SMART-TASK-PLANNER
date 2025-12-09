import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: "default" | "primary" | "warning" | "success" | "destructive";
  delay?: number;
}

const variantStyles: Record<string, string> = {
  default: "bg-card border-border",
  primary: "bg-primary/10 border-primary/20",
  warning: "bg-yellow-100/50 border-yellow-300/40",
  success: "bg-green-100/50 border-green-300/40",
  destructive: "bg-red-100/50 border-red-300/40",
};

const iconStyles: Record<string, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  warning: "bg-yellow-200/40 text-yellow-700",
  success: "bg-green-200/40 text-green-700",
  destructive: "bg-red-200/40 text-red-700",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn(
        "rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md",
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between">
        {/* Text */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-display mt-1">{value}</p>
        </div>

        {/* Icon */}
        <div className={cn("rounded-xl p-3", iconStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
