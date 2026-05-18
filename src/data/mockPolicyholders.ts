import { Policyholder } from '@/types';

export const mockPolicyholders: Record<string, Policyholder> = {
  'POL-001': {
    id: 'POL-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    policyNumber: 'POL-2022-48291',
    policyTier: 'Premium — Full Coverage',
    accountAge: '3 years',
    claimsHistory: 2,
    policyStatus: 'Active',
  },
  'POL-002': {
    id: 'POL-002',
    name: 'James Rodriguez',
    email: 'james.r@email.com',
    policyNumber: 'POL-2021-33105',
    policyTier: 'Standard — Collision Only',
    accountAge: '4 years',
    claimsHistory: 1,
    policyStatus: 'Active',
  },
  'POL-003': {
    id: 'POL-003',
    name: 'Emily Watson',
    email: 'emily.w@email.com',
    policyNumber: 'POL-2023-57832',
    policyTier: 'Premium — Full Coverage',
    accountAge: '1 year',
    claimsHistory: 0,
    policyStatus: 'Active',
  },
};
