"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/app/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState: AuthState = {};

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state.success, router]);

  return (
    <div className="min-h-screen bg-[#07070a] flex items-center justify-center px-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3">
          <img src="https://upload.drilex.cz/logo.png" alt="Drilex" className="h-8 w-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="font-mono text-sm text-[#9090b0]">
            drilex<span className="text-[#7c3aed]">.cz</span>
            <span className="text-[#44445a]">/admin</span>
          </span>
        </div>

        <h1 className="font-extrabold text-3xl tracking-tight text-[#f0f0ff] mb-2">Admin access</h1>
        <p className="text-[#9090b0] text-sm mb-8">This area is restricted. Enter your password.</p>

        <form action={formAction} className="flex flex-col gap-5">
          <div>
            <label className="block font-mono text-[0.65rem] tracking-widest uppercase text-[#9090b0] mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              className="w-full bg-[#111118] border border-[#1e1e2a] text-[#f0f0ff] font-mono text-sm px-4 py-3 outline-none focus:border-[#7c3aed] transition-colors"
            />
          </div>

          {state.error && (
            <div className="border-l-2 border-red-500 pl-3 font-mono text-xs text-red-400">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-solid justify-center w-full py-3"
          >
            <span>{isPending ? "Verifying…" : "Enter panel"}</span>
            {!isPending && <span>→</span>}
          </button>
        </form>

        <a href="/" className="block mt-6 font-mono text-xs text-[#44445a] hover:text-[#9090b0] transition-colors text-center">
          ← back to site
        </a>
      </div>
    </div>
  );
}
