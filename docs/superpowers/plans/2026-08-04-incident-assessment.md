# Incident Assessment Plan — Unauthenticated Admin API Exposure

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Phases 0 and 1 are time-critical and must run before anything else. Several steps require AWS console/CLI access and human legal judgment — those are marked **[HUMAN]** and cannot be completed by an agent.

**Goal:** Determine whether the unauthenticated admin API was actually exploited, scope what personal data was reachable and whose it was, and decide — on evidence, not assumption — what notification obligations were triggered.

**Companion document:** [2026-08-04-admin-auth-hardening.md](2026-08-04-admin-auth-hardening.md) fixes the vulnerability. This plan assesses the damage. Run Chunk 1 of that plan **first** — stop the bleeding before investigating.

**Awareness date:** 2026-08-04. This is the date the vulnerability was identified and confirmed against production. Statutory clocks that run from "becoming aware" start here. Record this date and do not revise it.

---

## ⚠️ Read this before anything else

**Two clocks may already be running.**

Under the DPDP Act 2023 and the DPDP Rules 2025, a Data Fiduciary must notify the Data Protection Board of India within **72 hours** of becoming aware of a personal data breach, and must also notify **every affected Data Principal**. There is no minimum-harm threshold and no small-business exemption. Separately, CERT-In's April 2022 directions require certain cyber incidents to be reported within **6 hours** of detection. A single incident can trigger both, on independent timelines.

**But — and this matters — a vulnerability is not automatically a breach.**

DPDP defines a personal data breach as unauthorised *processing*, or accidental disclosure, acquisition, sharing, use, alteration, destruction, or loss of access. An open door that nobody walked through may not meet that definition. Whether it does is a legal judgment, not an engineering one.

That is precisely why **Phase 1 (log analysis) is the gating step and is genuinely urgent.** The logs are the only thing that can tell you which side of that line you are on, and log retention windows are finite — CloudFront and Amplify logs expire. If you lose the logs, you lose the ability to demonstrate that nothing was taken, and you are left having to assume the worst.

**Do Phase 0 today.** Preserving evidence costs almost nothing and cannot be undone later.

**[HUMAN] Engage a lawyer with Indian data-protection experience now, in parallel with Phase 1.** Everything below is engineering groundwork to inform that conversation. I am not a lawyer and this is not legal advice. The notification decisions in Phase 4 are theirs to make, not yours and not mine.

---

## What is already established

These facts come from reading the code and probing the live site on 2026-08-04. They do not require further investigation.

### Exposure windows

Each route became reachable when it was first deployed. All were still open on 2026-08-04.

| Endpoint | Open since | First commit | Days exposed |
|---|---|---|---|
| `/api/admin/upload` | 2026-03-28 | `828c06b` | ~129 |
| `/api/admin/inspection/*` | 2026-04-01 | `00c5dbc` | ~125 |
| `/api/admin/expenses` | 2026-04-02 | `dd65c9d` | ~124 |
| `/api/admin/bills` | 2026-04-03 | `ab5c622` | ~123 |
| `/api/admin/clients` | 2026-04-04 | `f8f75b8` | ~122 |
| `/api/admin/dashboard` | 2026-04-04 | `f8f75b8` | ~122 |
| `/api/admin/leads` | 2026-05-13 | `1992adc` | ~83 |

Note also that `src/middleware.ts` was not added until 2026-04-07 (`c60897f`). Before that date the admin **pages** at `/admin/*` were unprotected too, not just the API.

Confirm these dates against your actual Amplify deploy history — a commit date is not a deploy date.

### Personal data reachable

| Table | Reached via | Personal data fields |
|---|---|---|
| `leads` | `GET /api/admin/leads` | `name`, `email`, `phone`, `company`, `message`, `budget_range`, `notes` |
| `clients` | `GET /api/admin/clients` | `name`, `email`, `phone`, `company`, `address`, `gst_number` |
| `inspection_files` | `GET /api/admin/inspection/files`, `/export` | `customer_name`, `customer_phone`, `property_address`, `property_value`, `notes` |
| `bills` | `GET /api/admin/bills` | Financial records joined to `clients` |
| `expenses` | `GET /api/admin/expenses` | Business financial records |

