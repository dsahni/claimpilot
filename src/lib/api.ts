import { Claim, ClaimInput, Assessment, ClaimFilter } from '@/types';
import { mockClaims } from '@/data/mockClaims';
import { mockAssessments } from '@/data/mockAssessments';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getClaims(policyholderName?: string): Promise<Claim[]> {
  await delay(100);
  if (policyholderName) {
    return mockClaims.filter(c => c.policyholderName === policyholderName);
  }
  return mockClaims;
}

export async function getClaim(id: string): Promise<Claim | undefined> {
  await delay(100);
  return mockClaims.find(c => c.id === id);
}

export async function getAdjusterQueue(filter?: ClaimFilter): Promise<Claim[]> {
  await delay(100);
  if (!filter) return mockClaims;
  const statusMap: Record<string, string[]> = {
    open: ['submitted', 'ai_processing', 'ai_assessed'],
    escalated: ['escalated'],
    approved: ['auto_approved', 'approved'],
    denied: ['denied'],
  };
  return mockClaims.filter(c => statusMap[filter]?.includes(c.status));
}

export async function getAssessment(claimId: string): Promise<Assessment | undefined> {
  await delay(100);
  return mockAssessments[claimId];
}

export function generateClaimId(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `CLM-2024-${num}`;
}

export function generateAssessment(claim: ClaimInput): Assessment {
  const totalEstimate = Math.floor(Math.random() * 3000) + 1500;
  const deductible = 500;
  const coveragePercent = 0.9;
  const coveredAmount = Math.round((totalEstimate - deductible) * coveragePercent);
  const outOfPocket = totalEstimate - coveredAmount;

  return {
    claimId: '',
    damageClassification: [
      { area: 'Primary impact zone', severity: 'Moderate', type: 'Dent', confidence: 88 },
      { area: 'Adjacent panel', severity: 'Minor', type: 'Scratch', confidence: 92 },
      { area: 'Structural check', severity: 'Minor', type: 'Scratch', confidence: 85 },
    ],
    costBreakdown: [
      { item: 'Body panel repair', laborHours: 4, laborRate: 85, partsCost: 380, subtotal: 720 },
      { item: 'Paint & finish', laborHours: 3, laborRate: 95, partsCost: 150, subtotal: 435 },
      { item: 'Parts replacement', laborHours: 2, laborRate: 85, partsCost: 290, subtotal: 460 },
      { item: 'Alignment & calibration', laborHours: 1, laborRate: 85, partsCost: 0, subtotal: 85 },
    ],
    policyTierAdjustment: {
      tier: 'Premium — Full Coverage',
      coveragePercent: 90,
      deductible: 500,
    },
    aiReasoning: `Damage analysis based on uploaded photos. Impact consistent with reported incident description. Vehicle ${claim.vehicle.year} ${claim.vehicle.make} ${claim.vehicle.model} repair costs estimated using manufacturer parts pricing and regional labor rates.`,
    flags: [],
    totalEstimate,
    coveredAmount,
    outOfPocket,
  };
}
