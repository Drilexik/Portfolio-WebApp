/**
 * lib/db.ts
 *
 * Raw PostgreSQL connection pool using the `pg` native driver.
 * No ORM. No Prisma. Pure SQL.
 *
 * Usage:
 *   import { query } from '@/lib/db';
 *   const { rows } = await query('SELECT * FROM projects ORDER BY created_at DESC');
 */

import { Pool, type QueryResult, type QueryResultRow } from "pg";

// ─── Singleton pool ───────────────────────────────────────────────────────────
// Next.js hot-reload in dev mode can create multiple module instances.
// Store the pool on globalThis so we reuse the same pool across reloads.

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool(): Pool {
  return new Pool({
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: parseInt(process.env.POSTGRES_PORT ?? "5432", 10),
    database: process.env.POSTGRES_DB ?? "drilex",
    user: process.env.POSTGRES_USER ?? "drilex",
    password: process.env.POSTGRES_PASSWORD ?? "",
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

const pool: Pool = globalThis.__pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPool = pool;
}

// ─── Typed query helper ───────────────────────────────────────────────────────

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const client = await pool.connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}

// ─── Schema initialisation ────────────────────────────────────────────────────
// Called once on server startup (via app/api/init-db/route.ts or layout.tsx).
// Uses IF NOT EXISTS so it is safe to run repeatedly.

export async function initSchema(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS projects (
      id          SERIAL        PRIMARY KEY,
      title       VARCHAR(255)  NOT NULL,
      image_url   TEXT          NOT NULL DEFAULT '',
      redirect_url TEXT         NOT NULL,
      created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );
  `;
  await query(sql);
}

export default pool;
