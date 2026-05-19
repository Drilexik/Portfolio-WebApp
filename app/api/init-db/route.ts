/**
 * app/api/init-db/route.ts
 *
 * Internal-only endpoint that ensures the DB schema exists.
 * Called automatically from the root layout on the server side.
 */

import { NextResponse } from "next/server";
import { initSchema } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
  try {
    await initSchema();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[init-db] Schema initialisation failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
