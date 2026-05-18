'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useClaims } from '@/context/ClaimsContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AssessmentResult from '@/components/claims/AssessmentResult';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const phases = [
  { label: 'Analyzing uploaded images...', icon: '&#128247;', duration: 2000 },
  { label: 'Classifying damage areas...', icon: '&#128270;', duration: 2000 },
  { label: 'Estimating repair costs...', icon: '&#128176;', duration: 2000 },
  { label: 'Generating assessment report...', icon: '&#128196;', duration: 1000 },
];

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const { getClaim, runAssessment } = useClaims();
  const claimId = params.id as string;
  const claim = getClaim(claimId);

  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [assessment, setAssessment] = useState(claim?.assessment || null);

  useEffect(() => {
    if (claim?.assessment && (claim.status === 'approved' || claim.status === 'auto_approved')) {
      setIsComplete(true);
      setAssessment(claim.assessment);
      setCurrentPhase(phases.length);
      return;
    }

    let cancelled = false;

    const runPhases = async () => {
      for (let i = 0; i < phases.length; i++) {
        if (cancelled) return;
        setCurrentPhase(i);
        setPhaseProgress(0);

        const duration = phases[i].duration;
        const steps = 20;
        const stepDuration = duration / steps;

        for (let s = 0; s <= steps; s++) {
          if (cancelled) return;
          await new Promise(r => setTimeout(r, stepDuration));
          setPhaseProgress((s / steps) * 100);
        }
      }

      if (cancelled) return;

      try {
        const result = runAssessment(claimId);
        setAssessment(result);
      } catch {
        // Claim might already have assessment
        const refreshedClaim = getClaim(claimId);
        if (refreshedClaim?.assessment) {
          setAssessment(refreshedClaim.assessment);
        }
      }

      setCurrentPhase(phases.length);
      setIsComplete(true);
    };

    runPhases();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!claim) {
    return (
      <DashboardLayout requiredRole="policyholder">
        <div className="text-center py-16">
          <p className="text-slate-500">Claim not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="policyholder">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => router.push(`/claims/${claimId}`)}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          &larr; Back to claim
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">AI Assessment</h1>
          <p className="text-sm text-slate-500 mt-1">
            Claim {claimId} &middot; {claim.vehicle.year} {claim.vehicle.make} {claim.vehicle.model}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-8">
                <div className="space-y-6">
                  {phases.map((phase, i) => {
                    const isActive = i === currentPhase;
                    const isDone = i < currentPhase;
                    const isPending = i > currentPhase;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-600'
                                : isActive
                                ? 'bg-indigo-100 text-indigo-600'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isDone ? (
                              <span>&#10003;</span>
                            ) : (
                              <span dangerouslySetInnerHTML={{ __html: phase.icon }} />
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isDone
                                ? 'text-emerald-700'
                                : isActive
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {phase.label}
                          </span>
                          {isActive && (
                            <motion.div
                              className="ml-auto"
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            >
                              <span className="text-indigo-500 text-sm">&#9696;</span>
                            </motion.div>
                          )}
                        </div>

                        {isActive && (
                          <div className="ml-11">
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${phaseProgress}%` }}
                                transition={{ duration: 0.1 }}
                              />
                            </div>
                          </div>
                        )}

                        {isPending && (
                          <div className="ml-11">
                            <div className="h-1.5 bg-slate-100 rounded-full" />
                          </div>
                        )}

                        {isDone && (
                          <div className="ml-11">
                            <div className="h-1.5 bg-emerald-200 rounded-full" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="p-4 text-center bg-emerald-50 border-emerald-200">
                <p className="text-sm font-medium text-emerald-700">
                  &#10003; Assessment complete
                </p>
              </Card>

              {assessment && <AssessmentResult assessment={assessment} />}

              <div className="flex gap-3 justify-center">
                <Button variant="secondary" onClick={() => router.push(`/claims/${claimId}`)}>
                  Back to Claim
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
