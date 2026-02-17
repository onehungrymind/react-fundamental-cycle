import '@testing-library/jest-dom/vitest'

// TODO: Import `server` from '../mocks/server' and add MSW lifecycle hooks.
//
// The three hooks you need:
//
//   beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
//   afterEach(() => server.resetHandlers())
//   afterAll(() => server.close())
//
// Why each one:
//   beforeAll  — start the server once before any test in the suite runs
//   afterEach  — remove per-test overrides (server.use() calls) so they
//                don't leak into the next test
//   afterAll   — shut down the server cleanly after all tests finish
//
// onUnhandledRequest: 'error' makes any fetch that does not match a handler
// throw immediately, catching URL typos early rather than silently hanging.
