import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Challenge 17 — Global Client State with Zustand
//
// MSW is started asynchronously before React renders.
// All reads: TanStack Query.
// All writes: TanStack Query mutations with optimistic updates.
// Global UI state: Zustand (to be added).

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
