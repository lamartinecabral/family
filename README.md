# Family

Family analyzes the predominance of surnames in each Brazilian state.

It collects surname data from the IBGE API, stores it in Supabase, and presents
the results in a static web application. The goal is to make it easy to explore
which surnames are most common across Brazil and compare their distribution by
state.

## Development

The project requires Node.js 24 or later.

```sh
npm start
```

Serves the web application from `docs/` at `http://localhost:8000`.

## Data commands

```sh
npm run db:apply
npm run db:types
npm run db:populate
```

These commands apply the Supabase schema, generate database TypeScript types, and
populate the dataset from IBGE.
