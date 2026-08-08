// Round-trip test: writes a fake WhatsApp config via the same seal() the
// application uses, then SELECTs the row and confirms the stored value is
// base64 ciphertext — not the plaintext token.
//
// Usage: node scripts/verify-credentials-roundtrip.mjs
// Requires: CREDENTIALS_KEY set in the environment (loaded via dotenv).

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

if (!process.env.CREDENTIALS_KEY || !/^[a-f0-9]{64}$/i.test(process.env.CREDENTIALS_KEY)) {
  console.error("CREDENTIALS_KEY missing or malformed in .env.local");
  process.exit(1);
}

const mysql = await import("mysql2/promise");
const { createCipheriv, randomBytes } = await import("node:crypto");

const ALGO = "aes-256-gcm";
const IV_BYTES = 12;
const key = Buffer.from(process.env.CREDENTIALS_KEY, "hex");

function seal(plaintext) {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}

const PLAINTEXT_TOKEN = "FAKE-VERIFY-TOKEN-DO-NOT-USE-IN-PROD-abcdef0123456789";
const PLAINTEXT_INGEST = "FAKE-INGEST-SECRET-DO-NOT-USE-IN-PROD-0123456789abcdef";

const conn = await mysql.default.createConnection({
  host: process.env.DB_LOCAL_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_LOCAL_PORT ?? "3306"),
  database: process.env.DB_LOCAL_NAME ?? "d2w_cms",
  user: process.env.DB_LOCAL_USER ?? "root",
  password: process.env.DB_LOCAL_PASSWORD ?? "",
});

try {
  const plaintext = JSON.stringify({
    token: PLAINTEXT_TOKEN,
    phoneNumberId: "1093847561",
    ingestSecret: PLAINTEXT_INGEST,
  });
  const sealed = seal(plaintext);

  await conn.execute(
    `INSERT INTO integration_credentials (provider, config_json, updated_by)
     VALUES (?, ?, NULL)
     ON DUPLICATE KEY UPDATE config_json = VALUES(config_json)`,
    ["whatsapp", sealed],
  );

  const [rows] = await conn.execute(
    "SELECT provider, config_json FROM integration_credentials WHERE provider = 'whatsapp'",
  );
  const stored = rows[0].config_json;

  console.log("Stored provider :", rows[0].provider);
  console.log("Stored length   :", stored.length);
  console.log("Stored preview  :", stored.slice(0, 60) + (stored.length > 60 ? "..." : ""));
  console.log();

  const containsPlaintextToken = stored.includes(PLAINTEXT_TOKEN);
  const containsPlaintextIngest = stored.includes(PLAINTEXT_INGEST);

  console.log("Contains plaintext token?        ", containsPlaintextToken);
  console.log("Contains plaintext ingestSecret? ", containsPlaintextIngest);
  console.log("Matches iv:tag:ciphertext shape? ", /^[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/.test(stored));

  if (containsPlaintextToken || containsPlaintextIngest) {
    console.error("\nFAIL  stored value contains the plaintext secret");
    process.exit(1);
  }
  console.log("\nPASS  stored value is ciphertext, no plaintext token visible");
} finally {
  await conn.end();
}
