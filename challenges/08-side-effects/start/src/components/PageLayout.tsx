// PageLayout provides a consistent page structure with a title area,
// an optional actions area (e.g. buttons), and a content area.
//
// Using composition here means:
//   - The caller controls which buttons appear in the actions slot.
//   - The caller controls the content below the header.
//   - PageLayout itself only manages layout/spacing — no business logic.

interface PageLayoutProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ title, actions, children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      {/* Header bar: title on the left, optional action buttons on the right. */}
      <div className="page-header">
        <h2 className="page-title">{title}</h2>
        {/* Only render the actions wrapper when something was passed.
            This avoids an empty .page-actions div cluttering the DOM. */}
        {actions !== undefined && (
          <div className="page-actions">
            {actions}
          </div>
        )}
      </div>

      {/* Content: whatever the caller places between the tags. */}
      {children}
    </div>
  )
}

export default PageLayout
