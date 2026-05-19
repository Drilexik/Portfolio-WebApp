"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const SESSION_COOKIE = "drilex_admin_session";
const SESSION_VALUE  = "authenticated";

export type AuthState    = { error?: string; success?: boolean };
export type ProjectState = { error?: string; success?: boolean };

/* ── Auth ───────────────────────────────────────────────────── */

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const password      = formData.get("password")?.toString() ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) return { error: "ADMIN_PASSWORD is not configured." };
  if (password !== adminPassword) return { error: "Incorrect password." };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return { success: true };
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}

/* ── Project creation ────────────────────────────────────────── */

export async function createProjectAction(_prev: ProjectState, formData: FormData): Promise<ProjectState> {
  if (!(await isAuthenticated())) return { error: "Unauthorised." };

  const title       = formData.get("title")?.toString().trim()        ?? "";
  const redirectUrl = formData.get("redirect_url")?.toString().trim() ?? "";
  const imageFile   = formData.get("image") as File | null;

  if (!title)       return { error: "Title is required." };
  if (!redirectUrl) return { error: "Redirect URL is required." };
  if (!/^https?:\/\/.+/.test(redirectUrl)) return { error: "Redirect URL must start with http:// or https://" };

  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > 8 * 1024 * 1024) return { error: "Image must be smaller than 8 MB." };

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(imageFile.type)) return { error: "Only JPEG, PNG, WebP, or GIF allowed." };

    const ext      = imageFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Resolve absolute path to public/uploads — works both locally and in Docker standalone
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const bytes = await imageFile.arrayBuffer();
    await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

    imageUrl = `/uploads/${filename}`;
  }

  await query(
    `INSERT INTO projects (title, image_url, redirect_url, created_at) VALUES ($1, $2, $3, NOW())`,
    [title, imageUrl, redirectUrl]
  );

  return { success: true };
}

export async function deleteProjectAction(id: number): Promise<void> {
  if (!(await isAuthenticated())) return;
  await query("DELETE FROM projects WHERE id = $1", [id]);
}
