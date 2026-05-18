'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useClaims } from '@/context/ClaimsContext';
import { getDisplayStatus } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClaimStatusBadge from '@/components/claims/ClaimStatusBadge';
import AssessmentResult from '@/components/claims/AssessmentResult';
import AuthorizationLetter from '@/components/claims/AuthorizationLetter';
import RepairShops from '@/components/claims/RepairShops';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import PolicyholderTimeline from '@/components/claims/PolicyholderTimeline';
import AssessmentProcessor from '@/components/claims/AssessmentProcessor';

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getClaim, cancelClaim, addPhotos } = useClaims();
  const claim = getClaim(params.id as string);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showAddPhotos, setShowAddPhotos] = useState(false);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);

  if (!claim) {
    return (
      <DashboardLayout requiredRole="policyholder">
        <div className="text-center py-16">
          <p className="text-slate-500">Claim not found.</p>
          <Button variant="secondary" className="mt-4" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const displayStatus = getDisplayStatus(claim.status);
  const isApproved = claim.status === 'approved' || claim.status === 'auto_approved';
  const isCancelled = claim.status === 'cancelled';
  const isDenied = claim.status === 'denied';
  const isRepair = claim.status === 'repair';
  const isFinalInspection = claim.status === 'final_inspection';
  const isClosed = claim.status === 'closed';
  const isAwaitingInfo = claim.status === 'awaiting_information';
  const canRunAssessment = claim.status === 'submitted' || claim.status === 'ai_processing';
  const hasAssessment = !!claim.assessment;
  const showAssessment = (isApproved || isRepair || isFinalInspection || isClosed) && hasAssessment;
  const canModify = !isApproved && !isCancelled && !isDenied && !isRepair && !isFinalInspection && !isClosed;

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const previews = Array.from(files).map(f => URL.createObjectURL(f));
    setNewPhotoPreviews(prev => [...prev, ...previews]);
  };

  const handleSubmitPhotos = () => {
    if (newPhotoPreviews.length === 0) return;
    addPhotos(claim.id, newPhotoPreviews);
    setNewPhotoPreviews([]);
    setShowAddPhotos(false);
  };

  const handleCancelClaim = () => {
    if (!cancelReason.trim()) return;
    cancelClaim(claim.id, cancelReason.trim());
    setShowCancelModal(false);
    setCancelReason('');
  };

  return (
    <DashboardLayout requiredRole="policyholder">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6 block"
        >
          &larr; Back to claims
        </button>

        <div className="flex gap-6 items-start">
          {/* Main content column */}
          <div className="flex-1 min-w-0 space-y-6">

        {/* Status banner — always first */}
        {canRunAssessment && (
          <AssessmentProcessor claimId={claim.id} />
        )}

        {displayStatus === 'Under Review' && !canRunAssessment && !isAwaitingInfo && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 text-center">
              <div className="text-2xl mb-2">&#128269;</div>
              <p className="text-sm text-slate-600 font-medium">Your claim is under review</p>
              <p className="text-xs text-slate-500 mt-1">
                A claims adjuster is reviewing your claim. You&apos;ll be notified when a decision is made.
              </p>
            </Card>
          </motion.div>
        )}

        {isAwaitingInfo && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 border-orange-200 bg-orange-50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">&#128172;</span>
                <div>
                  <p className="text-sm font-semibold text-orange-900">Additional information requested</p>
                  <p className="text-sm text-orange-700 mt-1">
                    {claim.timeline.findLast(t => t.action.toLowerCase().includes('awaiting'))?.details ||
                      'Please add additional photos to this claim. Ensure that the photos clearly show the requested damage.'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {isRepair && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">&#128295;</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Your vehicle is being repaired</p>
                  <p className="text-sm text-slate-500 mt-1">
                    The repair shop is working on your vehicle. You will be notified once repairs are complete and a final inspection is scheduled.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {isFinalInspection && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">&#128269;</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Final inspection in progress</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Repairs are complete and a final quality inspection is underway. Your claim will be closed once the inspection is passed.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {isClosed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">&#10003;</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Claim closed</p>
                  <p className="text-sm text-slate-500 mt-1">
                    All repairs have been verified and your claim has been successfully closed. Thank you for using ClaimPilot.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {isDenied && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 border-rose-200 bg-rose-50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">&#128683;</span>
                <div>
                  <p className="text-sm font-semibold text-rose-900">Claim Denied</p>
                  <p className="text-sm text-rose-700 mt-1">
                    Your claim has been reviewed and denied.
                    {claim.timeline.findLast(t => t.action.toLowerCase().includes('denied'))?.details &&
                      ` Reason: ${claim.timeline.findLast(t => t.action.toLowerCase().includes('denied'))?.details}`}
                  </p>
                  <p className="text-sm text-rose-700 mt-3">
                    If you believe this decision was made in error, you may appeal by calling{' '}
                    <span className="font-semibold">1-800-555-0199</span> (Mon–Fri, 8am–6pm EST).
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {isCancelled && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 text-center">
              <div className="text-2xl mb-2">&#10060;</div>
              <p className="text-sm text-slate-600 font-medium">This claim has been cancelled</p>
              {claim.timeline.find(t => t.action === 'Claim cancelled')?.details && (
                <p className="text-xs text-slate-500 mt-1">
                  Reason: {claim.timeline.find(t => t.action === 'Claim cancelled')?.details}
                </p>
              )}
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">{claim.id}</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Filed on{' '}
                  {new Date(claim.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <ClaimStatusBadge status={claim.status} />
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-slate-500">Vehicle</p>
                <p className="text-slate-800 font-medium mt-0.5">
                  {claim.vehicle.year} {claim.vehicle.make} {claim.vehicle.model}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Incident Date</p>
                <p className="text-slate-800 font-medium mt-0.5">
                  {new Date(claim.incidentDate + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-500">Description</p>
                <p className="text-slate-800 mt-0.5">{claim.description}</p>
              </div>
              {claim.location && (
                <div className="col-span-2">
                  <p className="text-slate-500">Location</p>
                  <p className="text-slate-800 mt-0.5">{claim.location}</p>
                </div>
              )}
            </div>

            {canModify && (
              <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                <Button variant="secondary" size="sm" onClick={() => setShowAddPhotos(true)}>
                  + Add Documentation
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowCancelModal(true)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                  Cancel Claim
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {claim.photos.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">Uploaded Photos</h3>
                {canModify && (
                  <Button variant="ghost" size="sm" onClick={() => setShowAddPhotos(true)}>
                    + Add more
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {claim.photos.map((photo, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 overflow-hidden bg-slate-100">
                    <img
                      src={photo}
                      alt={`Damage photo ${i + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        <AnimatePresence>
          {showAddPhotos && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Add Supporting Documentation</h3>
                <label
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={e => { e.preventDefault(); e.stopPropagation(); handleFilesSelected(e.dataTransfer.files); }}
                  className="block border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
                >
                  <p className="text-sm text-slate-600 font-medium">Click or drag photos here</p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, or SVG</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => handleFilesSelected(e.target.files)}
                  />
                </label>
                {newPhotoPreviews.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {newPhotoPreviews.map((preview, i) => (
                        <div key={i} className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-100">
                          <img src={preview} alt={`New photo ${i + 1}`} className="w-full h-24 object-cover" />
                          <button
                            onClick={() => setNewPhotoPreviews(prev => prev.filter((_, j) => j !== i))}
                            className="absolute top-1 right-1 w-5 h-5 bg-slate-800/70 text-white rounded-full text-xs flex items-center justify-center hover:bg-slate-900"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <Button size="sm" onClick={handleSubmitPhotos} disabled={newPhotoPreviews.length === 0}>
                    Upload {newPhotoPreviews.length > 0 ? `(${newPhotoPreviews.length})` : ''}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setShowAddPhotos(false); setNewPhotoPreviews([]); }}>
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {showAssessment && claim.assessment && (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <AssessmentResult assessment={claim.assessment} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <AuthorizationLetter claim={claim} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <RepairShops />
            </motion.div>
          </>
        )}

          </div>{/* end main content column */}

          {/* Timeline sidebar */}
          <div className="w-64 shrink-0">
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <PolicyholderTimeline timeline={claim.timeline} status={claim.status} />
            </motion.div>
          </div>
        </div>{/* end two-column flex */}
      </div>

      <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)}>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Cancel Claim</h3>
          <p className="text-sm text-slate-500">
            Are you sure you want to cancel claim <span className="font-medium text-slate-700">{claim.id}</span>? This action cannot be undone.
          </p>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Reason for cancellation</label>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Please explain why you're cancelling this claim..."
              className="w-full text-sm border border-slate-200 rounded-lg p-3 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setShowCancelModal(false)}>
              Keep Claim
            </Button>
            <Button variant="danger" size="sm" onClick={handleCancelClaim} disabled={!cancelReason.trim()}>
              Cancel Claim
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
