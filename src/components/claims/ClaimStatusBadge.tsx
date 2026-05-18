import { ClaimStatus, getDisplayStatus } from '@/types';

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
  showInternal?: boolean;
  showEscalationIcon?: boolean;
}

const colorMap: Record<string, string> = {
  'Under Review':        'bg-amber-50 text-amber-700 border-amber-200',
  'Awaiting Info':       'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Awaiting Information':'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Auto-Approved':       'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Approved':            'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Denied':              'bg-rose-50 text-rose-700 border-rose-200',
  'In Repair':           'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Final Inspection':    'bg-purple-50 text-purple-700 border-purple-200',
  'Closed':              'bg-slate-100 text-slate-500 border-slate-200',
  'Cancelled':           'bg-slate-50 text-slate-500 border-slate-200',
  'Escalated':           'bg-orange-100 text-orange-600 border-orange-300',
  'Open':                'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export default function ClaimStatusBadge({ status, showInternal, showEscalationIcon }: ClaimStatusBadgeProps) {
  let label: string;
  if (showInternal) {
    const internalMap: Record<ClaimStatus, string> = {
      submitted:            'Open',
      ai_processing:        'Open',
      ai_assessed:          'Open',
      escalated:            'Escalated',
      awaiting_information: 'Awaiting Info',
      auto_approved:        'Auto-Approved',
      approved:             'Approved',
      denied:               'Denied',
      repair:               'In Repair',
      final_inspection:     'Final Inspection',
      closed:               'Closed',
      cancelled:            'Cancelled',
    };
    label = internalMap[status];
  } else {
    label = getDisplayStatus(status);
  }

  const colors = colorMap[label] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}>
      {showEscalationIcon && (
        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )}
      {label}
    </span>
  );
}
