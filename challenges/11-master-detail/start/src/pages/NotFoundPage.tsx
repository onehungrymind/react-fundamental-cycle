import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

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
        <Link to="/projects" className="btn-primary">
          Go to Projects
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
