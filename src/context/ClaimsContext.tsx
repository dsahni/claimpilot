'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Claim, ClaimInput, Assessment } from '@/types';
import { mockClaims } from '@/data/mockClaims';
import { generateClaimId, generateAssessment } from '@/lib/api';

type AdjusterActionType = 'approve' | 'approve_with_edits' | 'deny' | 'flag_for_review' | 'request_info' | 'move_to_repair' | 'move_to_final_inspection' | 'close';

interface AdjusterActionPayload {
  notes?: string;
  updatedAssessment?: Assessment;
}

interface ClaimsContextType {
  claims: Claim[];
  getClaim: (id: string) => Claim | undefined;
  getClaimsForPolicyholder: (name: string) => Claim[];
  submitClaim: (input: ClaimInput, policyholderName: string) => Claim;
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  runAssessment: (claimId: string) => Assessment;
  adjusterAction: (claimId: string, action: AdjusterActionType, adjusterName: string, payload?: AdjusterActionPayload) => void;
  cancelClaim: (claimId: string, reason: string) => void;
  addPhotos: (claimId: string, photos: string[]) => void;
}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export function ClaimsProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>([...mockClaims]);

  const getClaim = useCallback((id: string) => claims.find(c => c.id === id), [claims]);

  const getClaimsForPolicyholder = useCallback(
    (name: string) => claims.filter(c => c.policyholderName === name),
    [claims]
  );

  const submitClaim = useCallback((input: ClaimInput, policyholderName: string): Claim => {
    const newClaim: Claim = {
      id: generateClaimId(),
      policyholderName,
      policyNumber: 'POL-2022-48291',
      policyTier: 'Premium — Full Coverage',
      vehicle: input.vehicle,
      incidentDate: input.incidentDate,
      description: input.description,
      location: input.location,
      photos: input.photos,
      status: 'submitted',
      aiConfidence: null,
      escalationReason: null,
      assessment: null,
      timeline: [
        {
          timestamp: new Date().toISOString(),
          actor: 'System',
          action: 'Claim submitted',
          details: 'Claim created by policyholder',
        },
      ],
      createdAt: new Date().toISOString(),
    };
    setClaims(prev => [newClaim, ...prev]);
    return newClaim;
  }, []);

  const updateClaim = useCallback((id: string, updates: Partial<Claim>) => {
    setClaims(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const adjusterAction = useCallback((claimId: string, action: AdjusterActionType, adjusterName: string, payload?: AdjusterActionPayload) => {
    setClaims(prev => prev.map(c => {
      if (c.id !== claimId) return c;

      const timelineEntry = {
        timestamp: new Date().toISOString(),
        actor: adjusterName,
        action: action === 'approve' ? 'Claim approved'
          : action === 'approve_with_edits' ? 'Claim approved with edits'
          : action === 'deny' ? 'Claim denied'
          : action === 'request_info' ? 'Additional information requested'
          : action === 'move_to_repair' ? 'Moved to In Repair'
          : action === 'move_to_final_inspection' ? 'Moved to Final Inspection'
          : action === 'close' ? 'Claim closed'
          : 'Flagged for review',
        details: payload?.notes || undefined,
      };

      const newStatus = action === 'deny' ? 'denied' as const
        : action === 'flag_for_review' ? 'escalated' as const
        : action === 'request_info' ? 'awaiting_information' as const
        : action === 'move_to_repair' ? 'repair' as const
        : action === 'move_to_final_inspection' ? 'final_inspection' as const
        : action === 'close' ? 'closed' as const
        : 'approved' as const;

      return {
        ...c,
        status: newStatus,
        assessment: payload?.updatedAssessment || c.assessment,
        escalationReason: action === 'flag_for_review' ? (payload?.notes || 'Flagged by adjuster') : c.escalationReason,
        timeline: [...c.timeline, timelineEntry],
      };
    }));
  }, []);

  const cancelClaim = useCallback((claimId: string, reason: string) => {
    setClaims(prev => prev.map(c => {
      if (c.id !== claimId) return c;
      return {
        ...c,
        status: 'cancelled' as const,
        timeline: [...c.timeline, {
          timestamp: new Date().toISOString(),
          actor: 'System',
          action: 'Claim cancelled',
          details: reason,
        }],
      };
    }));
  }, []);

  const addPhotos = useCallback((claimId: string, photos: string[]) => {
    setClaims(prev => prev.map(c => {
      if (c.id !== claimId) return c;
      return {
        ...c,
        photos: [...c.photos, ...photos],
        timeline: [...c.timeline, {
          timestamp: new Date().toISOString(),
          actor: 'System',
          action: 'Documentation added',
          details: `${photos.length} photo(s) added by policyholder`,
        }],
      };
    }));
  }, []);

  const runAssessment = useCallback((claimId: string): Assessment => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) throw new Error('Claim not found');

    const assessment = generateAssessment({
      vehicle: claim.vehicle,
      incidentDate: claim.incidentDate,
      description: claim.description,
      location: claim.location,
      photos: claim.photos,
    });
    assessment.claimId = claimId;

    const confidence = Math.floor(Math.random() * 10) + 88;

    const newTimeline = [
      ...claim.timeline,
      {
        timestamp: new Date().toISOString(),
        actor: 'AI' as const,
        action: 'Assessment complete',
        details: `Confidence: ${confidence}% — Auto-approved (above 85% threshold)`,
      },
      {
        timestamp: new Date().toISOString(),
        actor: 'System' as const,
        action: 'Claim auto-approved',
        details: 'Auto-approved based on AI confidence score',
      },
    ];

    setClaims(prev =>
      prev.map(c =>
        c.id === claimId
          ? {
              ...c,
              status: 'auto_approved' as const,
              aiConfidence: confidence,
              assessment,
              timeline: newTimeline,
            }
          : c
      )
    );

    return assessment;
  }, [claims]);

  return (
    <ClaimsContext.Provider value={{ claims, getClaim, getClaimsForPolicyholder, submitClaim, updateClaim, runAssessment, adjusterAction, cancelClaim, addPhotos }}>
      {children}
    </ClaimsContext.Provider>
  );
}

export function useClaims() {
  const context = useContext(ClaimsContext);
  if (!context) throw new Error('useClaims must be used within ClaimsProvider');
  return context;
}