### The highest-severity endpoint

`GET /api/admin/inspection/files/export` is the worst of the set. `getInspectionFilesForExport` (`src/lib/inspection-files.ts`) builds its query with **no `LIMIT` clause** — with no filter parameters it returns *every* inspection file, across 23 columns including `customer_name`, `customer_phone`, `property_address`, and `property_value`, packaged as a downloadable Excel or PDF file.

Every other endpoint paginates at 20 records, so bulk extraction there required iterating pages — which leaves an obvious sequential-request signature in logs. The export endpoint required **one anonymous GET**. Prioritise it in log analysis.

### Why the inspection data raises the stakes

`inspection_files` holds data about **bank loan customers** — people who are not Biznexa's own customers. Biznexa appears to process this on behalf of the banks named in `inspection_banks`.

That likely makes Biznexa a **Data Processor** for those banks in respect of this data, which typically brings contractual breach-notification duties to each bank, on timelines set by those contracts — often shorter than statutory ones. Those obligations exist independently of DPDP.

**[HUMAN] Locate and read the service agreements with every bank in `inspection_banks`.** Their notification clauses may be the most time-critical obligation in this whole document.

---

## What cannot be determined from the code

Be honest about this boundary. Nothing in the repository can tell you:

- Whether anyone actually called these endpoints
- Whether logging was enabled to answer that question
- How many live records exist in each table
- What the bank contracts require

Phases 1 and 2 exist to answer the first three. The fourth is a human task.

---

## Phase 0: Preserve evidence (do today)

Log retention is finite and default retention is often short. Everything here is cheap and reversible; not doing it may be neither.

### Task 1: Freeze log retention

- [ ] **Step 1: [HUMAN] Identify where request logs live**

Check each, in the AWS console for the account hosting `biznexa.tech`:

- **CloudFront standard logs** — CloudFront → your distribution → Logging. Note the S3 bucket and prefix if enabled.
- **CloudFront real-time logs** — separate feature, check Kinesis config.
- **Amplify access logs** — Amplify → your app → Monitoring → Access logs. Amplify retains these for a limited window.
- **AWS WAF logs** — only if a WAF is attached.
- **CloudTrail** — records AWS API calls, *not* HTTP requests to your site. Useful for spotting console/credential misuse, not for this exposure.

- [ ] **Step 2: [HUMAN] Extend retention on anything that expires**

Set the S3 lifecycle policy on the CloudFront log bucket so nothing is deleted for at least 12 months. If logs land in CloudWatch, set retention to "Never expire" for now.

- [ ] **Step 3: Pull the Amplify access logs to local storage immediately**

Amplify's retention window is short — this is the log most likely to disappear.

```bash
aws amplify generate-access-logs --app-id <APP_ID> --domain-name biznexa.tech --start-time 2026-03-28 --end-time 2026-08-05 --region ap-south-1
```

That returns a presigned S3 URL. Download it and keep the file somewhere durable and access-controlled — **not** in this git repository.

- [ ] **Step 4: Snapshot the database**

Take an RDS/Aurora snapshot and label it `pre-incident-assessment-2026-08-04`. It fixes the record counts as of the awareness date, which you will need for scoping and for any notification.

- [ ] **Step 5: Write down the timeline so far**

Create a plain file (outside the repo) recording: when the vulnerability was identified (2026-08-04), how, what was confirmed, who was told, and when the fix deployed. Contemporaneous notes matter if a regulator or a bank asks later.

---

## Phase 1: Determine whether logging exists at all

Everything downstream depends on the answer.

### Task 2: Establish log coverage

- [ ] **Step 1: [HUMAN] Answer these three questions in writing**

1. Were CloudFront standard logs enabled? From what date?
2. Do the logs cover the full window back to 2026-03-28?
3. Do they include the URI path and query string? (CloudFront standard logs include `cs-uri-stem` and `cs-uri-query`.)

- [ ] **Step 2: Branch on the answer**

