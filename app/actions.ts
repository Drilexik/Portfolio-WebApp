"use server";

import { writeFile, mkdir, unlink } from "fs/promises";
import { join, basename } from "path";
import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const SESSION_COOKIE      = "drilex_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export type AuthState    = { error?: string; success?: boolean };
export type ProjectState = { error?: string; success?: boolean };

/* ── Session token helpers ───────────────────────────────────────
 *
 * The session cookie holds a signed, expiring token — NOT a static
 * string. Without the signing secret it cannot be forged, so a visitor
 * cannot grant themselves admin access by guessing the cookie value.
 *
 * Token format:  <expiryMs>.<nonce>.<hmac>
 *   hmac = HMAC-SHA256( "<expiryMs>.<nonce>", secret )
 */

function sessionSecret(): string {
  // Prefer a dedicated secret; fall back to ADMIN_PASSWORD so a minimal
  // deployment still has a non-empty signing key.
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

function createSessionToken(): string {
  const expiry  = Date.now() + SESSION_TTL_SECONDS * 1000;
  const nonce   = randomBytes(16).toString("hex");
  const payload = `${expiry}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  if (!sessionSecret()) return false; // misconfigured: never trust a token

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiryStr, nonce, mac] = parts;
  const expected = sign(`${expiryStr}.${nonce}`);

  // Constant-time signature comparison (equal length required).
  const macBuf = Buffer.from(mac);
  const expBuf = Buffer.from(expected);
  if (macBuf.length !== expBuf.length || !timingSafeEqual(macBuf, expBuf)) return false;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  return true;
}

/* ── Auth ───────────────────────────────────────────────────── */

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const password      = formData.get("password")?.toString() ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) return { error: "ADMIN_PASSWORD is not configured." };

  // Constant-time comparison to avoid leaking the password via timing.
  const given    = Buffer.from(password);
  const expected = Buffer.from(adminPassword);
  const match    = given.length === expected.length && timingSafeEqual(given, expected);
  if (!match) return { error: "Incorrect password." };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return { success: true };
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}

/* ── Project creation ────────────────────────────────────────── */

// Allowed image types → server-controlled file extension. The extension is
// derived from the validated MIME type, never from the user-supplied
// filename, which prevents path traversal and dangerous extensions.
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/gif":  "gif",
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function createProjectAction(_prev: ProjectState, formData: FormData): Promise<ProjectState> {
  if (!(await isAuthenticated())) return { error: "Unauthorised." };

  const title       = formData.get("title")?.toString().trim()        ?? "";
  const redirectUrl = formData.get("redirect_url")?.toString().trim() ?? "";
  const imageFile   = formData.get("image") as File | null;

  if (!title)       return { error: "Title is required." };
  if (title.length > 255) return { error: "Title must be 255 characters or fewer." };
  if (!redirectUrl) return { error: "Redirect URL is required." };
  if (!/^https?:\/\/.+/i.test(redirectUrl)) return { error: "Redirect URL must start with http:// or https://" };

  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > MAX_IMAGE_BYTES) return { error: "Image must be smaller than 8 MB." };

    const ext = MIME_EXT[imageFile.type];
    if (!ext) return { error: "Only JPEG, PNG, WebP, or GIF allowed." };

    // Fully server-generated filename — no user input reaches the path.
    const filename   = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
    const uploadsDir = join(process.cwd(), "public", "uploads");

    try {
      await mkdir(uploadsDir, { recursive: true });
      const bytes = Buffer.from(await imageFile.arrayBuffer());
      await writeFile(join(uploadsDir, filename), bytes);
    } catch (err) {
      console.error("[createProject] image write failed:", err);
      return { error: "Failed to save image. Please try again." };
    }

    imageUrl = `/uploads/${filename}`;
  }

  try {
    await query(
      `INSERT INTO projects (title, image_url, redirect_url, created_at) VALUES ($1, $2, $3, NOW())`,
      [title, imageUrl, redirectUrl]
    );
  } catch (err) {
    console.error("[createProject] insert failed:", err);
    return { error: "Failed to save project. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteProjectAction(id: number): Promise<void> {
  if (!(await isAuthenticated())) return;
  if (!Number.isInteger(id)) return;

  const { rows } = await query<{ image_url: string }>(
    "DELETE FROM projects WHERE id = $1 RETURNING image_url",
    [id]
  );

  // Remove the orphaned image file from disk, if any.
  const imageUrl = rows[0]?.image_url;
  if (imageUrl && imageUrl.startsWith("/uploads/")) {
    // basename() strips any directory component as a defensive measure.
    const filePath = join(process.cwd(), "public", "uploads", basename(imageUrl));
    try {
      await unlink(filePath);
    } catch {
      // File already gone — nothing to clean up.
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
