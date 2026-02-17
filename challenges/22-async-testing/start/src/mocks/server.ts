// TODO: Understand how this file differs from src/mocks/browser.ts.
//
// browser.ts uses:  setupWorker  from 'msw/browser'  (Service Worker)
// server.ts uses:   setupServer  from 'msw/node'     (Node http-interceptor)
//
// Both share the same `handlers` array — that is the key design: you write
// the handlers once and they work in both the browser (dev mode) and in
// Node.js (Vitest tests).
//
// This file is complete — you do NOT need to change it.
// Your tasks are in:
//   src/test/setup.ts   → add lifecycle hooks (beforeAll / afterEach / afterAll)
//   src/test/utils.tsx  → return queryClient, support `path` option
//   src/pages/__tests__/  → write the async tests
//   src/components/__tests__/TaskMutations.test.tsx → write the mutation tests

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
