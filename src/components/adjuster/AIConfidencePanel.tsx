'use client';

import { Claim } from '@/types';
import Card from '@/components/ui/Card';
import ConfidenceBadge from './ConfidenceBadge';

interface AIConfidencePanelProps {
  claim: Claim;
}

export default function AIConfidencePanel({ claim }: AIConfidencePanelProps) {
  const { assessment, aiConfidence, escalationReason } = claim;

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">AI Confidence</h3>
        <ConfidenceBadge score={aiConfidence} size="lg" />
      </div>

      {escalationReason && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
          <p className="text-xs font-medium text-rose-700 mb-0.5">Escalation Reason</p>
          <p className="text-sm text-rose-600">{escalationReason}</p>
        </div>
      )}

      {assessment && assessment.flags.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Flags</p>
          <div className="flex flex-wrap gap-2">
            {assessment.flags.map((flag, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      {assessment && assessment.damageClassification.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Per-Area Confidence</p>
          <div className="space-y-1.5">
            {assessment.damageClassification.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{d.area}</span>
                <ConfidenceBadge score={d.confidence} />
              </div>
            ))}
          </div>
        </div>
      )}

      {assessment?.aiReasoning && (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">AI Reasoning</p>
          <p className="text-sm text-slate-600 leading-relaxed">{assessment.aiReasoning}</p>
        </div>
      )}
    </Card>
  );
}
