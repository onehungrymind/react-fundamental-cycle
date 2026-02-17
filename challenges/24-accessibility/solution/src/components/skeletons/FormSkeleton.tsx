export function FormSkeleton() {
  return (
    <div className="skeleton-page" aria-hidden="true" aria-label="Loading form...">
      {/* Page header */}
      <div className="skeleton-page-header">
        <div
          className="skeleton skeleton-title"
          style={{ width: '160px', height: '1.75rem' }}
        />
        <div
          className="skeleton"
          style={{ width: '120px', height: '2rem', borderRadius: '6px' }}
        />
      </div>

      {/* Description line */}
      <div
        className="skeleton skeleton-text"
        style={{ width: '60%', height: '0.875rem', marginBottom: '1.5rem' }}
      />

      {/* Form fields */}
      <div style={{ maxWidth: '560px' }}>
        {/* Field 1 — Project Name */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            className="skeleton skeleton-label"
            style={{ width: '100px', height: '0.8125rem', marginBottom: '0.375rem' }}
          />
          <div
            className="skeleton skeleton-input"
            style={{ width: '100%', height: '2.375rem' }}
          />
        </div>

        {/* Field 2 — Description */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            className="skeleton skeleton-label"
            style={{ width: '80px', height: '0.8125rem', marginBottom: '0.375rem' }}
          />
          <div
            className="skeleton skeleton-input"
            style={{ width: '100%', height: '5rem', borderRadius: '6px' }}
          />
        </div>

        {/* Field 3 — Status */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            className="skeleton skeleton-label"
            style={{ width: '48px', height: '0.8125rem', marginBottom: '0.375rem' }}
          />
          <div
            className="skeleton skeleton-input"
            style={{ width: '100%', height: '2.375rem' }}
          />
        </div>

        {/* Field 4 — Due Date */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            className="skeleton skeleton-label"
            style={{ width: '72px', height: '0.8125rem', marginBottom: '0.375rem' }}
          />
          <div
            className="skeleton skeleton-input"
            style={{ width: '100%', height: '2.375rem' }}
          />
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
            marginTop: '1.25rem',
          }}
        >
          <div
            className="skeleton"
            style={{ width: '72px', height: '2.125rem', borderRadius: '6px' }}
          />
          <div
            className="skeleton"
            style={{ width: '96px', height: '2.125rem', borderRadius: '6px' }}
          />
        </div>
      </div>
    </div>
  )
}

export default FormSkeleton
