---
name: searching-sourcegraph
description: Search Sourcegraph-indexed codebases for implementation patterns, code examples, and system understanding. Use when implementing new features, debugging issues, understanding unfamiliar code, or finding how something was done before. Triggers on questions about existing code, patterns, or "how does X work" queries.
---

# Searching Sourcegraph

Search before you build. Sourcegraph gives you cross-repository code search, compiler-accurate code navigation, and version control history — use them as a loop:

**Search → Navigate → Read → History → Validate (repeat, narrowing each iteration)**

Your goal is not "find any match" — it is **find the authoritative, actively-used implementation, confirm all call sites, and understand how it evolved**.

## 1) Decision framework: what are you trying to do?

### A. You have a symbol name (function, type, class, variable)

Use **code navigation** first — it is compiler-accurate, not a text search:

- `sourcegraph:go_to_definition` — jump to the real definition, even cross-repository
- `sourcegraph:find_references` — enumerate every usage, including transitive call sites

Then `sourcegraph:read_file` the definition and key call sites.

> Rule: if the question is "where is this defined" or "where is this used", start with navigation — not search.

### B. You have an exact string (error message, endpoint path, config key, env var)

Use `sourcegraph:keyword_search` with repo/file scoping. Once you identify the symbol that owns that string, switch to navigation.

### C. You only know the concept ("the thing that handles X")

Use `sourcegraph:nls_search` to discover candidate names and files, then `sourcegraph:keyword_search` to tighten, then `sourcegraph:go_to_definition` / `sourcegraph:find_references` to make it precise.

### D. You need to understand a subsystem or flow end-to-end

Start broad with semantic search, then trace precisely:

1. `sourcegraph:nls_search` — discover entry points and key modules
2. `sourcegraph:keyword_search` — confirm and tighten with exact terms
3. `sourcegraph:go_to_definition` / `sourcegraph:find_references` — trace the real dependency graph
4. `sourcegraph:read_file` — read entry points and core modules

## 2) Scoping: the most important habit

Always start with the smallest scope that can plausibly contain the answer, then expand.

### Scope ladder (use in order)

1. **Single repo** — `repo:^github.com/ORG/REPO$`
2. **Repo family** — `repo:github.com/ORG/SERVICE` (prefix match for service + its libraries)
3. **Org-wide** — `repo:github.com/ORG/` (only when you have evidence it spans repos)

### Narrowing with file filters

```
file:src/              # source directory
file:.*\.py$           # by extension
file:test              # test files
file:.*\.proto$        # proto definitions
-file:vendor           # exclude vendored code
-file:generated        # exclude generated code
```

Combine: `repo:^github.com/ORG/REPO$ file:src/handlers keyword`

### When results are too many

- Add one more distinguishing term (domain noun, error code, config key)
- Constrain `file:` to a likely directory
- Switch from `sourcegraph:nls_search` → `sourcegraph:keyword_search` once you know the right vocabulary

### When results are too few

- Remove `file:` constraints first
- Try synonyms via `sourcegraph:nls_search`
- Expand repo scope one rung up the ladder

**Checkpoint:** after each search, you should be able to say "these are the top 1–3 candidate entry points." If you cannot, adjust scope or query and rerun.

## 3) Quick decision trees

### "Where is X implemented?"

- X is a symbol → `sourcegraph:go_to_definition`
- X is a concept → `sourcegraph:nls_search` → identify symbol → `sourcegraph:go_to_definition`

### "Where is X used?"

- X is a symbol → `sourcegraph:find_references`
- X is a string → `sourcegraph:keyword_search` → identify owning symbol → `sourcegraph:find_references`

### "How does A turn into B?" (tracing a flow)

1. `sourcegraph:keyword_search` for the entry point (HTTP handler, CLI command, queue consumer, RPC method)
2. `sourcegraph:read_file` the entry point
3. `sourcegraph:find_references` on key functions/types to follow the chain inward
4. Repeat steps 2–3, following references deeper until the flow is clear

> Tip: if your first search lands in a low-level helper, step back and find the entry point that calls it. Trace flows outside-in, not inside-out.

### "Why did this change / when was it introduced?"

1. `sourcegraph:commit_search` for the symbol or string (scope to repo, use `after`/`before`)
2. `sourcegraph:diff_search` to see exact lines added/removed
3. `sourcegraph:compare_revisions` if you have two known versions to compare
4. Read the commit message + diff, then return to current code

### "Who has worked on this area?"

1. `sourcegraph:get_contributor_repos` to find which repos an author touches
2. `sourcegraph:commit_search` with `authors` filter to find their changes
3. `sourcegraph:diff_search` to see what they specifically changed

## 4) Workflow recipes

### Implementing a feature by copying an existing pattern

