# Executor Prompt — for handing the plans to another model

## How to use this

1. Fill in the `CHUNK TO EXECUTE` line with exactly one chunk.
2. Paste the whole block below into the executor model (DeepSeek V4 or similar) with repo access.
3. When it reports back, bring the report here for review before running the next chunk.

**Run chunks in order. Chunk 1 must be reviewed and deployed before Chunk 2 starts** — it is the live security fix.

**Do not hand the incident-assessment plan to a code executor.** It is AWS console work, log forensics, and legal judgment. Most of its steps are marked `[HUMAN]` and an LLM executor cannot do them.

---

## The prompt

```text
You are implementing a pre-written engineering plan in the Biznexa repository.
Your work will be reviewed by a supervising model afterwards, commit by commit,
against the plan. Accuracy and faithfulness to the plan matter far more than
speed or cleverness.

CHUNK TO EXECUTE: <<< FILL IN: "Chunk 1", "Chunk 2", "Chunk 3", or "Chunk 4" >>>

PLAN FILE: docs/superpowers/plans/2026-08-04-admin-auth-hardening.md

=== READ THIS FIRST ===

Read the entire plan file before writing any code, including the "Context You
Need Before Starting" section. It explains a real, live security vulnerability
that you are fixing. Then execute ONLY the chunk named above. Do not start,
preview, or "helpfully" begin any other chunk.

=== WHAT THIS IS ===

The Biznexa admin API is currently reachable by anyone on the internet with no
authentication. Customer lead data, client records, bills, and bank-inspection
records containing third-party personal data are exposed in production right
now. The plan closes that hole. Treat it with the care that implies.

=== ABSOLUTE PROHIBITIONS ===

These are not preferences. Violating any of them is a failed run, even if
everything else is perfect.

1. NEVER run anything against production.
   - Do not set DB_TARGET=live.
   - Do not set VERIFY_BASE_URL to any https:// URL.
   - Do not curl, fetch, or probe biznexa.tech or www.biznexa.tech.
   - Localhost only, always.

2. NEVER apply database migrations to the live/Aurora database.
   Local MySQL (the XAMPP instance, database d2w_cms) only.

3. NEVER run `git push`. Commit locally; a human pushes.

4. NEVER perform Task 8 ("Deploy chunk 1 and confirm the live fix"). It is
   human-only. Stop after Task 7 when executing Chunk 1.

5. NEVER touch AWS — no console, no CLI, no Amplify, no CloudFront, no S3.

6. NEVER delete or UPDATE rows in any database except as a migration file in
   db/ that the plan explicitly tells you to create. Read-only SELECTs for
   verification are fine.

7. NEVER commit .env.local, credentials, tokens, passwords, or database dumps.
   If you need a test admin password, generate one locally and do not put it in
   any committed file.

8. NEVER weaken, bypass, or remove an auth check to make something work. If a
   page or test breaks after adding the guard, that is a finding to report, not
   a thing to work around by removing the guard.

9. NEVER fabricate command output. If you cannot run a command — no MySQL
   available, no dev server, no network — say so plainly and mark that step
   BLOCKED. Inventing plausible-looking output is the single worst thing you
   can do here, because the supervising review depends on your output being
   real. "I could not run this" is always an acceptable answer. Making
   something up is never acceptable.

=== EXECUTION RULES ===

1. Work through the chunk's tasks strictly top to bottom. No reordering, no
   skipping, no batching several tasks into one commit.

2. Use the exact code given in the plan. It was written against the actual
   files in this repository. Do not restructure it, rename its variables,
   "modernise" it, or add abstractions the plan did not ask for.

3. Run every verification step exactly as written and capture the REAL output
   verbatim. Do not paraphrase it.

4. If actual output does not match the plan's "Expected:" line — STOP.
   Do not improvise a fix. Report which step failed, what you expected, what
   you got, and your best diagnosis. A wrong turn taken confidently is much
   more expensive to unpick than a clean stop.

5. Change only the files the plan names. If you notice an unrelated bug, note
   it in your final report. Do not fix it.

6. Commit after each task using the commit message given in the plan. Do not
   squash tasks together.

7. If a plan step is genuinely ambiguous, choose the most conservative reading
   — the one that changes the least — and flag the ambiguity in your report.

=== CHUNK-SPECIFIC WARNINGS ===

If executing Chunk 1, these four are where executors most often go wrong:

  a) Task 6 touches 28 files and 43 handlers. Every single exported handler
     needs the guard. The objective check is in Task 6 Step 2 — the grep must
     output exactly 43. If it does not, you have missed one. Find it; do not
     round up or explain the discrepancy away.

  b) Do NOT add the guard to the three files under src/app/api/admin/auth/
     (login, logout, me). Login and logout must stay reachable anonymously or
     nobody can ever log in again. The plan says this explicitly.

  c) Do NOT extend the middleware matcher in src/middleware.ts to cover
     /api/admin/*. This looks like an obvious improvement and it is not — the
     plan's Task 7 explains why (edge runtime cannot reach MySQL; a cookie-
     existence check is trivially forged; it returns HTML redirects where the
     admin UI expects JSON 401s). Task 7 is comment-only.

  d) The guard goes FIRST inside each handler — before request.json(), before
     reading searchParams, before awaiting params. Rejecting unauthenticated
     callers before doing any work is the entire point.

=== ENVIRONMENT NOTES ===

- Windows. The shell is PowerShell; a bash shell is also available. The plan's
  commands are written for bash — adapt syntax where needed, but do not change
  what a command actually does.
- Copy .env.example to .env.local and fill in the DB_LOCAL_* values for the
  local XAMPP MySQL. Keep DB_TARGET=local.
- Start the dev server with `npm run dev`.
- There is no test framework in this repo. That is expected and known. Do not
  add vitest, jest, or any test runner — the plan explains why. Verification is
  scripts/verify-admin-auth.mjs plus tsc and lint.

=== REPORT BACK IN THIS FORMAT ===

When you finish the chunk (or stop early), produce exactly this:

## Chunk executed
<which chunk>

## Status
COMPLETE | STOPPED AT TASK N | BLOCKED

## Commits
<one line per commit: short SHA + message subject>

## Verification output
Paste the REAL, verbatim output of each of these that you were able to run:
- The Task 6 handler count grep (must print 43 for Chunk 1)
- `grep -rLn "requireAdmin" src/app/api/admin --include=route.ts`
- `npx tsc --noEmit`
- `npm run lint`
- `node scripts/verify-admin-auth.mjs` (anonymous run)
- `node scripts/verify-admin-auth.mjs` (with VERIFY_USERNAME / VERIFY_PASSWORD)
For anything you could not run, write: BLOCKED — <reason>. Do not fake it.

## Files changed
<full list, grouped by task>

## Deviations from the plan
<every place your implementation differs from the plan text, and why. Write
"None" only if it is genuinely none.>

## Problems found
<anything that broke, looked wrong, or that you could not verify — including
unrelated issues you noticed and correctly did not fix>

## Not done
<anything in the chunk you did not complete, and why>

=== FINAL REMINDER ===

The supervising review will re-run your verification commands independently and
read every diff against the plan. Discrepancies will be found. An honest report
of a partial run is a good outcome; a confident report that does not match the
actual repository state is a bad one. Report what you actually did.
```

---

## Reviewer checklist (for the supervising model, after each chunk)

Independent of whatever the executor reported:

- [ ] Re-run the handler count grep — must be exactly `43` after Chunk 1
- [ ] `grep -rLn "requireAdmin" src/app/api/admin --include=route.ts` returns only the three `auth/` files
- [ ] Read every diff in `git log -p` for the chunk against the plan text
- [ ] Confirm the guard is the first statement in every handler, not buried after body parsing
- [ ] Confirm `src/middleware.ts` matcher was NOT extended
- [ ] Confirm no `.env*` file, credential, or dump was committed
- [ ] Confirm nothing was pushed (`git log origin/main..main` shows the new commits as unpushed)
- [ ] Re-run `npx tsc --noEmit`, `npm run lint`, and the verification script; compare to the reported output
- [ ] Check for scope creep — files changed that the plan does not name
- [ ] Verify the reported output actually matches reality (the fabrication check)
