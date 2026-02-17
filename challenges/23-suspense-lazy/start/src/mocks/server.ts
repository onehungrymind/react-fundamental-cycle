import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// MSW Node server — used exclusively in Vitest tests.
//
// `setupServer` is the Node equivalent of `setupWorker`.  Instead of
// registering a Service Worker in the browser it uses @mswjs/interceptors
// to patch Node's fetch (and http/https) so that every `fetch()` call made
// inside jsdom is intercepted by the same handlers you ship to users.
//
// The server lifecycle is managed in src/test/setup.ts:
//
//   beforeAll  → server.listen({ onUnhandledRequest: 'error' })
//   afterEach  → server.resetHandlers()   // clears per-test overrides
//   afterAll   → server.close()

export const server = setupServer(...handlers)
