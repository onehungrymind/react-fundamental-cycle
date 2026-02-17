# Challenge 25 — Solution Debrief

## What Was Changed

### Environment Variables

| File | Purpose |
|------|---------|
| `.env.development` | Loaded by `vite dev`. Sets `VITE_API_URL=/api` (MSW intercepts). |
| `.env.production` | Loaded by `vite build`. Sets `VITE_API_URL=/api` for this workshop; in a real project this would point to a real API host. |

`VITE_` is the required prefix. Any variable without it is stripped from
the client bundle at build time — Vite replaces `import.meta.env.VITE_*`
string literals during the ESBuild transform step, so **no env vars are
evaluated at runtime**; they are baked in.

### API Modules

`src/api/projects.ts` and `src/api/tasks.ts` now derive the base URL from
the env var:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

The fallback (`|| '/api'`) is a safety net; in practice the env file
always provides the value.

### Type Declarations (`src/vite-env.d.ts`)

Augmenting `ImportMetaEnv` gives TypeScript knowledge of custom vars:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
```

Without this, `import.meta.env.VITE_API_URL` is typed as `string |
undefined` (or `any` depending on TS config). The augmentation makes it
`string`, eliminates the need for a non-null assertion, and catches typos
at compile time.

### Vite Build Configuration

```typescript
build: {
  sourcemap: true,
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        router: ['react-router', 'react-router-dom'],
        query: ['@tanstack/react-query'],
        redux: ['@reduxjs/toolkit', 'react-redux'],
      },
    },
  },
},
```

**Vite's build pipeline:**

1. **ESBuild** transpiles TypeScript/JSX and performs dead-code elimination
   within each module (tree shaking within files).
2. **Rollup** bundles the module graph, applies further tree shaking across
   the whole dependency graph, and splits output into chunks.
3. Each output chunk gets a **content hash** in its filename
   (`vendor-abc123.js`), enabling long-lived CDN caching. When only app
   code changes, browsers re-use the cached vendor chunk.

**Manual chunks vs automatic splitting:**
Vite's default is to split on dynamic `import()` boundaries (lazy routes).
`manualChunks` additionally groups specific npm packages together,
preventing them from being inlined into the app chunk.

### SPA Fallback Configuration

A single-page application uses the History API to change the URL without
full page loads. When a user navigates directly to `/projects/proj-1` or
refreshes the page, the hosting server sees a request for a path that has
no physical file. Without a fallback rule the server returns 404.

The fix is a rewrite/redirect rule: serve `index.html` for every path,
then React Router takes over and renders the correct component.

**Vercel** (`vercel.json`):
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
`rewrites` keeps the URL in the browser address bar unchanged (transparent
proxy), which is what you want for an SPA.

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
Status `200` means "serve this content but keep the original URL" — a
rewrite, not a redirect. A `301`/`302` would cause a redirect loop.

**Netlify `_redirects`** is a simpler alternative to `netlify.toml` for
projects that do not need the build configuration block.

### Alternative: Docker + Nginx

For containerised deployments the same pattern applies in `nginx.conf`:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

`try_files` attempts to serve the requested file, then the directory, and
falls back to `index.html`.

## Key Concepts

| Concept | Detail |
|---------|--------|
| Build-time env replacement | `import.meta.env.VITE_*` → string literal in bundle |
| Tree shaking | Dead code removed by Rollup across the whole module graph |
| Content hashing | Filenames include a hash of file content for cache busting |
| Code splitting | Parallel chunk downloads; unchanged chunks stay cached |
| SPA fallback | All server paths rewrite to `index.html`; client router handles the URL |
| Source maps | `dist/*.map` files map minified code back to TypeScript source |
