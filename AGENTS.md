<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes â€” APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

## Database migrations

Schema changes go in `db/migrations/` as `NNNN_description.sql`, numbered in
order. A runner applies pending ones and records them in `schema_migrations`,
and `amplify.yml` runs it before every build, so a deploy fails loudly rather
than shipping code against a schema that lacks its columns.

```bash
npm run migrate:status   # what is applied and what is pending
npm run migrate          # apply pending migrations
npm run migrate:baseline # record all as applied WITHOUT running (existing databases)
```

Target follows `DB_TARGET`, exactly as the app does. Add `--target=live` to
point one run at production.

Two rules when writing a migration:

1. **Make it idempotent.** Use `CREATE TABLE IF NOT EXISTS`, and guard column
   and index changes with an `information_schema` check. See
   `0013_case_studies_project_url.sql` for the pattern.
2. **Never use `ADD COLUMN IF NOT EXISTS`.** It is MariaDB-only. Local XAMPP is
   MariaDB 10.4 but production is MySQL 8.4, where that form is a syntax error,
   so it passes locally and breaks the deploy.

`db/schema.sql` and `db/d2w_cms_export.sql` are bootstrap dumps, not migrations,
and sit deliberately outside `db/migrations/`.
