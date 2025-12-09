import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";  // ⬅ NEW
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import TaskCreate from "./pages/TaskCreate";
import TaskEdit from "./pages/TaskEdit";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "@/contexts/AuthContext";  // ⬅ NEW
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"; // ⬅ NEW
import GoalPlanner from "./pages/GoalPlanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* PROTECTED ROUTES */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/create" element={<TaskCreate />} />
                <Route path="/tasks/:id" element={<TaskEdit />} />
                <Route path="/goal-planner" element={<GoalPlanner />} />

              </Route>
            </Route>

            {/* NOT FOUND */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
