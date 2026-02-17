// Challenge 26 — Capstone: Feature 2 — Project Dashboard
//
// A simple stat display card used by DashboardPage.

interface StatCardProps {
  label: string;
  value: number;
  accent?: boolean;
}

export function StatCard({ label, value, accent = false }: StatCardProps) {
  return (
    <div className={`stat-card${accent ? ' stat-card--accent' : ''}`}>
      <span className="stat-card__value" aria-label={`${label}: ${value}`}>
        {value}
      </span>
      <span className="stat-card__label">{label}</span>
    </div>
  )
}

export default StatCard
