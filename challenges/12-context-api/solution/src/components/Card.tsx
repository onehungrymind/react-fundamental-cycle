interface CardProps {
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, footer, children, className }: CardProps) {
  const cardClass = className ? `card ${className}` : 'card';

  return (
    <div className={cardClass}>
      {title !== undefined && (
        <div className="card-header">
          <h3>{title}</h3>
        </div>
      )}

      <div className="card-body">
        {children}
      </div>

      {footer !== undefined && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
