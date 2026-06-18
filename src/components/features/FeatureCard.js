import Link from 'next/link';

export default function FeatureCard({ title, description, icon: Icon, href, color = 'primary', badge, credits }) {
  const colorMap = {
    primary: { bg: 'bg-primary-500/10', border: 'border-primary-500/20', icon: 'text-primary-400', hover: 'hover:border-primary-500/40' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: 'text-cyan-400', hover: 'hover:border-cyan-500/40' },
    green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', hover: 'hover:border-emerald-500/40' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'text-purple-400', hover: 'hover:border-purple-500/40' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: 'text-orange-400', hover: 'hover:border-orange-500/40' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: 'text-pink-400', hover: 'hover:border-pink-500/40' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-400', hover: 'hover:border-amber-500/40' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <Link href={href || '#'}
      className={`feature-card border ${c.border} ${c.hover} group block`}>
      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`${c.icon} text-xl`} />
      </div>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        {badge && <span className={`badge-primary text-xs`}>{badge}</span>}
      </div>
      <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
      {credits !== undefined && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <span className="text-xs text-amber-400">{credits === 0 ? 'Free' : `${credits} credits`}</span>
        </div>
      )}
    </Link>
  );
}
