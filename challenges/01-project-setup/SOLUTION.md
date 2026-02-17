# Solution — Challenge 01: Project Setup & Dev Tooling

## Solution Approach

This challenge is about making deliberate decisions at the very start of a project rather than accepting defaults without understanding them. The solution involves three distinct concerns: tooling configuration, TypeScript discipline, and code organization.

### Tooling Configuration

Vite is configured through `vite.config.ts`. For a basic React project, the only plugin needed is `@vitejs/plugin-react`, which handles JSX transformation and React Refresh (the mechanism behind HMR). No additional configuration is required for this challenge.

The key insight is understanding the two-tsconfig pattern Vite uses:

- `tsconfig.app.json` — governs `src/` files, compiled by the browser build pipeline
- `tsconfig.node.json` — governs `vite.config.ts`, runs in Node.js context

This split exists because browser code and build-tool code have different environments (DOM vs Node), different module systems, and different available globals.

### TypeScript Strictness

`strict: true` is a single flag that enables a bundle of checks. The most impactful ones for React development are:

```json
{
  "strict": true
  // Equivalent to enabling all of these:
  // "strictNullChecks": true,
  // "noImplicitAny": true,
  // "strictFunctionTypes": true,
  // "strictBindCallApply": true,
  // "strictPropertyInitialization": true,
  // "noImplicitThis": true,
  // "alwaysStrict": true,
  // "useUnknownInCatchVariables": true
}
```

In practice, `strictNullChecks` is what you will encounter most — it forces you to handle the possibility that values could be `null` or `undefined` before using them.

### Folder Structure

The five-folder structure (`components/`, `hooks/`, `types/`, `utils/`, `assets/`) is intentionally generic enough to scale. The convention:

- **components/** — React components only. Each component gets its own file, named with PascalCase.
- **hooks/** — Functions that start with `use`. Separating hooks from components prevents the temptation to co-locate complex logic in component files.
- **types/** — TypeScript interfaces, types, and enums shared across multiple files. Anything used in only one file can stay in that file.
- **utils/** — Pure functions with no React dependency. If a utility needs `useState`, it belongs in `hooks/`.
- **assets/** — Imported static files. Vite handles asset imports natively, so `import logo from './assets/logo.svg'` gives you a URL string.

### The App Component

```tsx
// src/App.tsx
import './App.css';

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>TaskFlow</h1>
        <p className="app-subtitle">Project Management, Simplified.</p>
      </header>
      <main className="app-main">
        <p>Your workspace is ready.</p>
      </main>
      <footer className="app-footer">
        <p>Built with React + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
```

Note the use of `export function App()` (named export) alongside `export default App`. This pattern gives consumers flexibility: they can import as `import App from './App'` or `import { App } from './App'`. Named exports also play better with Fast Refresh — HMR works more reliably when components are named exports.

## What Was Learned

1. **Vite's two-tsconfig pattern** is a deliberate design, not an oversight. The split between app and node configs reflects real environment differences.

2. **`strict: true` is the minimum bar** for professional TypeScript. Projects without it accumulate implicit `any` types that undermine the entire point of TypeScript.

3. **Folder structure is a communication tool.** A developer who has never seen your codebase should be able to guess where to find a component within 10 seconds. The five-folder structure achieves this.

4. **HMR is not the same as live reload.** HMR (Hot Module Replacement) updates only the changed module in the running app, preserving React state. Live reload refreshes the entire page. Vite uses React Refresh to enable HMR that preserves component state.

5. **`vite-env.d.ts` is load-bearing.** It is a tiny file but removing it breaks `import.meta.env` type inference, which matters the moment you add environment variables.

## Gotchas Encountered

**The `tsconfig.json` root file has no `compilerOptions`.** This confuses developers who expect a single config file. The root `tsconfig.json` only has `references` — actual compiler options live in `tsconfig.app.json`. If you add `strict: true` to the root file, it has no effect on your source files.

**`React` does not need to be imported in React 17+.** The new JSX transform (`"jsx": "react-jsx"` in tsconfig) handles JSX compilation without a React import. You only need to import React when using hooks or other React APIs directly (`import { useState } from 'react'`).

**`index.html` is in the project root, not `public/`.** In Vite projects, `index.html` is the entry point and lives at root level. The `public/` folder is for static assets that should be copied verbatim to the build output without processing.

## Alternative Approaches

### Next.js

For applications that need server-side rendering, static site generation, or a file-based router, Next.js is the right choice instead of Vite. The tradeoff: Next.js has more opinions and a steeper learning curve, but the structure it provides prevents a class of architectural mistakes.

```bash
npx create-next-app@latest --typescript
```

### Create React App (Deprecated)

CRA was the standard from 2016–2022 but is no longer maintained. Do not use it for new projects. Vite is 10–20x faster for dev server startup and HMR updates.

### Bun + Vite

`bun create vite` works identically but uses Bun as the package manager and runtime. Build times are faster; ecosystem compatibility is excellent as of 2024.

## Stretch Challenges

### 1. Configure Path Aliases

Add path aliases so you can write `import { Button } from '@/components/Button'` instead of relative paths:

In `vite.config.ts`:
```typescript
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

In `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 2. Add React StrictMode Verification

Wrap your app in `<React.StrictMode>` in `main.tsx` (it is there by default in Vite's template). Open the browser console and verify that your component renders twice in development — this is StrictMode intentionally double-invoking effects to catch side effects. Understand why this is helpful.

### 3. Add ESLint + Prettier

```bash
npm install --save-dev eslint @eslint/js eslint-plugin-react-hooks typescript-eslint prettier
```

Configure `eslint.config.js` and `prettier.config.js`. Add a `"lint"` script to `package.json`. This is the tooling setup used on real teams.

### 4. Explore `import.meta.env`

Create a `.env` file with `VITE_APP_NAME=TaskFlow`. Access it in `App.tsx` as `import.meta.env.VITE_APP_NAME`. Notice that only variables prefixed with `VITE_` are exposed to the client bundle — this is a security feature.

## Resources

- [Vite Documentation — Getting Started](https://vitejs.dev/guide/)
- [TypeScript Handbook — tsconfig reference](https://www.typescriptlang.org/tsconfig)
- [Vite — TypeScript](https://vitejs.dev/guide/features#typescript)
- [React — Installation](https://react.dev/learn/installation)
- [Why Vite — Vite's own explanation](https://vitejs.dev/guide/why)
