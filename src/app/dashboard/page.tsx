'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useClaims } from '@/context/ClaimsContext';
import { getDisplayStatus } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClaimCard from '@/components/claims/ClaimCard';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { getClaimsForPolicyholder } = useClaims();

  const claims = useMemo(() => {
    if (!user) return [];
    return getClaimsForPolicyholder(user.name);
  }, [user, getClaimsForPolicyholder]);

  const stats = useMemo(() => {
    const total = claims.length;
    const underReview = claims.filter(c => getDisplayStatus(c.status) === 'Under Review').length;
    const approved = claims.filter(c => c.status === 'approved' || c.status === 'auto_approved').length;
    return { total, underReview, approved };
  }, [claims]);

  return (
    <DashboardLayout requiredRole="policyholder">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Claims Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Track and manage your insurance claims</p>
          </div>
          <Link href="/claims/new">
            <Button size="md">
              <span>+</span> New Claim
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Claims</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-sm text-slate-500">Under Review</p>
            <p className="text-2xl font-semibold text-amber-600 mt-1">{stats.underReview}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-sm text-slate-500">Approved</p>
            <p className="text-2xl font-semibold text-emerald-600 mt-1">{stats.approved}</p>
          </div>
        </div>

        {claims.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-4">No claims yet. Submit your first claim to get started.</p>
            <Link href="/claims/new">
              <Button>Submit a Claim</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {claims.map((claim, i) => (
              <ClaimCard key={claim.id} claim={claim} index={i} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
