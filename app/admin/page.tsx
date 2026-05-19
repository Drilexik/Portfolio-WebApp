/**
 * app/admin/page.tsx — Hidden admin panel.
 *
 * No link to this page exists anywhere in the public site.
 * Access via: /admin
 *
 * Auth flow:
 *   - If not authenticated → show login form.
 *   - If authenticated → show project management dashboard.
 */

import { isAuthenticated } from "@/app/actions";
import { query } from "@/lib/db";
import type { Project } from "@/lib/types";
import LoginForm from "./LoginForm";
import AdminDashboard from "./AdminDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Drilex",
  robots: "noindex, nofollow",
};

async function getProjects(): Promise<Project[]> {
  try {
    const { rows } = await query<Project>(
      "SELECT id, title, image_url, redirect_url, created_at FROM projects ORDER BY created_at DESC"
    );
    return rows;
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const authed = await isAuthenticated();
  const projects = authed ? await getProjects() : [];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      {/* Minimal nav */}
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "0 2rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="mono"
          style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
        >
          drilex.cz
          <span style={{ color: "var(--accent)", marginLeft: 4 }}>/admin</span>
        </span>
        <a
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-dim)",
            letterSpacing: "0.04em",
          }}
        >
          ← back to site
        </a>
      </nav>

      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
      >
        {authed ? (
          <AdminDashboard projects={projects} />
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