- **Logs exist and cover the full window** → proceed to Phase 2. You can reach an evidence-based conclusion.
- **Logs exist but cover only part of the window** → proceed to Phase 2 for the covered period. For the uncovered period you cannot demonstrate absence of access; say so explicitly in your write-up rather than implying it was clean.
- **No logs at all** → skip to Phase 3, and go into Phase 4 knowing you cannot rule out access. **[HUMAN]** Expect counsel to advise a more conservative notification posture. Enable logging now regardless.

Record the answer in your timeline file before moving on.

---

## Phase 2: Analyse the logs

### Task 3: Set up querying

- [ ] **Step 1: Create an Athena table over the CloudFront logs**

Athena is the practical way to query months of CloudFront logs. In the Athena console:

```sql
CREATE EXTERNAL TABLE IF NOT EXISTS cf_logs (
  `date` DATE,
  time STRING,
  location STRING,
  bytes BIGINT,
  request_ip STRING,
  method STRING,
  host STRING,
  uri STRING,
  status INT,
  referrer STRING,
  user_agent STRING,
  query_string STRING,
  cookie STRING,
  result_type STRING,
  request_id STRING,
  host_header STRING,
  request_protocol STRING,
  request_bytes BIGINT,
  time_taken FLOAT,
  xforwarded_for STRING,
  ssl_protocol STRING,
  ssl_cipher STRING,
  response_result_type STRING,
  http_version STRING,
  fle_status STRING,
  fle_encrypted_fields INT,
  c_port INT,
  time_to_first_byte FLOAT,
  x_edge_detailed_result_type STRING,
  sc_content_type STRING,
  sc_content_len BIGINT,
  sc_range_start BIGINT,
  sc_range_end BIGINT
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
LOCATION 's3://<YOUR-LOG-BUCKET>/<PREFIX>/'
TBLPROPERTIES ('skip.header.line.count'='2');
```

Replace the `LOCATION` with your actual bucket and prefix.

- [ ] **Step 2: Confirm the table reads**

```sql
SELECT COUNT(*) FROM cf_logs;
```

Expected: a non-zero count. Zero means the location or format is wrong — fix before drawing conclusions from empty results.

### Task 4: Hunt for exploitation

Run each query and save the full output to your evidence folder, including the empty ones. "We ran this query and it returned nothing" is itself a finding worth keeping.

- [ ] **Step 1: Every admin API request in the window**

```sql
SELECT "date", time, request_ip, method, uri, status, user_agent
FROM cf_logs
WHERE uri LIKE '/api/admin/%'
  AND "date" BETWEEN DATE '2026-03-28' AND DATE '2026-08-05'
ORDER BY "date", time;
```

This is the master list. Everything else narrows it.

- [ ] **Step 2: The export endpoint specifically — highest priority**

```sql
SELECT "date", time, request_ip, uri, status, sc_content_len, user_agent
FROM cf_logs
WHERE uri LIKE '/api/admin/inspection/files/export%'
ORDER BY "date", time;
```

Any `200` here from an IP that is not Sukanta's is a probable full extraction of the inspection book. A large `sc_content_len` confirms a substantial payload was returned.

- [ ] **Step 3: Rank source IPs by volume**

```sql
SELECT request_ip,
       COUNT(*) AS hits,
       COUNT(DISTINCT uri) AS distinct_paths,
       MIN("date") AS first_seen,
       MAX("date") AS last_seen,
       SUM(sc_content_len) AS total_bytes
FROM cf_logs
WHERE uri LIKE '/api/admin/%'
GROUP BY request_ip
ORDER BY hits DESC;
```

- [ ] **Step 4: Separate legitimate admin traffic from everything else**

**[HUMAN]** Identify Sukanta's own IPs — home/office broadband, mobile data, any VPN. Traffic from those is expected: the admin UI calls these endpoints constantly during normal use, so volume alone is not suspicious.

What matters is traffic from *other* IPs. Build the exclusion list, then:

```sql
SELECT request_ip, COUNT(*) AS hits, MIN("date") AS first_seen, MAX("date") AS last_seen
FROM cf_logs
WHERE uri LIKE '/api/admin/%'
  AND request_ip NOT IN ('<known-ip-1>', '<known-ip-2>')
GROUP BY request_ip
ORDER BY hits DESC;
```

