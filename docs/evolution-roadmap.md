# Project Evolution Roadmap

## Purpose

This project collects Brazilian surname frequency data from the IBGE Names API
and stores it in Supabase. The current database model supports national and
state-level surname frequencies, plus the localities used to identify each
state.

## Current State

The initial data pipeline is complete.

### 1. Supabase Foundation

- A Supabase project has been created.
- `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are configured locally in
  `.env`.
- `scripts/supabase.ts` creates the shared Supabase client and fails early when
  either environment variable is missing.

### 2. Database Schema

- `scripts/schema.sql` defines the `sobrenomes` table for surname frequencies.
- The table stores the national frequency in `freq_br` and optional frequencies
  for each Brazilian state in `freq_<uf>` columns.
- Indexes support ranking lookups by national and state frequency.
- The `localidades` table stores IBGE locality codes, names, state abbreviations,
  and local population data.
- The schema has been applied to the Supabase database.

### 3. IBGE API Client

- `scripts/ibge.ts` fetches paginated surname rankings, individual surname
  frequency details, and the state locality list.
- Zod validates the API responses before they are used by the importer.
- A request delay is included to avoid making rapid consecutive requests to the
  IBGE API.

### 4. Data Import

- `scripts/fetch-ibge-data.ts` populates `localidades` and `sobrenomes` from
  IBGE data.
- The import retries failed API calls up to three times.
- Existing surnames are checked before insertion, allowing interrupted imports
  to be resumed.
- The national import stops below the current frequency threshold of 5,180.
- State-level imports stop below the current threshold of 1,000 and process up
  to 30 ranking pages per state.

## Working Agreement

- Keep `.env` out of version control; publish an `.env.example` containing only
  variable names and non-sensitive setup guidance.
- Treat `scripts/schema.sql` as the current schema reference until versioned
  migrations replace it.
- Run `node scripts/fetch-ibge-data.ts` to populate or resume the current data
  import.
- Run `npm test` to execute the existing IBGE integration checks. These tests
  require network access to the IBGE API.