# Challenge 25 — Deployment & Production Build

## Overview

TaskFlow is feature-complete. In this challenge you will prepare it for
production deployment. You will configure environment variables, tune the
Vite build pipeline, and add hosting provider configuration files so the
SPA works correctly on Vercel and Netlify.

## Learning Objectives

1. Expose environment-specific values through Vite's `VITE_` env var convention
2. Use `import.meta.env` to read those values at build time
3. Add type-safety for custom env vars via `ImportMetaEnv` augmentation
4. Configure Rollup manual chunks for predictable vendor splitting
5. Enable production source maps for debuggability
6. Write SPA fallback rules for Vercel (`vercel.json`) and Netlify (`netlify.toml` / `public/_redirects`)
7. Understand the difference between dev server and production static hosting

## Tasks

### 1. Create environment variable files

Create `.env.development` and `.env.production` in the project root.
Both files must define:

```
VITE_API_URL=/api
```

> All variables exposed to the browser **must** start with `VITE_`.
> The dev server and the production build each load the appropriate file
> automatically.

### 2. Update API modules to use the env var

In `src/api/projects.ts` and `src/api/tasks.ts`, replace every hardcoded
`'/api'` base path with:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

### 3. Add env var type declarations

Open `src/vite-env.d.ts` and augment the `ImportMetaEnv` interface so
TypeScript knows about `VITE_API_URL`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 4. Configure the Vite build

Update `vite.config.ts` to add a `build` section:

- Enable `sourcemap: true` so production errors can be traced to source
- Add `rollupOptions.output.manualChunks` to split vendor code:
  - `vendor`: `react`, `react-dom`
  - `router`: `react-router`, `react-router-dom`
  - `query`: `@tanstack/react-query`
  - `redux`: `@reduxjs/toolkit`, `react-redux`

### 5. Add SPA fallback for Vercel

Create `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 6. Add SPA fallback for Netlify

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Create `public/_redirects` as an alternative for Netlify:

```
/*    /index.html   200
```

## Verification

```bash
# Development (uses .env.development)
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview

# Tests must still pass
npm test
```

After `npm run build`, inspect the `dist/assets/` directory.  You should
see separate chunk files for `vendor`, `router`, `query`, and `redux`.

## Why This Matters

| Problem | Solution |
|---------|----------|
| Hardcoded URLs break staging/prod | Env vars swapped at build time |
| All code in one bundle → slow load | Manual chunks → parallel fetching |
| 404s on page refresh for SPA routes | Fallback rewrite to `index.html` |
| Unreadable prod stack traces | Source maps in `dist/` |
