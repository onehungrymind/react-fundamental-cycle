import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Challenge 19 — Performance: React.memo, useMemo, useCallback
//
// SOLUTION version.
//
// MSW is started asynchronously before React renders.
// This ensures all API calls are intercepted by the mock service worker.

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
