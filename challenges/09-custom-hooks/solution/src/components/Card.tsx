// Card is a generic container component that provides consistent card styling.
// It accepts three content slots:
//   - title (string): rendered as an h3 in a .card-header
//   - children (React.ReactNode): rendered in the .card-body
//   - footer (React.ReactNode): rendered in a .card-footer
//
// Using children and named ReactNode props (footer) instead of data props
// lets the caller control the exact markup inside each section.

interface CardProps {
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, footer, children, className }: CardProps) {
  // Build the className string: always "card", plus any extra class the
  // caller wants to layer on top (e.g. "project-card").
  const cardClass = className ? `card ${className}` : 'card';

  return (
    <div className={cardClass}>
      {/* Only render the header section when a title was supplied.
          Conditional rendering avoids an empty .card-header in the DOM. */}
      {title !== undefined && (
        <div className="card-header">
          <h3>{title}</h3>
        </div>
      )}

      {/* The body always renders — children can be undefined (renders nothing). */}
      <div className="card-body">
        {children}
      </div>

      {/* footer is a ReactNode slot so callers can pass any JSX.
          Only render the footer section when something was passed. */}
      {footer !== undefined && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