- [ ] **Step 5: Look for pagination sweeps**

The paginated endpoints cap at 20 records, so bulk collection means walking `?page=1,2,3…`. That pattern is distinctive:

```sql
SELECT request_ip, "date", COUNT(*) AS requests, COUNT(DISTINCT query_string) AS distinct_pages
FROM cf_logs
WHERE uri LIKE '/api/admin/leads%' OR uri LIKE '/api/admin/clients%'
   OR uri LIKE '/api/admin/inspection/files%'
GROUP BY request_ip, "date"
HAVING COUNT(DISTINCT query_string) > 5
ORDER BY distinct_pages DESC;
```

- [ ] **Step 6: Check for scanner and tooling signatures**

```sql
SELECT request_ip, user_agent, COUNT(*) AS hits
FROM cf_logs
WHERE uri LIKE '/api/admin/%'
  AND (
    LOWER(user_agent) LIKE '%curl%' OR LOWER(user_agent) LIKE '%python%'
    OR LOWER(user_agent) LIKE '%wget%' OR LOWER(user_agent) LIKE '%go-http%'
    OR LOWER(user_agent) LIKE '%scanner%' OR LOWER(user_agent) LIKE '%nuclei%'
    OR LOWER(user_agent) LIKE '%ffuf%' OR LOWER(user_agent) LIKE '%gobuster%'
    OR LOWER(user_agent) LIKE '%httpx%' OR user_agent = '-'
  )
GROUP BY request_ip, user_agent
ORDER BY hits DESC;
```

A browser-like user agent does not clear anyone — it is trivially spoofed. Treat these as signals, not proof.

- [ ] **Step 7: Check for unauthorised writes**

Reads are one problem; silent modification is another.

```sql
SELECT "date", time, request_ip, method, uri, status
FROM cf_logs
WHERE uri LIKE '/api/admin/%'
  AND method IN ('POST', 'PUT', 'PATCH', 'DELETE')
  AND request_ip NOT IN ('<known-ip-1>', '<known-ip-2>')
ORDER BY "date", time;
```

Pay particular attention to `/api/admin/upload` — it accepted SVG, which executes script when served from your origin. Any unrecognised upload is a potential stored-XSS payload.

- [ ] **Step 8: Cross-check uploads against disk**

```bash
ls -la public/uploads/
```

Compare filenames against upload requests in the logs. Anything on disk with no corresponding admin-session upload, or any `.svg` you do not recognise, needs inspection:

```bash
grep -il "script\|javascript:\|onload\|onerror" public/uploads/*.svg
```

Expected: no output. Any hit is a live stored-XSS payload — remove it and treat it as confirmed exploitation.

- [ ] **Step 9: Write the finding**

Record one of these three conclusions in your timeline file, with the supporting query output attached:

- **A — No evidence of access.** No admin API requests from any IP outside the known-good set, across a log window covering the full exposure period.
- **B — Evidence of access.** Specific IPs, timestamps, endpoints, and byte counts. List them.
- **C — Cannot determine.** Logs absent or incomplete for some or all of the window. State exactly which period is uncovered.

Be precise about which one applies. The gap between A and C is the difference between "we verified nothing was taken" and "we couldn't tell" — and that difference drives Phase 4.

---

## Phase 3: Scope what was at risk

Do this regardless of the Phase 2 finding. Any notification requires knowing how many people are affected.

### Task 5: Count the exposed records

**Counts already taken from the live database on 2026-08-04, immediately before the fix deployed:**

| Table | Live records |
|---|---|
| `leads` | 11 |
| `clients` | 6 |
| `inspection_files` | **178** |
| `bills` | 15 |
| `expenses` | 51 |

Every one of these existed during the exposure window, so this is the full affected population — no `created_at` filtering needed.

The 178 inspection files are the material number. Each carries `customer_name`, `customer_phone`, `property_address`, and `property_value` for a bank's loan customer — third-party personal data, not Biznexa's own contacts. That is the population driving the processor-contract obligations in Phase 4. The 17 leads and clients are Biznexa's own Data Principals.

