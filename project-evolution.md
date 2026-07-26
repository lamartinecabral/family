# Project Evolution

This document records the development of **Family**, a project that explores
which surnames are most characteristic of each Brazilian state using data from
the 2022 IBGE Census. The implementation follows a pipeline: collect source
data from IBGE, persist and analyse it in Supabase, then publish a static
interface for exploration.

## 1. Define the Project Purpose

The project began with a question that raw nationwide surname rankings cannot
answer well: which surnames are disproportionately present in a specific state?
The objective is therefore to analyse surname predominance in each Unidade da
Federacao, rather than simply list the most frequent surnames in Brazil.

The result is a ranking of the "familias tipicas" of a state. It uses the
**location quotient (QL)** to compare local prevalence with the national
baseline:

$$
QL = \frac{\text{surname frequency in the state} / \text{state population}}
{\text{surname frequency in Brazil} / \text{Brazil population}}
$$

A value above $1$ means the surname is more concentrated in that state than in
Brazil overall. This metric avoids letting common nationwide surnames dominate
the analysis and makes regional patterns easier to identify.

`README.md` captures the project scope and data flow: IBGE supplies census
data, Supabase stores the prepared dataset, and a static web application
presents the results.

## 2. Connect to the IBGE API

The source-integration phase established `src/ibge.ts` as the boundary for the
IBGE Nomes API. It exposes three asynchronous operations:

- `sobrenomeRanking(page, localidade)` retrieves a paginated 2022 surname
  ranking for Brazil or a specified locality.
- `sobrenomeData(sobrenome, localidade)` retrieves a surname's national
  frequency and its state-level frequencies.
- `ufsData()` obtains state codes, names, abbreviations, and local populations
  from the response for `silva`.

Each request waits 1.5 seconds before calling the service. Zod validates the
response shape before data enters the rest of the application, ensuring the
importer receives surname, frequency, locality, and population data in the
expected structure. `src/ibge.test.ts` provides lightweight integration checks
for all three operations. The Node.js and TypeScript setup, including Zod and
the test script, is configured in `package.json` and `tsconfig.json`.

## 3. Configure Supabase and the Database Schema

The database phase created a normalized Supabase/Postgres model in
`supabase/schema.sql`:

- `sobrenomes` stores each surname once, keyed by `nome`.
- `localidades` stores Brazil and the federative units with their IBGE codes
  and census populations.
- `frequencias` stores the raw census frequency of a surname in a locality.
- `frequencias_analise` stores the derived ranking metrics: `share`,
  `concentracao`, and `quociente_locacional`.

Foreign keys link the frequency tables to valid surnames and localities. The
analysis table indexes the two main access paths: a surname across localities
and a locality ordered by location quotient. Every table enables row-level
security with a public read policy, letting the static site query published data
without write access.

Supporting configuration is split by responsibility. `src/supabase.ts` creates
typed publishable and administrative clients from environment variables.
`scripts/apply-schema.ts` connects with `pg` to apply the SQL schema, and
`scripts/generate-db-types.ts` invokes the Supabase CLI to generate
`src/generated/db.types.ts`. `package.json` exposes them as `npm run db:apply`
and `npm run db:types`.

Schema application requires `SUPABASE_PROJECT_ID` and `SUPABASE_PASSWORD`.
Type generation needs `SUPABASE_PROJECT_ID`; administrative imports require
`SUPABASE_PROJECT_ID` and `SUPABASE_SECRET_KEY`. The regular Node.js client
uses `SUPABASE_PUBLISHABLE_KEY` for read-oriented access.

## 4. Populate and Analyse IBGE Data

`scripts/populate-ibge-data.ts` turns the API integration and schema into a
repeatable import process, run with `npm run db:populate`.

The script first fills `localidades` only when it is empty. It derives a Brazil
record with code `0` and a population equal to the sum of the state populations.
It then imports surnames from national and state rankings:

- The national import advances through pages until it reaches a surname with a
  frequency below `5,180`.
- The state import examines up to 30 pages for every federative unit and stops
  a state when a surname frequency falls below `1,000`.
- Existing surnames are detected before insertion, allowing later runs to
  continue without duplicating records.

For each new surname, the importer saves national and state frequencies, then
derives analysis records. The local share is the fraction of a surname's
national count found in a state; concentration is the fraction of the state
population that has the surname; and QL compares that concentration with the
national one. The script retries failed IBGE operations up to three times and
logs an individual surname or state failure without discarding unrelated
progress.

This phase turns the original research objective into queryable data. The
precomputed `quociente_locacional` supports fast state rankings without asking
the browser to perform population-based calculations for every row.

## 5. Build the Static Surname-Ranking Application

The final phase publishes the analysis through the static application in
`docs/`. This directory is both the GitHub Pages deployment output and the
local web root. `npm start` serves it at `http://localhost:8000` with no build
step.

`docs/index.html` is the browser entry point. It loads Babel Standalone to
transpile TypeScript/React in the browser, Tailwind CSS for styling, and the
Supabase browser library. The entry script uses module mode with the React and
TypeScript Babel presets. Browser-compatible dependency shims live in
`docs/assets/`, so application code imports local modules rather than npm
package names.

`docs/query.mjs` owns the browser-side Supabase client and four data queries:
list states and populations, retrieve a paginated state ranking ordered by QL,
retrieve a selected surname's countrywide distribution, and find a surname by
name.

`docs/index.tsx` implements the interactive experience. Users can filter state
choices by region, select a state, inspect the highest-QL surnames, paginate a
30-row ranking, and search for a surname. Expanding a row or completing a
search shows the surname's distribution across all 27 federative units, ordered
by QL, with local frequency and population percentage. The interface also
explains QL and handles loading, empty-data, and query-error states.

Together, these files make the prepared census data accessible as an explorable
state-by-state ranking while preserving the simple static deployment model.
