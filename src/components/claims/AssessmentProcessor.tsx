'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClaims } from '@/context/ClaimsContext';
import Card from '@/components/ui/Card';

const phases = [
  { label: 'Analyzing uploaded images...', icon: '&#128247;', duration: 3500 },
  { label: 'Classifying damage areas...', icon: '&#128270;', duration: 3500 },
  { label: 'Estimating repair costs...', icon: '&#128176;', duration: 3500 },
  { label: 'Generating assessment report...', icon: '&#128196;', duration: 2500 },
];

interface AssessmentProcessorProps {
  claimId: string;
}

export default function AssessmentProcessor({ claimId }: AssessmentProcessorProps) {
  const { runAssessment } = useClaims();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const runPhases = async () => {
      for (let i = 0; i < phases.length; i++) {
        if (cancelled) return;
        setCurrentPhase(i);
        setPhaseProgress(0);

        const steps = 40;
        const stepDuration = phases[i].duration / steps;

        for (let s = 0; s <= steps; s++) {
          if (cancelled) return;
          await new Promise(r => setTimeout(r, stepDuration));
          setPhaseProgress((s / steps) * 100);
        }
      }

      if (cancelled) return;

      try {
        runAssessment(claimId);
      } catch {
        // assessment may already exist
      }

      setCurrentPhase(phases.length);
      setIsComplete(true);
    };

    runPhases();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-900 mb-1">ClaimPilot AI Assessment</p>
            <p className="text-xs text-slate-500 mb-5">Processing your claim — this will only take a moment.</p>
            <div className="space-y-5">
              {phases.map((phase, i) => {
                const isActive = i === currentPhase;
                const isDone = i < currentPhase;
                const isPending = i > currentPhase;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
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
                          isDone ? 'text-emerald-700' : isActive ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {phase.label}
                      </span>
                      {isActive && (
                        <motion.span
                          className="ml-auto text-indigo-500 text-xs"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        >
                          &#9696;
                        </motion.span>
                      )}
                    </div>

                    <div className="ml-10">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${isDone ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                          style={{ width: isDone ? '100%' : isActive ? `${phaseProgress}%` : '0%' }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
