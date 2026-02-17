import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Challenge 18 — State Management: Redux Toolkit (Alternate)
//
// MSW is started asynchronously before React renders.
// All server state: TanStack Query.
// Global UI state: Redux Toolkit (src/store/redux/).

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
