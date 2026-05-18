'use client';

import { Policyholder } from '@/types';
import Card from '@/components/ui/Card';

interface PolicyholderCardProps {
  policyholder: Policyholder;
}

export default function PolicyholderCard({ policyholder }: PolicyholderCardProps) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Policyholder</h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-slate-900">{policyholder.name}</p>
          <p className="text-xs text-slate-500">{policyholder.email}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500">Policy #</p>
            <p className="text-sm font-medium text-slate-700">{policyholder.policyNumber}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Tier</p>
            <p className="text-sm font-medium text-slate-700">{policyholder.policyTier.split(' — ')[0]}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Account Age</p>
            <p className="text-sm font-medium text-slate-700">{policyholder.accountAge}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Prior Claims</p>
            <p className="text-sm font-medium text-slate-700">{policyholder.claimsHistory}</p>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            policyholder.policyStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {policyholder.policyStatus}
          </span>
        </div>
      </div>
    </Card>
  );
}
