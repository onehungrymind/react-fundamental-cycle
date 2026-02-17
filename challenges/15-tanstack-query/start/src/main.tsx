import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Challenge 15 — TanStack Query
//
// MSW is started asynchronously before React renders, exactly as in
// Challenge 14.  The QueryClientProvider is added inside App.tsx.

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
