import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { authService, CurrentUser } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";

interface SessionContextType {
  session: Session | null;
  userData: CurrentUser | null;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  userData: null,
});

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

type Props = { children: React.ReactNode };

export const SessionProvider = ({ children }: Props) => {
  const { setUserData, clearAuth, userData: storedUser } = useAuthStore();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial sync
    const init = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setIsLoading(false);

        if (initialSession?.user) {
          authService.getCurrentUser(initialSession.user).then(profile => {
            if (profile) setUserData(profile);
          });
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('[auth] init failed:', error);
        setIsLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setIsLoading(false);

        if (currentSession?.user) {
          authService.getCurrentUser(currentSession.user).then(profile => {
            if (profile) setUserData(profile);
          });
        } else {
          clearAuth();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ session, userData: storedUser }}>
      {children}
    </SessionContext.Provider>
  );
};
