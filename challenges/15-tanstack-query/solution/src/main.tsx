import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Challenge 15 — TanStack Query
//
// MSW is started asynchronously before React renders, exactly as in
// Challenge 14.  The QueryClientProvider is added inside App.tsx.
//
// Why async?
//   The MSW service worker registration is asynchronous.  If we called
//   createRoot() immediately, the first fetch() calls (triggered on mount)
//   would fire before the worker is ready to intercept them, resulting in
//   real 404 network errors.

async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
