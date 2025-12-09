import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckSquare, LayoutDashboard, ListTodo, Plus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/goal-planner", label: "Goal Planner", icon: Sparkles }, // ⭐ Better UX
];


export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  // Avatar initials
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  // FIX: Proper logout navigation
  const handleLogout = async () => {
    await logout();
    navigate("/auth"); // redirect after logout
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        
        {/* LEFT SIDE: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="gradient-bg rounded-lg p-2">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">TaskFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* Create Task Button */}
          <Link to="/tasks/create">
            <Button variant="gradient" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </Link>

          {/* If not logged in */}
          {!user && (
            <Link to="/auth">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          )}

          {/* If logged in → Avatar Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full px-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">
                    {initials}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {profile?.name || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 text-sm">
                  <p className="font-semibold">{profile?.name}</p>
                  <p className="text-muted-foreground text-xs">{user.email}</p>
                </div>

                <DropdownMenuSeparator />

                {/* FIX: handleLogout instead of logout */}
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

        </div>
      </div>
    </header>
  );
}
