import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/services/supabaseClient";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, signUp, errorMessage } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    try {
      setIsSubmitting(true);
      if (mode === "login") {
        await signIn({ email, password });
        navigate("/");
      } else {
        await signUp({ email, password, displayName });
        setFeedback("Account created. Check your inbox if email confirmation is enabled.");
        setMode("login");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication request failed.";
      setFeedback(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-cave-moss/30 bg-cave-basalt/85 p-6 shadow-panel">
      <h1 className="font-heading text-5xl tracking-[0.12em] text-cave-glow">
        {mode === "login" ? "Login" : "Sign Up"}
      </h1>
      <p className="mt-2 text-sm text-cave-mist/80">
        Access your account to track orders and future conservation impact updates.
      </p>

      {!isSupabaseConfigured && (
        <div className="mt-4 rounded-lg border border-cave-ember/40 bg-cave-ember/10 p-3 text-sm text-cave-glow">
          Supabase is not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
        </div>
      )}

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <label className="block text-sm text-cave-mist/85">
            Display Name
            <input
              required
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="mt-1 block w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 text-cave-mist focus:border-cave-glow focus:outline-none"
            />
          </label>
        )}
        <label className="block text-sm text-cave-mist/85">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 block w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 text-cave-mist focus:border-cave-glow focus:outline-none"
          />
        </label>
        <label className="block text-sm text-cave-mist/85">
          Password
          <input
            type="password"
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 block w-full rounded-md border border-cave-moss/35 bg-cave-slate/50 px-3 py-2 text-cave-mist focus:border-cave-glow focus:outline-none"
          />
        </label>

        {(feedback || errorMessage) && (
          <p className="rounded-md border border-cave-moss/30 bg-cave-slate/50 p-3 text-sm text-cave-mist/85">
            {feedback || errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isSupabaseConfigured}
          className={`w-full rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] ${
            isSubmitting || !isSupabaseConfigured
              ? "cursor-not-allowed bg-cave-slate/55 text-cave-mist/60"
              : "bg-cave-ember text-white hover:bg-cave-clay"
          }`}
        >
          {isSubmitting ? "Processing..." : mode === "login" ? "Enter Basecamp" : "Create Account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 text-sm text-cave-moss hover:text-cave-glow"
      >
        {mode === "login" ? "Need an account? Sign up" : "Already registered? Log in"}
      </button>
    </section>
  );
};
