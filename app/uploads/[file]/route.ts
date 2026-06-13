import { readFile } from "fs/promises";
import { join, basename, extname } from "path";
import type { NextRequest } from "next/server";

// Next.js (output: "standalone") does NOT serve files added to /public at
// runtime — only build-time assets. Uploaded images live in public/uploads,
// so we stream them through this route handler instead.
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const safe = basename(file);
  if (!safe || safe.includes("..") || safe.includes("/")) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const data = await readFile(join(process.cwd(), "public", "uploads", safe));
    const type = TYPES[extname(safe).toLowerCase()] || "application/octet-stream";
    return new Response(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}