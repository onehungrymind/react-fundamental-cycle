export function PageSkeleton() {
  return (
    <div className="skeleton-page" aria-hidden="true" aria-label="Loading page...">
      {/* Page header */}
      <div className="skeleton-page-header">
        <div
          className="skeleton skeleton-title"
          style={{ width: '200px', height: '1.75rem' }}
        />
        <div
          className="skeleton"
          style={{ width: '100px', height: '2rem', borderRadius: '6px' }}
        />
      </div>

      {/* Description / subheading */}
      <div
        className="skeleton skeleton-text"
        style={{ width: '50%', height: '0.875rem', marginBottom: '2rem' }}
      />

      {/* Content blocks */}
      <div className="skeleton-section">
        <div
          className="skeleton skeleton-text"
          style={{ width: '100%', height: '1rem', marginBottom: '0.5rem' }}
        />
        <div
          className="skeleton skeleton-text"
          style={{ width: '90%', height: '1rem', marginBottom: '0.5rem' }}
        />
        <div
          className="skeleton skeleton-text"
          style={{ width: '75%', height: '1rem', marginBottom: '0.5rem' }}
        />
      </div>

      {/* Card grid */}
      <div
        className="skeleton-section"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="skeleton skeleton-card"
            style={{ height: '6rem' }}
          />
        ))}
      </div>
    </div>
  )
}

export default PageSkeleton
