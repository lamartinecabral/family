# Repository Guidance

## Project Layout

- `docs/` contains the complete static web application published through GitHub Pages. Treat this directory as both the source and deployable output for the web app.
- `docs/index.html` is the browser entry point, `docs/index.tsx` contains the React application, and `docs/query.mjs` contains browser-side Supabase queries.
- The Node.js scripts in `scripts/` and the database definitions in `src/` and `supabase/` support the dataset and database. They are separate from the static GitHub Pages deployment.

## Web App Development

- Keep the web app simple to deploy: do not introduce a bundler, build output, or a required npm build step for changes under `docs/`.
- `docs/index.html` loads Babel Standalone, which transpiles `docs/index.tsx` in the browser with the React and TypeScript presets. Write the application as directly copy-pasteable TSX so AI-generated code can be used with minimal adaptation.
- Browser-compatible dependency shims live in `docs/assets/` and are registered by the import map in `docs/index.html`. Use the mapped package names for React, React DOM, Lucide, and Supabase, and use explicit relative `.mjs` paths for local modules such as `./query.mjs`.
- Preserve the import map and the `type="text/babel"`, `data-type="module"`, and `data-presets="react,typescript"` configuration in `docs/index.html` unless the runtime loading approach is intentionally changed.
- Keep browser code compatible with direct Babel Standalone execution: do not add npm-only imports, bundler syntax, or a required build step for the `docs/` app.

## Local Verification

- Run `npm start` to serve the GitHub Pages app locally from `docs/` on port 8000.
- Run `npm test` for the Node.js test suite and `npm run typecheck` for the project type check when changes affect the data or database code.