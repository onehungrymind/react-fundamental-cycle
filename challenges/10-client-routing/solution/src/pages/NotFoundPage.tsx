import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

// NotFoundPage is rendered by the catch-all route: <Route path="*" element={<NotFoundPage />} />
//
// It is placed OUTSIDE the layout route so it renders without the sidebar and
// header.  This is a deliberate design choice — the 404 page gets a clean,
// full-screen treatment.
//
// If you want the 404 page to render inside the shell instead, move the
// catch-all route inside the layout route:
//
//   <Route element={<Layout />}>
//     ...other routes...
//     <Route path="*" element={<NotFoundPage />} />
//   </Route>

export function NotFoundPage() {
  useDocumentTitle('Page Not Found | TaskFlow');

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for does not exist.
        </p>
        {/* Link (not <a>) so clicking it is a client-side navigation. */}
        <Link to="/projects" className="btn-primary">
          Go to Projects
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
