import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// The service worker is created here and exported.
// It is started in main.tsx via the async enableMocking() function,
// which ensures the worker is registered before React renders.
//
// Run `npx msw init public/` once after npm install to generate the
// mockServiceWorker.js file that MSW needs in the public/ directory.

export const worker = setupWorker(...handlers)
