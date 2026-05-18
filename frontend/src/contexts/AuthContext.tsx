import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "@/types/models";
import { authService, type AuthCredentials } from "@/services/authService";
import { isSupabaseConfigured } from "@/services/supabaseClient";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) {
      setProfile(null);
      return;
    }
    try {
      const fetched = await authService.getProfile(userId);
      setProfile(fetched);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load profile.";
      setErrorMessage(message);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const bootstrap = async () => {
      try {
        const initialSession = await authService.getSession();
        if (!isMounted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        if (initialSession?.user) {
          await authService.ensureProfile(
            initialSession.user.id,
            initialSession.user.email ?? "",
            (initialSession.user.user_metadata?.display_name as string | null) ??
              null
          );
          await loadProfile(initialSession.user.id);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Authentication bootstrap failed.";
        if (isMounted) setErrorMessage(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    bootstrap();

    const {
      data: { subscription }
    } = authService.onAuthChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await authService.ensureProfile(
          nextSession.user.id,
          nextSession.user.email ?? "",
          (nextSession.user.user_metadata?.display_name as string | null) ?? null
        );
        await loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    setErrorMessage(null);
    await authService.signIn(credentials);
  }, []);

  const signUp = useCallback(async (credentials: AuthCredentials) => {
    setErrorMessage(null);
    await authService.signUp(credentials);
  }, []);

  const signOut = useCallback(async () => {
    setErrorMessage(null);
    await authService.signOut();
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    await loadProfile(user.id);
  }, [loadProfile, user?.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isAdmin: profile?.role === "admin",
      isLoading,
      errorMessage,
      signIn,
      signUp,
      signOut,
      refreshProfile
    }),
    [session, user, profile, isLoading, errorMessage, signIn, signUp, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
};
