import '@testing-library/jest-dom/vitest'
import { server } from '../mocks/server'

// MSW server lifecycle — runs once per Vitest worker process.
//
// beforeAll  — start the server before any tests run.
//   onUnhandledRequest: 'error' means any fetch that doesn't match a handler
//   throws immediately, catching URL typos and missing handlers early.
//
// afterEach  — reset per-test handler overrides added with server.use().
//   Without this, a server.use() call in one test would bleed into the next.
//
// afterAll   — shut down the server cleanly after all tests finish.

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
