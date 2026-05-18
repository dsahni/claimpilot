'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useClaims } from '@/context/ClaimsContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WizardProgress from '@/components/wizard/WizardProgress';
import StepDetails, { ClaimDetails } from '@/components/wizard/StepDetails';
import StepPhotos from '@/components/wizard/StepPhotos';
import StepReview from '@/components/wizard/StepReview';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

const steps = ['Claim Details', 'Upload Photos', 'Review & Submit'];

export default function NewClaimPage() {
  const { user } = useAuth();
  const { submitClaim } = useClaims();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAssessing, setShowAssessing] = useState(false);
  const [assessPhase, setAssessPhase] = useState(0);
  const [newClaimId, setNewClaimId] = useState('');

  const [details, setDetails] = useState<ClaimDetails>({
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    incidentDate: '',
    description: '',
    location: '',
  });

  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [sectionPhotos, setSectionPhotos] = useState<Record<string, string[]>>({});

  const handleToggleSection = useCallback((sectionId: string) => {
    setSelectedSections(prev => {
      if (prev.includes(sectionId)) {
        setSectionPhotos(sp => {
          const next = { ...sp };
          delete next[sectionId];
          return next;
        });
        return prev.filter(id => id !== sectionId);
      }
      return [...prev, sectionId];
    });
  }, []);

  const handleSectionPhotosChange = useCallback((sectionId: string, photos: string[]) => {
    setSectionPhotos(prev => ({ ...prev, [sectionId]: photos }));
  }, []);

  const allPhotos = selectedSections.flatMap(id => sectionPhotos[id] || []);
  const allSectionsHavePhotos = selectedSections.length > 0 &&
    selectedSections.every(id => (sectionPhotos[id] || []).length > 0);

  const canProceed = () => {
    if (currentStep === 0) {
      return details.vehicleYear && details.vehicleMake && details.vehicleModel && details.description;
    }
    if (currentStep === 1) {
      return allSectionsHavePhotos;
    }
    return true;
  };

  const handleContinueFromPhotos = () => {
    setShowAssessing(true);
    setAssessPhase(0);
  };

  useEffect(() => {
    if (!showAssessing) return;
    const timers = [
      setTimeout(() => setAssessPhase(1), 800),
      setTimeout(() => setAssessPhase(2), 1800),
      setTimeout(() => setAssessPhase(3), 2800),
      setTimeout(() => {
        setShowAssessing(false);
        setCurrentStep(2);
      }, 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [showAssessing]);

  const handleSubmit = () => {
    if (!user) return;
    const claim = submitClaim(
      {
        vehicle: {
          year: parseInt(details.vehicleYear),
          make: details.vehicleMake,
          model: details.vehicleModel,
        },
        incidentDate: details.incidentDate,
        description: details.description,
        location: details.location,
        photos: allPhotos,
      },
      user.name
    );
    setNewClaimId(claim.id);
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    router.push(`/claims/${newClaimId}`);
  };

  const assessPhases = [
    'Checking image quality...',
    'Verifying damage visibility...',
    'Matching photos to damage areas...',
    'Photos verified successfully!',
  ];

  return (
    <DashboardLayout requiredRole="policyholder">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-slate-900">New Claim</h1>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            ✕ Cancel
          </Button>
        </div>
        <p className="text-sm text-slate-500 mb-6">Submit a new insurance claim in 3 easy steps.</p>

        <WizardProgress currentStep={currentStep} steps={steps} />

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && <StepDetails data={details} onChange={setDetails} />}
              {currentStep === 1 && (
                <StepPhotos
                  selectedSections={selectedSections}
                  sectionPhotos={sectionPhotos}
                  onToggleSection={handleToggleSection}
                  onSectionPhotosChange={handleSectionPhotosChange}
                />
              )}
              {currentStep === 2 && (
                <StepReview
                  details={details}
                  selectedSections={selectedSections}
                  sectionPhotos={sectionPhotos}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={currentStep === 0}
            >
              Back
            </Button>

            {currentStep === 0 && (
              <Button
                onClick={() => setCurrentStep(1)}
                disabled={!canProceed()}
              >
                Continue
              </Button>
            )}

            {currentStep === 1 && (
              <Button
                onClick={handleContinueFromPhotos}
                disabled={!canProceed()}
              >
                Continue
              </Button>
            )}

            {currentStep === 2 && (
              <Button onClick={handleSubmit} disabled={!canProceed()}>
                Submit Claim
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* AI Assessing Photos Modal */}
      <Modal open={showAssessing} onClose={() => {}}>
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto mb-5 relative">
            <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-40" />
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-slate-500 to-indigo-600 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Assessing Photos
          </h3>

          <div className="space-y-2 mb-6">
            {assessPhases.map((phase, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 justify-center transition-all duration-300 ${
                  i <= assessPhase ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {i < assessPhase ? (
                  <span className="text-emerald-500 text-sm">&#10003;</span>
                ) : i === assessPhase ? (
                  <span className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                ) : null}
                <span className={`text-sm ${
                  i < assessPhase ? 'text-emerald-600' :
                  i === assessPhase ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {phase}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((assessPhase + 1) / assessPhases.length) * 100}%` }}
            />
          </div>
        </div>
      </Modal>

      {/* Submission Confirmation Modal */}
      <Modal open={showConfirmation} onClose={handleConfirmationClose}>
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-emerald-600 text-xl">&#10003;</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Claim Submitted!</h3>
          <p className="text-sm text-slate-500 mt-2">
            Your claim <span className="font-semibold text-slate-900">{newClaimId}</span> has been received. We will begin processing it now.
          </p>
          <Button className="mt-6 w-full" onClick={handleConfirmationClose}>
            View {newClaimId}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
