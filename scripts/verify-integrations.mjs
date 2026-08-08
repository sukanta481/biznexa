// Verifies the integration credentials API.
// Usage: node scripts/verify-integrations.mjs
// Requires: dev server running.
//
// Until the API routes from Chunk 3 exist, the GET/POST/test checks will
// return 404 — that is expected. Re-run after Chunk 3 to confirm 401s.

const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";

let failures = 0;

function report(ok, label, detail) {
  if (ok) console.log(`  PASS  ${label}`);
  else {
    failures += 1;
    console.log(`  FAIL  ${label} — ${detail}`);
  }
}

async function main() {
  console.log(`Verifying integrations API at ${BASE}\n`);

  console.log("[1] Anonymous callers are rejected on the integrations read endpoint");
  {
    const res = await fetch(`${BASE}/api/admin/settings/integrations`, {
      method: "GET",
    });
    report(res.status === 401, "GET /api/admin/settings/integrations", `got ${res.status}, want 401`);
  }

  console.log("\n[2] Anonymous callers are rejected on the integrations save endpoint");
  {
    const res = await fetch(`${BASE}/api/admin/settings/integrations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ provider: "whatsapp", fields: {} }),
    });
    report(res.status === 401, "POST /api/admin/settings/integrations", `got ${res.status}, want 401`);
  }

  console.log("\n[3] Anonymous callers are rejected on the test-connection endpoint");
  {
    const res = await fetch(`${BASE}/api/admin/settings/integrations/test`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ provider: "whatsapp" }),
    });
    report(res.status === 401, "POST /api/admin/settings/integrations/test", `got ${res.status}, want 401`);
  }

  console.log(
    "\nNOTE  After saving credentials through the UI, confirm by hand:",
  );
  console.log(
    "       /c/xampp/mysql/bin/mysql -u root d2w_cms -e \"SELECT provider, LEFT(config_json,40) AS ciphertext FROM integration_credentials;\"",
  );
  console.log(
    "       The stored value must be base64 ciphertext, not the plaintext token.",
  );

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Verification script crashed:", err);
  process.exit(1);
});
