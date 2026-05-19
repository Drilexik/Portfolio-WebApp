"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/app/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState: AuthState = {};

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div style={{ maxWidth: 400 }}>
      <p className="section-label">// admin access</p>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
        }}
      >
        Sign in
      </h1>
      <p style={{ marginBottom: "2.5rem", fontSize: "0.9rem" }}>
        This area is restricted. Enter the admin password to continue.
      </p>

      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        {state.error && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "#f87171",
              borderLeft: "2px solid #f87171",
              paddingLeft: "0.75rem",
            }}
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-solid"
          disabled={isPending}
          style={{ alignSelf: "flex-start" }}
        >
          {isPending ? "Verifying…" : "Enter admin panel →"}
        </button>
      </form>
    </div>
  );
}
