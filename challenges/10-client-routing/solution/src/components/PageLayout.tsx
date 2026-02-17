// PageLayout provides a consistent page structure with a title area,
// an optional actions area (e.g. buttons), and a content area.

interface PageLayoutProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ title, actions, children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <div className="page-header">
        <h2 className="page-title">{title}</h2>
        {actions !== undefined && (
          <div className="page-actions">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

export default PageLayout