Re-run the queries below only if you need the per-bank breakdown (Step 3) or want to re-confirm.

- [ ] **Step 1: Count live records per table**

Against the production database:

```sql
SELECT 'leads' AS source, COUNT(*) AS records,
       COUNT(DISTINCT email) AS distinct_people,
       MIN(created_at) AS oldest, MAX(created_at) AS newest
FROM leads
UNION ALL
SELECT 'clients', COUNT(*), COUNT(DISTINCT email), MIN(created_at), MAX(created_at) FROM clients
UNION ALL
SELECT 'inspection_files', COUNT(*), COUNT(DISTINCT customer_phone), MIN(created_at), MAX(created_at) FROM inspection_files
UNION ALL
SELECT 'bills', COUNT(*), COUNT(DISTINCT client_id), MIN(created_at), MAX(created_at) FROM bills;
```

- [ ] **Step 2: Restrict to records that existed during the exposure**

A record created after the fix deployed was never exposed. Filter each table by `created_at <= '<fix-deploy-timestamp>'` to get the true affected population. Use the actual deploy time from Amplify, not the commit time.

- [ ] **Step 3: Break the inspection data down by bank**

This drives who you have to tell under the processor contracts:

```sql
SELECT b.bank_name,
       COUNT(*) AS files,
       COUNT(DISTINCT f.customer_phone) AS distinct_customers
FROM inspection_files f
LEFT JOIN inspection_banks b ON b.id = f.bank_id
GROUP BY b.bank_name
ORDER BY files DESC;
```

- [ ] **Step 4: Produce the scoping summary**

One table: data category, number of individuals, field list, whose data it is (Biznexa's own contacts vs a bank's customers). This is the factual core of any notification and the first thing counsel will ask for.

---

## Phase 4: Notification decisions **[HUMAN — all steps]**

**Do not action any of this without a lawyer.** The engineering work above exists to give counsel accurate facts. The decisions are legal ones.

### Task 6: Assemble the decision pack

- [ ] **Step 1: Give counsel a single briefing pack**

Include: the timeline file, the Phase 2 finding (A/B/C with query output), the Phase 3 scoping summary, this document, and the list of affected banks with their contracts.

- [ ] **Step 2: Get a written determination on the threshold question**

Does what happened constitute a "personal data breach" under DPDP? A confirmed access (finding B) very likely does. Finding A or C is genuinely arguable, and it is counsel's call — not an engineering judgment and not one to make by default in either direction.

- [ ] **Step 3: If it is a breach — DPBI notification**

The DPDP Rules 2025 set out a two-stage process: an initial intimation without delay, followed by a detailed report to the Data Protection Board within **72 hours** of awareness. The clock runs from 2026-08-04. Counsel should confirm the current filing mechanism and required contents.

- [ ] **Step 4: If it is a breach — Data Principal notification**

DPDP requires notifying **each affected individual**, not only the Board, and there is no size threshold. In practice this means an email to every affected lead, client, and — subject to what the bank contracts say about who communicates with their customers — potentially the inspection customers too. Counsel should approve the wording before anything is sent.

- [ ] **Step 5: Assess the CERT-In obligation**

CERT-In's 2022 directions require reporting certain cyber incidents within **6 hours** of detection — a separate and much shorter clock than DPDP's. Counsel should determine whether "unauthorised access to data" as reported here falls within the specified categories.

- [ ] **Step 6: Notify the banks per contract**

Independent of statute. Contractual notification windows are often 24–48 hours and may already be running. This may be the most urgent item on the page.

- [ ] **Step 7: Record every decision and its reasoning**

Including decisions *not* to notify, and why. Demonstrating a documented, reasoned process matters if this is ever reviewed.

---

## Phase 5: Credential and integrity hygiene

Run these regardless of the Phase 2 outcome.

### Task 7: Rotate and verify

- [ ] **Step 1: Rotate the admin password**

After the Chunk 1 fix is deployed. Use the scrypt generator from Task 9 of the hardening plan if that chunk has landed.

- [ ] **Step 2: Invalidate all sessions**

