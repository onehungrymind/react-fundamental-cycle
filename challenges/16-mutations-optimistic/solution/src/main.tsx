import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Challenge 16 — Mutations & Optimistic Updates
//
// MSW is started asynchronously before React renders.
// All reads: TanStack Query.
// All writes: TanStack Query mutations with optimistic updates.

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
