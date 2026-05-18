export type ClaimStatus =
  | 'submitted'
  | 'ai_processing'
  | 'ai_assessed'
  | 'escalated'
  | 'awaiting_information'
  | 'auto_approved'
  | 'approved'
  | 'denied'
  | 'repair'
  | 'final_inspection'
  | 'closed'
  | 'cancelled';

export type UserRole = 'policyholder' | 'adjuster';

export interface Vehicle {
  year: number;
  make: string;
  model: string;
}

export interface Claim {
  id: string;
  policyholderName: string;
  policyNumber: string;
  policyTier: string;
  vehicle: Vehicle;
  incidentDate: string;
  description: string;
  location: string;
  photos: string[];
  status: ClaimStatus;
  aiConfidence: number | null;
  escalationReason: string | null;
  assessment: Assessment | null;
  timeline: TimelineEntry[];
  createdAt: string;
}

export interface DamageClassification {
  area: string;
  severity: 'Minor' | 'Moderate' | 'Severe';
  type: 'Scratch' | 'Dent' | 'Structural' | 'Complete Loss';
  confidence: number;
}

export interface CostItem {
  item: string;
  laborHours: number;
  laborRate: number;
  partsCost: number;
  subtotal: number;
}

export interface PolicyTierAdjustment {
  tier: string;
  coveragePercent: number;
  deductible: number;
}

export interface Assessment {
  claimId: string;
  damageClassification: DamageClassification[];
  costBreakdown: CostItem[];
  policyTierAdjustment: PolicyTierAdjustment;
  aiReasoning: string;
  flags: string[];
  totalEstimate: number;
  coveredAmount: number;
  outOfPocket: number;
}

export interface TimelineEntry {
  timestamp: string;
  actor: 'System' | 'AI' | string;
  action: string;
  details?: string;
}

export interface RepairShop {
  name: string;
  address: string;
  distance: string;
  rating: number;
  preApproved: boolean;
}

export interface Policyholder {
  id: string;
  name: string;
  email: string;
  policyNumber: string;
  policyTier: string;
  accountAge: string;
  claimsHistory: number;
  policyStatus: 'Active' | 'Lapsed';
}

export interface ClaimInput {
  vehicle: Vehicle;
  incidentDate: string;
  description: string;
  location: string;
  photos: string[];
}

export type ClaimFilter = 'escalated' | 'awaiting_information' | 'auto_approved' | 'approved' | 'repair' | 'final_inspection' | 'denied' | 'closed';

export function getDisplayStatus(status: ClaimStatus): string {
  switch (status) {
    case 'submitted':
    case 'ai_processing':
    case 'ai_assessed':
    case 'escalated':
      return 'Under Review';
    case 'awaiting_information':
      return 'Awaiting Information';
    case 'auto_approved':
      return 'Auto-Approved';
    case 'approved':
      return 'Approved';
    case 'denied':
      return 'Denied';
    case 'repair':
      return 'In Repair';
    case 'final_inspection':
      return 'Final Inspection';
    case 'closed':
      return 'Closed';
    case 'cancelled':
      return 'Cancelled';
  }
}

export function getStatusColor(status: ClaimStatus): string {
  switch (status) {
    case 'submitted':
    case 'ai_processing':
    case 'ai_assessed':
    case 'escalated':
      return 'amber';
    case 'awaiting_information':
      return 'orange';
    case 'auto_approved':
    case 'approved':
      return 'emerald';
    case 'denied':
    case 'cancelled':
      return 'rose';
    case 'repair':
      return 'blue';
    case 'final_inspection':
      return 'purple';
    case 'closed':
      return 'slate';
  }
}
