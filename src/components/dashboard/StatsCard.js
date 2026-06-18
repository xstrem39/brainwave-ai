import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function StatsCard({ title, value, icon: Icon, iconBg, change, description, loading }) {
  if (loading) {
    return (
      <div className="stat-card">
        <div className="stat-icon skeleton" style={{ minWidth: 48, minHeight: 48 }} />
        <div className="flex-1">
          <div className="h-4 w-24 skeleton rounded mb-2" />
          <div className="h-7 w-16 skeleton rounded" />
        </div>
      </div>
    );
  }

  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconBg || 'bg-primary-500/20'}`}>
        <Icon className={`text-xl ${iconBg ? '' : 'text-primary-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        {(change !== undefined || description) && (
          <div className="flex items-center gap-1 mt-1">
            {change !== undefined && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-slate-400'}`}>
                {isPositive ? <FaArrowUp size={10} /> : isNegative ? <FaArrowDown size={10} /> : null}
                {Math.abs(change)}%
              </span>
            )}
            {description && <span className="text-xs text-slate-500">{description}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
