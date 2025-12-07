import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, CheckSquare } from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!" });
        navigate("/dashboard");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      
      // Insert profile even though user is not yet confirmed
      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          name: name,
        });
      }
      
      // ✔ Correct toast
      toast({
        title: "Verify your email",
        description: "We've sent a confirmation link to your inbox.",
      });
      
      // ❌ Do not redirect to dashboard
      navigate("/auth");    // or stay on signup page
      
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background blur effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="bg-gradient-to-br from-primary to-purple-600 p-2 rounded-xl">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold">TaskFlow</span>
          </div>
          <p className="text-muted-foreground">Smart Task Planner</p>
        </div>

        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
          <CardContent>
            <Tabs defaultValue={mode} value={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
              
              {/* Tabs Header MUST be inside Tabs */}
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        required
                        className="pl-10"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        required
                        className="pl-10"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Please wait..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              {/* SIGNUP */}
              <TabsContent value="signup">
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div>
                    <Label>Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        required
                        className="pl-10"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        required
                        className="pl-10"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        required
                        className="pl-10"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Please wait..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
