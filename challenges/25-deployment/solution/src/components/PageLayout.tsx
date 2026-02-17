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
