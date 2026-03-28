import "server-only";

import mysql, { type Pool, type PoolOptions, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

type DatabaseTarget = "local" | "live";
const MISSING_DB_CONFIG_PREFIX = "Missing database configuration for";

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
      `${MISSING_DB_CONFIG_PREFIX} ${target}. Check ${prefix}HOST, ${prefix}NAME, ${prefix}USER, and related env vars.`,
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
    connectTimeout: 10_000,
  };
}

function createPool() {
  return mysql.createPool(readConfig(getDatabaseTarget()));
}

function getDb() {
  if (!globalThis.__biznexaDbPool) {
    globalThis.__biznexaDbPool = createPool();
  }

  return globalThis.__biznexaDbPool;
}

export async function query<T extends RowDataPacket[] | ResultSetHeader>(sql: string, params: unknown[] = []) {
  const [rows] = await getDb().query<T>(sql, params);
  return rows;
}

export async function pingDatabase() {
  await getDb().query("SELECT 1");
}

export function getActiveDatabaseLabel() {
  const target = getDatabaseTarget();
  const database = target === "live" ? process.env.DB_LIVE_NAME : process.env.DB_LOCAL_NAME;

  return {
    target,
    database: database ?? "",
  };
}

export function isMissingDatabaseConfigError(error: unknown) {
  return error instanceof Error && error.message.startsWith(MISSING_DB_CONFIG_PREFIX);
}