1. `sourcegraph:nls_search` — concept search scoped to likely repo ("idempotency for webhook processing")
2. `sourcegraph:keyword_search` — tighten with terms discovered in step 1
3. `sourcegraph:read_file` — read 1–2 representative files carefully (do not skim 10)
4. `sourcegraph:find_references` — discover other implementations, tests, shared utilities
5. If behavior crosses repos, expand `repo:` scope and repeat steps 2–4

**Validate:** you found one canonical implementation, one test, and the shared utility (if any).

### Debugging an error

1. `sourcegraph:keyword_search` — exact error string/code, scoped to the service
2. `sourcegraph:read_file` — read the throw/log site
3. `sourcegraph:go_to_definition` — if it is a constant or symbol
4. `sourcegraph:find_references` — all places the error is produced or handled
5. `sourcegraph:diff_search` / `sourcegraph:commit_search` — what recently changed around it

**Validate:** you can explain the preconditions, the intended handling path, and what likely introduced the regression.

### Understanding an unfamiliar subsystem

1. `sourcegraph:nls_search` — semantic search for the subsystem's key concepts to find entry points
2. `sourcegraph:keyword_search` — confirm entry points and find core types/modules
3. `sourcegraph:read_file` — read the entry point + one core module
4. `sourcegraph:find_references` — trace one central type/event to discover the real dependency graph

**Validate:** you can describe the subsystem's entry points, core types, and how data flows through it — grounded in actual code you have read.

### Safely changing a widely used API

1. `sourcegraph:go_to_definition` — read the current API
2. `sourcegraph:find_references` — enumerate all call sites (cross-repo if applicable)
3. `sourcegraph:read_file` — read a few representative call sites and cluster them into 2–4 dominant usage patterns
4. `sourcegraph:commit_search` — learn prior refactors or compatibility constraints
5. If usage patterns diverge significantly, plan staged changes or an adapter layer rather than a single breaking change
6. Make the change; update the most representative tests first

**Validate:** you can list all impacted repos, the dominant usage patterns, and any compatibility constraints.

## 5) Tool result limits — know the ceilings

| Tool | Limit | Implication |
|------|-------|-------------|
| `sourcegraph:keyword_search` | 15 files, 3 chunks each, lines truncated at 200 chars | **Not exhaustive.** Do not use to enumerate "all usages" — use `sourcegraph:find_references` instead. |
| `sourcegraph:nls_search` | 15 files, 3 chunks each, lines truncated at 200 chars | Same as keyword. Use for discovery, not completeness. |
| `sourcegraph:read_file` | 128KB file size limit | Use `startLine`/`endLine` for large files. |
| `sourcegraph:commit_search` | 50 results (100 with date filters) | Use `after`/`before` to narrow time range if hitting the cap. |
| `sourcegraph:compare_revisions` | 50 file diffs (100 max) | Use `after` cursor to paginate large diffs. |
| `sourcegraph:list_files` | 1000 entries | Sufficient for most directories. |

**Critical rule:** `sourcegraph:keyword_search` and `sourcegraph:nls_search` return at most 15 files. If you need to find **all** call sites or usages of a symbol, you **must** use `sourcegraph:find_references` — it uses compiler information and is not subject to the 15-file cap. Never assume a keyword search found everything.

## 6) Common mistakes

| Mistake | Fix |
|---------|-----|
| Searching org-wide by default | Start repo-scoped; expand only with evidence |
| Using `sourcegraph:keyword_search` for "all usages" | If you can identify a symbol, use `sourcegraph:find_references` (compiler-accurate) |
| Relying on semantic search alone for precision | Use `sourcegraph:nls_search` for discovery, then switch to navigation for accuracy |
| Reading too many files shallowly | Read 1–2 files deeply, then pivot via references |
| Stopping after finding "a match" | Confirm it is canonical: check references, tests, and history |
| Broad `sourcegraph:nls_search` with no scoping | Always add `repo:` filter; add `file:` when possible |
| Wasting cycles in generated or vendored code | If results include protobuf stubs, vendored deps, or checked-in `node_modules`, add `-file:vendor -file:generated -file:_pb -file:node_modules` to filter them out |

## 7) Search hygiene checklist

Before concluding a search task, check whichever items are relevant to the task:

- [ ] Scoped correctly (repo/file) — expanded only as needed
- [ ] Switched from search → navigation once symbols were identified
- [ ] Read at least one defining file and one representative call site
- [ ] Checked tests or examples for intended usage patterns
- [ ] Consulted commit/diff history if behavior may have changed

If a relevant item is unchecked, run one more loop. Stop after **3 total search iterations** — if you still lack confidence, present what you found and flag the gaps to the user rather than continuing to search.
