import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckSquare, 
  Sparkles, 
  BarChart3, 
  Clock, 
  ArrowRight,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description: "AI-powered task prioritization based on deadlines and importance",
  },
  {
    icon: BarChart3,
    title: "Productivity Analytics",
    description: "Track your progress with beautiful charts and insights",
  },
  {
    icon: Clock,
    title: "Smart Deadlines",
    description: "Never miss a deadline with intelligent reminders",
  },
];

const stats = [
  { value: "10x", label: "More Productive" },
  { value: "50%", label: "Time Saved" },
  { value: "100%", label: "Task Clarity" },
];

export default function Landing() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Checking your session...
      </div>
    );
  }
  // Decide where buttons should take the user
  const goToDashboard = user ? "/dashboard" : "/auth";
  const goToTasks = user ? "/tasks" : "/auth";
  const createTask = user ? "/tasks/create" : "/auth";
  
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="container py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="gradient-bg rounded-lg p-2">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">TaskFlow</span>
          </div>

          <div className="flex items-center gap-4">

            {/* 👇 FIXED BUTTONS */}
            <Link to={goToDashboard}>
              <Button variant="ghost">Dashboard</Button>
            </Link>

            <Link to={createTask}>
              <Button variant="gradient">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container relative py-20 lg:py-32">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue/20 rounded-full blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border mb-8">
              <Zap className="h-4 w-4 text-violet" />
              <span className="text-sm font-medium">Smart Task Management</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
              Plan Smarter,{" "}
              <span className="gradient-text">Achieve More</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              TaskFlow uses intelligent algorithms to prioritize your tasks, 
              helping you focus on what matters most. Boost your productivity 
              with smart recommendations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={goToDashboard}>
                <Button variant="hero" size="xl" className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link to={goToTasks}>
                <Button variant="outline" size="xl">
                  View Tasks
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to manage tasks effectively and boost your productivity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6 group hover:shadow-glow transition-all duration-300"
            >
              <div className="gradient-bg rounded-xl p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="gradient-bg p-12 sm:p-16 text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground mb-4">
                Ready to boost your productivity?
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Start organizing your tasks today and experience the power of smart task management.
              </p>
              <Link to="/tasks/create">
                <Button 
                  size="xl" 
                  className="bg-background text-foreground hover:bg-background/90 shadow-xl"
                >
                  Create Your First Task
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container py-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="gradient-bg rounded-lg p-1.5">
              <CheckSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">TaskFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 TaskFlow. Built with modern technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
