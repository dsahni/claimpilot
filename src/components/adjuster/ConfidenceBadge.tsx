'use client';

interface ConfidenceBadgeProps {
  score: number | null;
  size?: 'sm' | 'lg';
}

export default function ConfidenceBadge({ score, size = 'sm' }: ConfidenceBadgeProps) {
  if (score === null) {
    return (
      <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-500 font-medium ${size === 'lg' ? 'px-4 py-2 text-2xl' : 'px-2.5 py-0.5 text-xs'}`}>
        N/A
      </span>
    );
  }

  const colorClasses =
    score >= 85
      ? 'bg-emerald-100 text-emerald-700'
      : score >= 60
      ? 'bg-amber-100 text-amber-700'
      : 'bg-rose-100 text-rose-700';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClasses} ${size === 'lg' ? 'px-4 py-2 text-2xl' : 'px-2.5 py-0.5 text-xs'}`}>
      {score}%
    </span>
  );
}
