import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Challenge 14 — Data Fetching
//
// MSW is started asynchronously before React renders.
//
// Why async?
//   The MSW service worker registration is asynchronous.  If we called
//   createRoot() immediately, the first fetch() calls (triggered on mount)
//   would fire before the worker is ready to intercept them, resulting in
//   real 404 network errors.
//
// Why dynamic import?
//   `import('./mocks/browser')` is a dynamic (code-split) import.  It means
//   the MSW bundle is only loaded when this function runs.  In production you
//   would guard this behind `import.meta.env.DEV` to exclude MSW from the
//   production bundle entirely.
//
// Why { onUnhandledRequest: 'bypass' }?
//   Any request that doesn't match a handler (e.g. Vite HMR websocket,
//   browser extension requests) is passed through to the real network
//   instead of throwing a warning.

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
