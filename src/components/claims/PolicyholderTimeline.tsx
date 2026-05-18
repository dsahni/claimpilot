'use client';

import { TimelineEntry, ClaimStatus } from '@/types';
import Card from '@/components/ui/Card';

interface PolicyholderTimelineProps {
  timeline: TimelineEntry[];
  status: ClaimStatus;
}

function toFriendlyEntry(entry: TimelineEntry): { label: string; timestamp: string } | null {
  const action = entry.action.toLowerCase();

  if (action.includes('submitted') || action.includes('created')) {
    return { label: 'Claim Submitted', timestamp: entry.timestamp };
  }
  if (action.includes('processing started') || action.includes('assessment complete')) {
    return null;
  }
  if (action.includes('awaiting information') || action.includes('awaiting info')) {
    return { label: 'Awaiting Information', timestamp: entry.timestamp };
  }
  if (action.includes('escalated') || action.includes('under review')) {
    return { label: 'Under Review', timestamp: entry.timestamp };
  }
  if (action.includes('auto-approved') || action.includes('auto_approved')) {
    return { label: 'Auto-Approved', timestamp: entry.timestamp };
  }
  if (action.includes('approved')) {
    return { label: 'Approved', timestamp: entry.timestamp };
  }
  if (action.includes('denied')) {
    return { label: 'Denied', timestamp: entry.timestamp };
  }
  if (action.includes('repair started') || action.includes('repair')) {
    return { label: 'In Repair', timestamp: entry.timestamp };
  }
  if (action.includes('final inspection')) {
    return { label: 'Final Inspection', timestamp: entry.timestamp };
  }
  if (action.includes('closed')) {
    return { label: 'Closed', timestamp: entry.timestamp };
  }
  if (action.includes('cancelled')) {
    return { label: 'Cancelled', timestamp: entry.timestamp };
  }
  if (action.includes('photo') || action.includes('document')) {
    return { label: 'Documentation Added', timestamp: entry.timestamp };
  }
  if (action.includes('adjuster') || action.includes('reviewed')) {
    return { label: 'Under Review', timestamp: entry.timestamp };
  }

  return null;
}

function dotColor(label: string, isPending?: boolean) {
  if (isPending) return 'bg-slate-200';
  switch (label) {
    case 'Auto-Approved':
    case 'Approved':           return 'bg-emerald-500';
    case 'Denied':
    case 'Cancelled':          return 'bg-rose-400';
    case 'Under Review':       return 'bg-amber-400';
    case 'Awaiting Information': return 'bg-orange-400';
    case 'In Repair':          return 'bg-indigo-500';
    case 'Final Inspection':   return 'bg-purple-500';
    case 'Closed':             return 'bg-slate-400';
    default:                   return 'bg-indigo-400';
  }
}

export default function PolicyholderTimeline({ timeline, status }: PolicyholderTimelineProps) {
  const entries = timeline
    .map(toFriendlyEntry)
    .filter((e): e is { label: string; timestamp: string } => e !== null)
    .filter((e, i, arr) => i === 0 || e.label !== arr[i - 1].label);

  const showRepairNext = (status === 'approved' || status === 'auto_approved') &&
    !entries.some(e => e.label === 'In Repair');

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
        Claim Timeline
      </h3>
      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />
        <div className="space-y-5">
          {entries.map((entry, i) => (
            <div key={i} className="relative pl-6">
              <div
                className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-white shadow-sm ${dotColor(entry.label)}`}
              />
              <p className="text-sm font-medium text-slate-800">{entry.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(entry.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
          {showRepairNext && (
            <div className="relative pl-6">
              <div
                className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-dashed border-slate-300 ${dotColor('In Repair', true)}`}
              />
              <p className="text-sm font-medium text-slate-400">Next: Repair</p>
              <p className="text-xs text-slate-300 mt-0.5">Pending</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
