'use client';

import { TimelineEntry } from '@/types';
import Card from '@/components/ui/Card';

interface ClaimTimelineProps {
  timeline: TimelineEntry[];
}

function getActorStyle(actor: string) {
  if (actor === 'System') return 'bg-slate-100 text-slate-600';
  if (actor === 'AI') return 'bg-indigo-100 text-indigo-600';
  return 'bg-emerald-100 text-emerald-700';
}

export default function ClaimTimeline({ timeline }: ClaimTimelineProps) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Timeline</h3>
      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />
        <div className="space-y-4">
          {timeline.map((entry, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-white bg-slate-300 shadow-sm" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${getActorStyle(entry.actor)}`}>
                    {entry.actor}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(entry.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{entry.action}</p>
                {entry.details && (
                  <p className="text-xs text-slate-500 mt-0.5">{entry.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
