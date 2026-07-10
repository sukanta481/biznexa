// Migration: add 'inspection_done' and 'sent_to_office' to inspection_files.report_status enum
// Run: node scripts/add-report-status-options.js

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const values = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    values[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  }
  return values;
}

function getDatabaseConfig() {
  const envPath = path.join(process.cwd(), ".env.local");
  const env = { ...readEnvFile(envPath), ...process.env };
  const target = env.DB_TARGET === "live" ? "LIVE" : "LOCAL";
  return {
    host: env[`DB_${target}_HOST`],
    port: Number(env[`DB_${target}_PORT`] || "3306"),
    user: env[`DB_${target}_USER`],
    password: env[`DB_${target}_PASSWORD`] || "",
    database: env[`DB_${target}_NAME`],
  };
}

async function run() {
  const db = await mysql.createConnection(getDatabaseConfig());

  const query = `
    ALTER TABLE inspection_files
    MODIFY COLUMN report_status
    ENUM('draft','inspection_done','sent_to_office','hold','final_soft','final_hard')
    DEFAULT NULL
  `;

  await db.query(query);
  console.log("✓ report_status ENUM updated to include 'inspection_done', 'sent_to_office', and 'hold'.");

  const [rows] = await db.query(
    `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inspection_files' AND COLUMN_NAME = 'report_status'`
  );
  console.log("  Current column type:", rows[0]?.COLUMN_TYPE);

  await db.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});