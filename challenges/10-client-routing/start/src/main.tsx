import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// TODO (Challenge 10): If you choose to wrap BrowserRouter here instead of
// inside App.tsx, this is the place to do it.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
