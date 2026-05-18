'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Claim, getDisplayStatus } from '@/types';
import Card from '@/components/ui/Card';
import ClaimStatusBadge from './ClaimStatusBadge';

interface ClaimCardProps {
  claim: Claim;
  index: number;
}

export default function ClaimCard({ claim, index }: ClaimCardProps) {
  const router = useRouter();
  const displayStatus = getDisplayStatus(claim.status);
  const hasAmount = claim.assessment?.totalEstimate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card
        hover
        className="p-5"
        onClick={() => router.push(`/claims/${claim.id}`)}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{claim.id}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date(claim.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <ClaimStatusBadge status={claim.status} />
        </div>

        <div className="flex gap-3 mb-3">
          <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {claim.photos[0] ? (
              <img src={claim.photos[0]} alt="Damage" className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-400 text-xs">No photo</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800">
              {claim.vehicle.year} {claim.vehicle.make} {claim.vehicle.model}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
              {claim.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">Estimated Repair</span>
          <span className="text-sm font-semibold text-slate-900">
            {hasAmount
              ? `$${claim.assessment!.totalEstimate.toLocaleString()}`
              : displayStatus === 'Under Review' || displayStatus === 'Awaiting Information'
              ? 'Pending'
              : '—'}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
