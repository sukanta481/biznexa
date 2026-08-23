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

  const defaultConnectTimeoutMs = target === "local" ? 1500 : 10_000;
  const connectTimeout = Number(process.env.DB_CONNECT_TIMEOUT_MS ?? `${defaultConnectTimeoutMs}`);

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
    connectTimeout,
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

export type DatabaseFault = "config" | "unreachable" | "credentials" | "schema";

function errorCode(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: unknown }).code;
    return typeof code === "string" ? code : null;
  }
  return null;
}

/**
 * Classifies an infrastructure failure so callers can say what is actually
 * wrong instead of collapsing everything into "internal server error".
 * Returns null when the error is not a database fault.
 */
export function classifyDatabaseError(error: unknown): DatabaseFault | null {
  if (isMissingDatabaseConfigError(error)) return "config";

  switch (errorCode(error)) {
    case "ECONNREFUSED":
    case "ECONNRESET":
    case "ENOTFOUND":
    case "ETIMEDOUT":
    case "PROTOCOL_CONNECTION_LOST":
      return "unreachable";
    case "ER_ACCESS_DENIED_ERROR":
      return "credentials";
    case "ER_BAD_DB_ERROR":
    case "ER_NO_SUCH_TABLE":
    case "ER_BAD_FIELD_ERROR":
      return "schema";
    default:
      return null;
  }
}

/** Operator-facing explanation. Detailed in development, discreet in production. */
export function describeDatabaseFault(fault: DatabaseFault): string {
  if (process.env.NODE_ENV === "production") {
    return "The service is temporarily unavailable. Please try again shortly.";
  }

  switch (fault) {
    case "config":
      return "Database is not configured. Copy .env.example to .env.local and fill in the DB_LOCAL_* values.";
    case "unreachable":
      return "Cannot reach the database. Start MySQL in the XAMPP control panel and try again.";
    case "credentials":
      return "The database rejected the configured user. Check DB_LOCAL_USER and DB_LOCAL_PASSWORD in .env.local.";
    case "schema":
      return "The database is missing a table or column. Apply the migrations in db/ to your local database.";
  }
}
