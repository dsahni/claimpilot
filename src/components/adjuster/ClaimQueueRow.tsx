'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Claim } from '@/types';
import ClaimStatusBadge from '@/components/claims/ClaimStatusBadge';
import ConfidenceBadge from './ConfidenceBadge';

interface ClaimQueueRowProps {
  claim: Claim;
  index: number;
}

export default function ClaimQueueRow({ claim, index }: ClaimQueueRowProps) {
  const router = useRouter();

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      onClick={() => router.push(`/adjuster/claims/${claim.id}`)}
      className="hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
    >
      <td className="px-4 py-3 text-sm font-medium text-slate-900">{claim.id}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{claim.policyholderName}</td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {claim.vehicle.year} {claim.vehicle.make} {claim.vehicle.model}
      </td>
      <td className="px-4 py-3 text-sm text-slate-500">
        {new Date(claim.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
      </td>
      <td className="px-4 py-3">
        <ConfidenceBadge score={claim.aiConfidence} />
      </td>
      <td className="px-4 py-3">
        <ClaimStatusBadge status={claim.status} showInternal showEscalationIcon={claim.status === 'escalated'} />
      </td>
    </motion.tr>
  );
}
