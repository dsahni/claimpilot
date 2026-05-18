'use client';

import Tooltip from '@/components/ui/Tooltip';

export default function ThresholdInfo() {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">
        Current AI Auto-Approve Threshold:
      </span>
      <span className="text-sm font-bold text-indigo-600">85%</span>
      <Tooltip content="Claims with AI confidence scores at or above this threshold are automatically approved and sent to the policyholder. Claims below this threshold are escalated to a human adjuster for review. This threshold balances processing speed with assessment accuracy.">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs cursor-help">
          i
        </span>
      </Tooltip>
    </div>
  );
}
