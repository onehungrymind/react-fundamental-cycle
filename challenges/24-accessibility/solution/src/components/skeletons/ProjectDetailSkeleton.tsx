export function ProjectDetailSkeleton() {
  return (
    <div className="skeleton-container" aria-hidden="true" aria-label="Loading project...">
      {/* Project title */}
      <div
        className="skeleton skeleton-title"
        style={{ width: '55%', height: '1.875rem' }}
      />

      {/* Description */}
      <div
        className="skeleton skeleton-text"
        style={{ width: '80%', height: '1rem', marginTop: '0.5rem' }}
      />
      <div
        className="skeleton skeleton-text"
        style={{ width: '60%', height: '1rem', marginTop: '0.375rem' }}
      />

      {/* Divider + meta row */}
      <div className="skeleton-divider" style={{ marginTop: '1rem' }} />

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          paddingTop: '0.875rem',
          paddingBottom: '0.875rem',
        }}
      >
        {/* Status meta item */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div
            className="skeleton"
            style={{ width: '40px', height: '0.625rem' }}
          />
          <div
            className="skeleton"
            style={{ width: '64px', height: '1.25rem', borderRadius: '999px' }}
          />
        </div>

        {/* Task count meta item */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div
            className="skeleton"
            style={{ width: '40px', height: '0.625rem' }}
          />
          <div
            className="skeleton"
            style={{ width: '28px', height: '0.875rem' }}
          />
        </div>

        {/* Due date meta item */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div
            className="skeleton"
            style={{ width: '52px', height: '0.625rem' }}
          />
          <div
            className="skeleton"
            style={{ width: '80px', height: '0.875rem' }}
          />
        </div>
      </div>

      <div className="skeleton-divider" />

      {/* Task list skeleton — 4 task card shapes */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-card"
          style={{ height: '4rem', marginTop: '0.5rem' }}
        />
      ))}

      {/* "Add task" button shape */}
      <div
        className="skeleton"
        style={{ width: '80px', height: '1rem', marginTop: '1.5rem' }}
      />
    </div>
  )
}

export default ProjectDetailSkeleton
