import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import type { Profile } from "@/types/models";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

export interface AuthCredentials {
  email: string;
  password: string;
  displayName?: string;
}

const requireConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add frontend environment values.");
  }
};

export const authService = {
  async signUp({ email, password, displayName }: AuthCredentials) {
    requireConfigured();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName ?? "" }
      }
    });
    if (error) throw error;

    if (data.user) {
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email: data.user.email,
          display_name: displayName ?? null,
          role: "customer"
        },
        { onConflict: "id" }
      );
    }
    return data;
  },

  async signIn({ email, password }: AuthCredentials) {
    requireConfigured();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    requireConfigured();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async getProfile(userId: string): Promise<Profile | null> {
    requireConfigured();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async ensureProfile(userId: string, email: string, displayName?: string | null) {
    requireConfigured();
    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        email,
        display_name: displayName ?? null
      },
      { onConflict: "id" }
    );
    if (error) throw error;
  }
};
