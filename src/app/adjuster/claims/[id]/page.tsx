'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useClaims } from '@/context/ClaimsContext';
import { useAuth } from '@/context/AuthContext';
import { Assessment } from '@/types';
import { mockPolicyholders } from '@/data/mockPolicyholders';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AIConfidencePanel from '@/components/adjuster/AIConfidencePanel';
import AIFeedback from '@/components/adjuster/AIFeedback';
import PolicyholderCard from '@/components/adjuster/PolicyholderCard';
import ClaimTimeline from '@/components/adjuster/ClaimTimeline';
import EditableAssessment from '@/components/adjuster/EditableAssessment';
import ActionPanel from '@/components/adjuster/ActionPanel';
import ClaimStatusBadge from '@/components/claims/ClaimStatusBadge';

export default function AdjusterClaimDetail() {
  const params = useParams();
  const router = useRouter();
  const { getClaim, adjusterAction, updateClaim } = useClaims();
  const { user } = useAuth();
  const claimId = params.id as string;
  const claim = getClaim(claimId);
  const [editedAssessment, setEditedAssessment] = useState<Assessment | null>(null);
  const [actionTaken, setActionTaken] = useState(false);

  useEffect(() => {
    if (claim?.assessment) {
      setEditedAssessment({ ...claim.assessment });
    }
  }, [claim?.assessment]);

  if (!claim) {
    return (
      <DashboardLayout requiredRole="adjuster">
        <div className="text-center py-16">
          <p className="text-slate-500">Claim not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  const policyholder = Object.values(mockPolicyholders).find(
    p => p.policyNumber === claim.policyNumber
  );

  const isEscalated = claim.status === 'escalated';
  const isReadOnly = !isEscalated;

  const handleFeedback = (feedback: { rating: 'positive' | 'negative'; comment: string }) => {
    if (!claim) return;
    const details = feedback.comment
      ? `${feedback.rating === 'positive' ? 'Accurate' : 'Inaccurate'} — ${feedback.comment}`
      : feedback.rating === 'positive' ? 'AI assessment marked as accurate' : 'AI assessment marked as inaccurate';
    updateClaim(claimId, {
      timeline: [...claim.timeline, {
        timestamp: new Date().toISOString(),
        actor: user?.name || 'Adjuster',
        action: 'AI feedback submitted',
        details,
      }],
    });
  };

  const handleAction = (action: 'approve' | 'approve_with_edits' | 'deny' | 'flag_for_review' | 'request_info' | 'move_to_repair' | 'move_to_final_inspection' | 'close', payload?: { notes?: string; updatedAssessment?: Assessment }) => {
    adjusterAction(claimId, action, user?.name || 'Adjuster', payload);
    setActionTaken(true);
  };

  return (
    <DashboardLayout requiredRole="adjuster">
      <div className="space-y-6">
        <button
          onClick={() => router.push('/adjuster')}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          &larr; Back to queue
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">{claim.id}</h1>
              <ClaimStatusBadge status={claim.status} showInternal />
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {claim.vehicle.year} {claim.vehicle.make} {claim.vehicle.model} &middot; {claim.policyholderName}
            </p>
          </div>
        </motion.div>

        {actionTaken && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm font-medium text-emerald-700"
          >
            Action recorded successfully. Claim status updated.
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AIConfidencePanel claim={claim} />

            {claim.assessment && (
              <AIFeedback onSubmit={handleFeedback} />
            )}

            {claim.assessment && editedAssessment && (
              <EditableAssessment
                assessment={editedAssessment}
                onChange={setEditedAssessment}
                readOnly={isReadOnly}
              />
            )}

            <ActionPanel
              claim={claim}
              editedAssessment={editedAssessment || undefined}
              onAction={handleAction}
            />

            {claim.photos.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">Uploaded Photos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {claim.photos.map((photo, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt={`Damage ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Incident Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="text-slate-700">{new Date(claim.incidentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-slate-700">{claim.location}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-slate-500">Description</p>
                <p className="text-sm text-slate-700 mt-0.5">{claim.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {policyholder && <PolicyholderCard policyholder={policyholder} />}
            <ClaimTimeline timeline={claim.timeline} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
