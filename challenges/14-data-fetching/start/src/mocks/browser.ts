import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// The MSW service worker is configured here, but it is NOT started yet.
//
// TODO (Challenge 14 Step 1): Update src/main.tsx to call worker.start()
// before ReactDOM.createRoot so that the mock API intercepts all fetch calls.
//
// See the README for the exact code pattern to use.

export const worker = setupWorker(...handlers)
