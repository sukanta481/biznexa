// Applies pending SQL migrations from db/migrations and records what ran.
//
//   node scripts/migrate.mjs             apply everything pending
//   node scripts/migrate.mjs --status    list applied and pending, change nothing
//   node scripts/migrate.mjs --baseline  record all as applied WITHOUT running them
//
// Target follows DB_TARGET exactly as the app does: "live" uses DB_LIVE_*,
// anything else uses DB_LOCAL_*. Override for one run with --target=live.
//
// --baseline exists for databases that were migrated by hand before this
// runner existed. It adopts the current schema as the starting point instead
// of replaying history over it.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "package.json"));
const mysql = require("mysql2/promise");

const MIGRATIONS_DIR = join(root, "db", "migrations");

const args = process.argv.slice(2);
const mode = args.includes("--status") ? "status" : args.includes("--baseline") ? "baseline" : "apply";
const targetArg = args.find((a) => a.startsWith("--target="))?.split("=")[1];

/** Loads .env files the way Next does, without overwriting real env vars. */
function loadEnv() {
  for (const file of [".env.production", ".env.local", ".env"]) {
    const path = join(root, file);
    if (!existsSync(path)) continue;

    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const match = /^([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line.trim());
      if (!match) continue;
      const [, key, raw] = match;
      if (process.env[key] !== undefined) continue;
      process.env[key] = raw.replace(/^["']|["']$/g, "").trim();
    }
  }
}

function connectionConfig() {
  const target = (targetArg ?? process.env.DB_TARGET) === "live" ? "live" : "local";
  const prefix = target === "live" ? "DB_LIVE_" : "DB_LOCAL_";

  const host = process.env[`${prefix}HOST`];
  const database = process.env[`${prefix}NAME`];
  const user = process.env[`${prefix}USER`];

  if (!host || !database || !user) {
    throw new Error(
      `Missing database configuration for ${target}. Check ${prefix}HOST, ${prefix}NAME and ${prefix}USER.`,
    );
  }

  return {
    target,
    options: {
      host,
      port: Number(process.env[`${prefix}PORT`] ?? "3306"),
      database,
      user,
      password: process.env[`${prefix}PASSWORD`] ?? "",
      connectTimeout: target === "live" ? 20000 : 5000,
      multipleStatements: true,
    },
  };
}

function migrationFiles() {
  if (!existsSync(MIGRATIONS_DIR)) return [];
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
}

async function ensureTable(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function appliedSet(conn) {
  const [rows] = await conn.query("SELECT name FROM schema_migrations");
  return new Set(rows.map((r) => r.name));
}

async function main() {
  loadEnv();

  const { target, options } = connectionConfig();
  const files = migrationFiles();

  console.log(`database : ${options.database} @ ${options.host} (${target})`);
  console.log(`migrations: ${files.length} file(s) in db/migrations\n`);

  if (target === "live" && mode === "apply") {
    console.log("Applying to the LIVE database.\n");
  }

  const conn = await mysql.createConnection(options);

  try {
    await ensureTable(conn);
    const applied = await appliedSet(conn);
    const pending = files.filter((f) => !applied.has(f));

    if (mode === "status") {
      for (const f of files) {
        console.log(`  ${applied.has(f) ? "applied" : "PENDING"}  ${f}`);
      }
      console.log(`\n${pending.length} pending, ${applied.size} applied.`);
      return pending.length === 0 ? 0 : 1;
    }

    if (mode === "baseline") {
      if (pending.length === 0) {
        console.log("Nothing to baseline — every migration is already recorded.");
        return 0;
      }
      for (const f of pending) {
        await conn.query("INSERT IGNORE INTO schema_migrations (name) VALUES (?)", [f]);
        console.log(`  recorded (not run)  ${f}`);
      }
      console.log(`\nBaselined ${pending.length} migration(s).`);
      return 0;
    }

    if (pending.length === 0) {
      console.log("Up to date — no pending migrations.");
      return 0;
    }

    for (const f of pending) {
      const sql = readFileSync(join(MIGRATIONS_DIR, f), "utf8").trim();
      if (!sql) {
        console.log(`  skipped (empty)  ${f}`);
        continue;
      }

      process.stdout.write(`  applying  ${f} ... `);
      try {
        await conn.query(sql);
        await conn.query("INSERT INTO schema_migrations (name) VALUES (?)", [f]);
        console.log("ok");
      } catch (err) {
        console.log("FAILED");
        console.error(`\n${f} failed: ${err.message}`);
        console.error("Nothing after this point was applied. Fix the migration and run again.");
        return 1;
      }
    }

    console.log(`\nApplied ${pending.length} migration(s).`);
    return 0;
  } finally {
    await conn.end();
  }
}

main()
  .then((code) => process.exit(code ?? 0))
  .catch((err) => {
    console.error(err.message ?? err);
    process.exit(1);
  });
