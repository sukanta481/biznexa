// Verifies the admin API auth boundary.
// Usage: node scripts/verify-admin-auth.mjs
// Optional: VERIFY_BASE_URL, VERIFY_USERNAME, VERIFY_PASSWORD

const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";

// Every admin endpoint that must reject anonymous callers.
const PROTECTED = [
  ["GET", "/api/admin/leads"],
  ["GET", "/api/admin/clients"],
  ["GET", "/api/admin/bills"],
  ["GET", "/api/admin/bills/init"],
  ["GET", "/api/admin/expenses"],
  ["GET", "/api/admin/dashboard"],
  ["GET", "/api/admin/settings/site"],
  ["GET", "/api/admin/inspection/dashboard"],
  ["GET", "/api/admin/inspection/files"],
  ["GET", "/api/admin/inspection/files/stats"],
  ["GET", "/api/admin/inspection/files/branches"],
  ["GET", "/api/admin/inspection/files/init"],
  ["GET", "/api/admin/inspection/files/lookups"],
  ["GET", "/api/admin/inspection/files/export"],
  ["GET", "/api/admin/inspection/masters/banks"],
  ["POST", "/api/admin/clients"],
  ["POST", "/api/admin/expenses"],
  ["POST", "/api/admin/blog"],
  ["POST", "/api/admin/upload"],
  ["PUT", "/api/admin/content/homepage"],
  ["PUT", "/api/admin/content/about"],
  ["PUT", "/api/admin/content/services"],
  ["PUT", "/api/admin/content/case-studies"],
];

// Cookie values that must NOT authenticate.
const FORGED = [
  "admin_session=1:deadbeef",
  "admin_session=1:",
  "admin_session=2:0000000000000000000000000000000000000000000000000000000000000000",
  "admin_session=" + "a".repeat(64),
];

let failures = 0;

function report(ok, label, detail) {
  if (ok) {
    console.log(`  PASS  ${label}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${label} — ${detail}`);
  }
}

async function call(method, path, cookie) {
  const headers = {};
  if (cookie) headers.cookie = cookie;
  // Send an empty JSON body on writes so a 400 from body parsing cannot be
  // mistaken for a 401 from the auth guard.
  if (method !== "GET") {
    headers["content-type"] = "application/json";
  }
  return fetch(`${BASE}${path}`, {
    method,
    headers,
    body: method === "GET" ? undefined : "{}",
    redirect: "manual",
  });
}

async function checkAnonymous() {
  console.log("\n[1] Anonymous requests must return 401");
  for (const [method, path] of PROTECTED) {
    const res = await call(method, path);
    report(res.status === 401, `${method} ${path}`, `got ${res.status}, want 401`);
  }
}

async function checkForged() {
  console.log("\n[2] Forged session cookies must return 401");
  for (const cookie of FORGED) {
    const res = await call("GET", "/api/admin/leads", cookie);
    report(res.status === 401, `cookie "${cookie.slice(0, 40)}"`, `got ${res.status}, want 401`);
  }
}

async function checkLoginWorks() {
  const username = process.env.VERIFY_USERNAME;
  const password = process.env.VERIFY_PASSWORD;
  if (!username || !password) {
    console.log("\n[3] SKIPPED — set VERIFY_USERNAME and VERIFY_PASSWORD to test the happy path");
    return;
  }

  console.log("\n[3] A real login must be granted access");

  const res = await fetch(`${BASE}/api/admin/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  report(res.status === 200, "POST /api/admin/auth/login", `got ${res.status}, want 200`);

  const setCookie = res.headers.get("set-cookie") ?? "";
  const token = setCookie.split(";")[0];
  report(/^admin_session=[a-f0-9]{64}$/.test(token), "cookie is a bare 64-char hex token", `got "${token}"`);

  const authed = await call("GET", "/api/admin/leads", token);
  report(authed.status === 200, "GET /api/admin/leads with real session", `got ${authed.status}, want 200`);

  const out = await call("POST", "/api/admin/auth/logout", token);
  report(out.status === 200, "POST /api/admin/auth/logout", `got ${out.status}, want 200`);

  const afterLogout = await call("GET", "/api/admin/leads", token);
  report(afterLogout.status === 401, "session is dead after logout", `got ${afterLogout.status}, want 401`);
}

async function main() {
  console.log(`Verifying admin auth boundary at ${BASE}`);
  await checkAnonymous();
  await checkForged();
  await checkLoginWorks();

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Verification script crashed:", err);
  process.exit(1);
});