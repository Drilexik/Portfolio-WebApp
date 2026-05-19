"use server";

/**
 * app/actions.ts — Next.js Server Actions
 *
 * All mutations from the admin panel go through here.
 * Files are saved to /public/uploads/; metadata is stored via raw SQL INSERT.
 */

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// ─── Auth ─────────────────────────────────────────────────────────────────────

const SESSION_COOKIE = "drilex_admin_session";
const SESSION_VALUE = "authenticated";

export type AuthState = {
  error?: string;
  success?: boolean;
};

/**
 * Verify the submitted password against ADMIN_PASSWORD env variable.
 * On success, set a simple session cookie.
 */
export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get("password")?.toString() ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "ADMIN_PASSWORD is not set in environment variables." };
  }

  if (password !== adminPassword) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return { success: true };
}

/**
 * Check if the current request has a valid admin session.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}

/**
 * Logout: clear the session cookie and redirect to home.
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}

// ─── Project creation ─────────────────────────────────────────────────────────

export type ProjectState = {
  error?: string;
  success?: boolean;
};

/**
 * Create a new project entry.
 * 1. Validates auth.
 * 2. Saves the uploaded image to /public/uploads/.
 * 3. Runs a raw parameterised INSERT INTO projects.
 */
export async function createProjectAction(
  _prev: ProjectState,
  formData: FormData
): Promise<ProjectState> {
  // Auth guard
  if (!(await isAuthenticated())) {
    return { error: "Unauthorised." };
  }

  const title = formData.get("title")?.toString().trim() ?? "";
  const redirectUrl = formData.get("redirect_url")?.toString().trim() ?? "";
  const imageFile = formData.get("image") as File | null;

  // Validation
  if (!title) return { error: "Title is required." };
  if (!redirectUrl) return { error: "Redirect URL is required." };
  if (!/^https?:\/\/.+/.test(redirectUrl)) {
    return { error: "Redirect URL must start with http:// or https://" };
  }

  // ── Handle image upload ──
  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    const maxSize = 8 * 1024 * 1024; // 8 MB
    if (imageFile.size > maxSize) {
      return { error: "Image must be smaller than 8 MB." };
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(imageFile.type)) {
      return { error: "Image must be JPEG, PNG, WebP, or GIF." };
    }

    const ext = imageFile.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadsDir = join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    await mkdir(uploadsDir, { recursive: true });

    const bytes = await imageFile.arrayBuffer();
    await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

    imageUrl = `/uploads/${filename}`;
  }

  // ── Raw SQL INSERT ──
  // Parameterised query — safe from SQL injection.
  await query(
    `INSERT INTO projects (title, image_url, redirect_url, created_at)
     VALUES ($1, $2, $3, NOW())`,
    [title, imageUrl, redirectUrl]
  );

  return { success: true };
}

/**
 * Delete a project by ID.
 */
export async function deleteProjectAction(id: number): Promise<void> {
  if (!(await isAuthenticated())) return;

  await query("DELETE FROM projects WHERE id = $1", [id]);
}
