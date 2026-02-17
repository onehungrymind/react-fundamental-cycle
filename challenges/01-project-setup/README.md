# Challenge 01 — Project Setup & Dev Tooling

## Concept

Every React project begins with tooling decisions. The ecosystem has evolved significantly: Create React App is deprecated, and **Vite** is the modern standard for fast, reliable React development. Getting the foundation right — TypeScript strictness, folder structure, and HMR — sets the tone for everything that follows.

## Learning Objectives

- Initialize a React + TypeScript project using Vite
- Configure `tsconfig.json` with `strict: true` and understand what that enables
- Establish a scalable folder structure for a real application
- Verify Hot Module Replacement (HMR) is working correctly
- Replace generated boilerplate with intentional, semantic markup

## Starting Snapshot

An empty directory. You will scaffold the project from scratch.

## The Challenge

### Step 1 — Scaffold the Project

Use Vite to create a new React + TypeScript project:

```bash
npm create vite@latest . -- --template react-ts
npm install
```

> When prompted, select the **React + TypeScript** variant. The `--template react-ts` flag does this automatically.

### Step 2 — Verify TypeScript Strict Mode

Open `tsconfig.json` (or `tsconfig.app.json`) and confirm `"strict": true` is set. If it is not, add it under `compilerOptions`. Strict mode enables:

- `strictNullChecks` — no implicit `null` or `undefined`
- `noImplicitAny` — all variables must have inferrable types
- `strictFunctionTypes` — stricter function type checking
- And several others that catch real bugs at compile time

### Step 3 — Establish Folder Structure

Create the following directories inside `src/`:

```
src/
  components/    # Reusable UI components
  hooks/         # Custom React hooks
  types/         # Shared TypeScript type definitions
  utils/         # Pure utility/helper functions
  assets/        # Static assets (images, fonts, icons)
```

Add a `.gitkeep` file to each empty directory so Git tracks them:

```bash
touch src/components/.gitkeep
touch src/hooks/.gitkeep
touch src/types/.gitkeep
touch src/utils/.gitkeep
touch src/assets/.gitkeep
```

### Step 4 — Replace the Boilerplate

Replace `src/App.tsx` with a clean TaskFlow layout. The rendered output must include:

- A heading: **TaskFlow**
- A subtitle: **Project Management, Simplified.**
- A footer: **Built with React + TypeScript**

Use semantic HTML elements (`<header>`, `<main>`, `<footer>`).

### Step 5 — Verify Everything Works

```bash
npm run dev     # Dev server starts, HMR active
npm run build   # Zero TypeScript errors, zero warnings
```

Make a small edit to `App.tsx` while `npm run dev` is running and confirm the browser updates without a full page reload — that is HMR working.

## Acceptance Criteria

- [ ] `npm run dev` starts successfully and the app renders in the browser
- [ ] `npm run build` completes with zero errors
- [ ] `tsconfig.json` or `tsconfig.app.json` has `"strict": true`
- [ ] The rendered page shows the heading "TaskFlow"
- [ ] The rendered page shows the subtitle "Project Management, Simplified."
- [ ] The rendered page shows the footer "Built with React + TypeScript"
- [ ] Semantic HTML is used (`<header>`, `<main>`, `<footer>`)
- [ ] Folder structure matches: `components/`, `hooks/`, `types/`, `utils/`, `assets/`
- [ ] No `any` types in any `.ts` or `.tsx` file

## Critical Gotchas

**Select the right variant.** When running `npm create vite@latest` interactively, you must choose "React" then "TypeScript" (not "TypeScript + SWC" if you want standard Babel). The `--template react-ts` flag bypasses this prompt.

**Keep `tsconfig.node.json`.** Vite generates two tsconfig files: `tsconfig.app.json` for your source code and `tsconfig.node.json` for the Vite config file itself. Do not delete `tsconfig.node.json` — it is required for `vite.config.ts` to type-check correctly.

**Keep `vite-env.d.ts`.** The file `src/vite-env.d.ts` contains `/// <reference types="vite/client" />`. This is what gives you type definitions for `import.meta.env` and other Vite-specific globals. Deleting it breaks those types.

**`tsconfig.json` is a composite root.** In Vite's template, the top-level `tsconfig.json` uses `"references"` to point at `tsconfig.app.json` and `tsconfig.node.json`. It does not have `compilerOptions` of its own. The strict settings live in `tsconfig.app.json`.

## Project Structure After Completion

```
01-project-setup/
  index.html
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  package.json
  src/
    main.tsx
    App.tsx
    App.css
    index.css
    vite-env.d.ts
    components/
    hooks/
    types/
    utils/
    assets/
  public/
```
