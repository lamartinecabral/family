# Project Evolution Roadmap

## Purpose

Family builds a Supabase dataset from the IBGE 2022 surname API and presents
the surnames that are comparatively most typical of each Brazilian state. The
repository contains the ingestion scripts, the database schema and generated
types, API integration tests, and a static React client in `dist/`.

## Delivered

### Supabase integration

- `scripts/supabase.ts` creates typed Supabase clients from
  `scripts/supabase.types.ts`.
- Read-only application access uses `SUPABASE_PROJECT_ID` and
  `SUPABASE_PUBLISHABLE_KEY`.
- Import scripts use `SUPABASE_PROJECT_ID` and `SUPABASE_SECRET_KEY` so writes
  bypass row-level security.
- Applying the schema directly through PostgreSQL also requires
  `SUPABASE_PASSWORD`.
- `.env.example` lists all four variables without values. Keep `.env` private.

### Normalized data model

`scripts/schema.sql` is the current schema reference. It defines four tables:

| Table | Purpose |
| --- | --- |
| `sobrenomes` | One row per surname; `nome` is the primary key. |
| `localidades` | The IBGE locality code, name, UF, and 2022 local population. Locality `0` represents Brazil. |
| `frequencias` | The recorded frequency for a surname at Brazil or a state, linked to `sobrenomes` and `localidades`. |
| `frequencias_analise` | State-level derived measures for a surname: `share`, `concentracao`, and `quociente_locacional`. |

All four tables enable row-level security and expose a public `SELECT` policy.
The schema indexes `(nome, localidade)` and
`(localidade, quociente_locacional)` in `frequencias_analise` for the client
queries. It does not yet use versioned migrations.

For each state-level frequency, the importer calculates:

$$
\begin{aligned}
\mathrm{share} &= \frac{\mathrm{state\ surname\ frequency}}{\mathrm{national\ surname\ frequency}} \\
\mathrm{concentracao} &= \frac{\mathrm{state\ surname\ frequency}}{\mathrm{state\ population}} \\
\mathrm{quociente\ locacional} &= \frac{\mathrm{concentracao}}{\mathrm{national\ surname\ frequency} / \mathrm{Brazil\ population}}
\end{aligned}
$$

A location quotient above $1$ means that the surname is more common in the
state than its national baseline would predict.

### IBGE client and import

- `scripts/ibge.ts` calls the IBGE surname-ranking, surname-detail, and state
  locality endpoints. Zod validates each response and a 1.5-second delay spaces
  API calls.
- `scripts/fetch-ibge-data.ts` initializes `localidades` only when the table is
  empty. It derives the state localities from the `Silva` response and inserts a
  Brazil row whose population is the sum of the state populations.
- For each imported surname, the script stores national and available state
  frequencies, then writes the state analysis rows.
- Failed API requests are retried up to three times, with a one-second pause
  between attempts.
- National rankings are paginated until the frequency falls below 5,180.
  Each non-Brazil locality is processed for up to 30 ranking pages, stopping
  early when the ranking is empty or its frequency falls below 1,000.
- Before inserting a ranked surname, the importer checks whether its name is
  already present. This avoids duplicate surname rows on a rerun, but it does
  not repair a partially written surname whose first insert succeeded before a
  later insert failed.

### Browser client

- `dist/index.html` loads a React and TypeScript application in the browser via
  Babel, Tailwind CDN, and the Supabase JavaScript CDN bundle. `npm start`
  serves `dist/` at port 8000.
- The client loads non-Brazil localities, lets the visitor filter the state list
  by region, and defaults to Ceara (`CE`).
- For the selected state, it reads `frequencias_analise` in pages of 30 rows,
  ordered by descending location quotient. The UI requests an exact row count,
  shows the current page and total results, and lets visitors move between
  pages while preserving global ranks.
- Expanding a surname loads its state analysis rows and displays its national
  distribution, including the top five location quotients and a complete state
  table.
- The checked-in `dist/index.tsx` has empty `projectId` and `supabaseKey`
  constants. The client cannot fetch project data until a deployment-safe
  configuration mechanism supplies a Supabase project ID and publishable key.

### Validation

- `npm test` runs three network-backed IBGE integration tests: ranking, a
  surname detail lookup, and state locality data.
- `npm run typecheck` runs TypeScript without emitting JavaScript.
- Pagination was smoke-tested in the browser against the live Supabase data:
  Ceará returned 1,999 surnames across 67 pages, and page 2 began at rank 31.

## Remaining Limitations

- The UI assumes a selected surname has data for all 27 states when it labels
  the detail view. The current importer only stores states returned in the
  IBGE `top_ufs` response, so this label needs to become data-driven.
- The static client is a prototype delivery path: it has no build step,
  runtime configuration, or browser-level test coverage.

## Next Milestones

1. Make reruns safe at the frequency and analysis-row level with constraints
  and upserts or a repair pass.
2. Add versioned Supabase migrations and preserve the generated type update in
   the schema-change workflow.
3. Replace the client-side placeholder credentials with deployment-time public
   configuration, and verify the public read policies against the deployed
   application.
4. Make the UI's coverage labels reflect returned data, then add focused tests
   for its Supabase queries and empty, loading, and error states.
5. Add import progress reporting and data-quality checks for locality coverage,
   duplicate frequencies, and consistency between raw and derived rows.

## Working Agreement

- Treat `scripts/schema.sql` as the active schema reference until migrations
  replace it.
- Run `npm run schema` to apply the schema with the configured database
  credentials.
- Run `npm run typegen` after a schema change to regenerate
  `scripts/supabase.types.ts`.
- Run `node scripts/fetch-ibge-data.ts` to populate or continue the current
  import using the current national and state frequency thresholds.
- Run `npm run typecheck` and `npm test` before relying on a code change; the
  tests require network access to the IBGE API.