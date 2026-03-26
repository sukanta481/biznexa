import "server-only";

import mysql, { type Pool, type PoolOptions, type RowDataPacket } from "mysql2/promise";

type DatabaseTarget = "local" | "live";

declare global {
  var __biznexaDbPool: Pool | undefined;
}

function getDatabaseTarget(): DatabaseTarget {
  return process.env.DB_TARGET === "live" ? "live" : "local";
}

function readConfig(target: DatabaseTarget): PoolOptions {
  const prefix = target === "live" ? "DB_LIVE_" : "DB_LOCAL_";

  const host = process.env[`${prefix}HOST`];
  const port = Number(process.env[`${prefix}PORT`] ?? "3306");
  const database = process.env[`${prefix}NAME`];
  const user = process.env[`${prefix}USER`];
  const password = process.env[`${prefix}PASSWORD`] ?? "";

  if (!host || !database || !user) {
    throw new Error(
      `Missing database configuration for ${target}. Check ${prefix}HOST, ${prefix}NAME, ${prefix}USER, and related env vars.`,
    );
  }

  return {
    host,
    port,
    database,
    user,
    password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
  };
}

function createPool() {
  return mysql.createPool(readConfig(getDatabaseTarget()));
}

export const db = globalThis.__biznexaDbPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__biznexaDbPool = db;
}

export async function query<T extends RowDataPacket[]>(sql: string, params: unknown[] = []) {
  const [rows] = await db.query<T>(sql, params);
  return rows;
}

export async function pingDatabase() {
  await db.query("SELECT 1");
}

export function getActiveDatabaseLabel() {
  const target = getDatabaseTarget();
  const database = target === "live" ? process.env.DB_LIVE_NAME : process.env.DB_LOCAL_NAME;

  return {
    target,
    database: database ?? "",
  };
}
