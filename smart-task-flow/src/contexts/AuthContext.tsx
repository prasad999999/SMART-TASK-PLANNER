import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user session reliably
  useEffect(() => {
    const init = async () => {
      console.log("🔵 AuthContext mounted — starting session check...");
  
      console.log("➡️ Calling supabase.auth.getSession()...");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log("📦 getSession() returned:", sessionData, sessionError);
  
      const sessionUser = sessionData?.session?.user ?? null;
      console.log("👤 Session user:", sessionUser);
  
      setUser(sessionUser);
  
      if (sessionUser) {
        console.log("➡️ Loading profile for:", sessionUser.id);
        await loadProfile(sessionUser.id);
      }
  
      console.log("🟢 Finished initial load — setting loading=false");
      setLoading(false);
    };
  
    init();
  
    console.log("👂 Setting up onAuthStateChange listener...");
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔄 Auth state changed: ${event}`, session);
  
      const newUser = session?.user ?? null;
      setUser(newUser);
  
      if (newUser) {
        loadProfile(newUser.id);
      } else {
        setProfile(null);
      }
  
      setLoading(false);
    });
  
    return () => {
      console.log("🛑 Removing listener");
      listener.subscription.unsubscribe();
    };
  }, []);
  

  const loadProfile = async (id: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("id", id)
      .single();

    setProfile(data ?? null);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