```sql
DELETE FROM admin_sessions;
```

Harmless — everyone simply logs in again.

- [ ] **Step 3: Rotate database credentials**

`DB_LIVE_PASSWORD` was not exposed by this vulnerability — the leak was at the API layer, not the credential layer. Rotating is still cheap insurance if you cannot rule out broader access.

- [ ] **Step 4: Rotate SMTP credentials**

`/api/admin/bills/[id]/email` was open, meaning anyone could trigger mail from your configured sender. Check your SMTP provider's outbound log for messages you did not send — that is both an abuse indicator and a deliverability risk.

- [ ] **Step 5: Check `admin_users` for unauthorised accounts**

```sql
SELECT id, username, email, role, status, created_at, last_login FROM admin_users;
```

Expected: only accounts you recognise. Any unfamiliar row is confirmed compromise — escalate immediately.

- [ ] **Step 6: Sanity-check data integrity**

The write endpoints were open too. Spot-check recent records in `leads`, `clients`, `bills`, and `inspection_files` for rows you do not recognise or amounts that look wrong. The database snapshot from Phase 0 gives you a reference point.

---

## Phase 6: Prevent recurrence

### Task 8: Close the process gap

- [ ] **Step 1: Wire the verification script into the build**

`scripts/verify-admin-auth.mjs` from the hardening plan should run in CI against a preview deployment, failing the build if any admin endpoint answers anonymously. This class of bug must never reach production silently again.

- [ ] **Step 2: Enable logging permanently**

If Phase 1 found logging disabled, that is its own finding — you could not answer a basic security question about your own production system. Enable CloudFront standard logging to S3 with a 12-month lifecycle policy.

- [ ] **Step 3: Consider AWS WAF**

Rate limiting and basic bot rules in front of CloudFront would have made bulk extraction noisier and slower. Reasonable spend given the data involved.

- [ ] **Step 4: Add a route-auth checklist to the repo**

A short note in `AGENTS.md`: every new file under `src/app/api/admin/` starts with `requireAdmin()`, no exceptions. Cheap, and it addresses the actual root cause — the guard was never part of the pattern for adding a route.

---

## Definition of Done

- [ ] Logs preserved and retention extended (Phase 0)
- [ ] Log coverage question answered in writing (Phase 1)
- [ ] All Phase 2 queries run, output saved, finding recorded as A, B, or C
- [ ] `public/uploads/` audited, no malicious SVG present
- [ ] Affected-record counts produced, broken down by bank (Phase 3)
- [ ] **[HUMAN]** Counsel engaged and briefed with the full pack
- [ ] **[HUMAN]** Written determination on whether a notifiable breach occurred
- [ ] **[HUMAN]** Any required DPBI / Data Principal / CERT-In / bank notifications made, or a documented decision not to
- [ ] Admin password, sessions, DB and SMTP credentials rotated
- [ ] `admin_users` verified clean
- [ ] Verification script running in CI
- [ ] Production logging enabled permanently

---

## Sources

Statutory details above are drawn from these secondary sources and should be confirmed against the primary legislation and current DPBI guidance by counsel:

- [DPDP Breach Notification: 72-Hour Rule (2026) — ConsentOS](https://consentos.in/learn/breach-notification-requirements/)
- [DPDP Act Data Breach Notification Rules for Indian Businesses — Bachao.AI](https://www.bachao.ai/blog/dpdp-data-breach-notification-rules-india)
- [CERT-In vs DPDP: Dual Breach Notification Duties Explained — King Stubb & Kasiva](https://ksandk.com/data-protection-and-data-privacy/cert-in-vs-dpdp-dual-breach-notification-duties-explained/)
- [DPDP Breach Notification: 72-Hour Rule & ₹200 Cr Penalty — Matters.ai](https://www.matters.ai/article/dpdp-breach-notification)
- [DPDP Act Penalties Explained — DPDP Comply](https://dpdpcomply.com/blog/dpdp-act-penalties-explained)
- [DPDP Breach Notification: The 72-Hour Rule, CERT-In vs DPBI — ComplyZero](https://www.complyzero.com/blog/data-breach-notification-india)
