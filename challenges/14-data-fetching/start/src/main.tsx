import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Challenge 14 — Data Fetching
//
// TODO: Start the MSW service worker before rendering.
//
// Replace this direct createRoot call with an async enableMocking() function
// that dynamically imports './mocks/browser', calls worker.start(), and only
// then renders the app.
//
// Pattern:
//
//   async function enableMocking() {
//     const { worker } = await import('./mocks/browser');
//     return worker.start({ onUnhandledRequest: 'bypass' });
//   }
//
//   enableMocking().then(() => {
//     ReactDOM.createRoot(document.getElementById('root')!).render(
//       <React.StrictMode><App /></React.StrictMode>
//     );
//   });
//
// Until you complete this step, the mock API routes won't be intercepted and
// fetch calls will hit the real network (and fail with 404s).

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
