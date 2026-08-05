// Verifies the WhatsApp inbox endpoints.
// Usage: node scripts/verify-whatsapp-inbox.mjs
// Requires: dev server running, WHATSAPP_INGEST_SECRET set in the environment.

const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";
const SECRET = process.env.WHATSAPP_INGEST_SECRET;

let failures = 0;

function report(ok, label, detail) {
  if (ok) console.log(`  PASS  ${label}`);
  else {
    failures += 1;
    console.log(`  FAIL  ${label} — ${detail}`);
  }
}

async function main() {
  console.log(`Verifying WhatsApp inbox at ${BASE}\n`);

  console.log("[1] Admin chat endpoints reject anonymous callers");
  for (const path of [
    "/api/admin/chat/conversations",
    "/api/admin/chat/updates?since=0",
  ]) {
    const res = await fetch(`${BASE}${path}`);
    report(res.status === 401, `GET ${path}`, `got ${res.status}, want 401`);
  }

  console.log("\n[2] Ingest rejects a missing or wrong secret");
  for (const [label, headers] of [
    ["no secret", {}],
    ["wrong secret", { "x-ingest-secret": "definitely-not-the-secret" }],
  ]) {
    const res = await fetch(`${BASE}/api/whatsapp/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify({ waId: "910000000000" }),
    });
    report(res.status === 401, `POST /api/whatsapp/ingest (${label})`, `got ${res.status}, want 401`);
  }

  if (!SECRET) {
    console.log("\n[3] SKIPPED — set WHATSAPP_INGEST_SECRET to test the happy path");
  } else {
    console.log("\n[3] Ingest accepts a valid message");
    const waId = `9199${Date.now().toString().slice(-8)}`;

    const res = await fetch(`${BASE}/api/whatsapp/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-ingest-secret": SECRET },
      body: JSON.stringify({
        waId,
        profileName: "Verify Bot",
        waMessageId: `wamid.verify.${Date.now()}`,
        direction: "in",
        text: "hello from the verification script",
      }),
    });
    const json = await res.json().catch(() => ({}));
    report(res.status === 200, "POST /api/whatsapp/ingest (valid)", `got ${res.status}, want 200`);
    report(json.ai_enabled === true, "new conversation defaults to ai_enabled=true", `got ${JSON.stringify(json)}`);

    console.log("\n[4] Duplicate wa_message_id is idempotent");
    const dupId = `wamid.dup.${Date.now()}`;
    const payload = {
      waId,
      waMessageId: dupId,
      direction: "in",
      text: "duplicate test",
    };
    const first = await fetch(`${BASE}/api/whatsapp/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-ingest-secret": SECRET },
      body: JSON.stringify(payload),
    });
    const second = await fetch(`${BASE}/api/whatsapp/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-ingest-secret": SECRET },
      body: JSON.stringify(payload),
    });
    report(first.status === 200 && second.status === 200, "webhook retry does not error", `got ${first.status}/${second.status}`);
    console.log(`  NOTE  verify by hand that wa_messages has exactly one row for ${dupId}`);
  }

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Verification script crashed:", err);
  process.exit(1);
});
