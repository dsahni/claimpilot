'use client';

import { useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricsBar from '@/components/adjuster/MetricsBar';
import ThresholdInfo from '@/components/adjuster/ThresholdInfo';
import ClaimQueue from '@/components/adjuster/ClaimQueue';

export default function AdjusterDashboard() {
  const { claims } = useClaims();

  const metrics = useMemo(() => {
    const openStatuses = ['submitted', 'ai_processing', 'ai_assessed'];
    const totalOpen = claims.filter(c => openStatuses.includes(c.status)).length;
    const escalatedCount = claims.filter(c => c.status === 'escalated').length;

    const withConfidence = claims.filter(c => c.aiConfidence !== null);
    const avgConfidence = withConfidence.length > 0
      ? Math.round(withConfidence.reduce((sum, c) => sum + c.aiConfidence!, 0) / withConfidence.length)
      : 0;

    const processedToday = claims.filter(c => c.status === 'approved' || c.status === 'auto_approved' || c.status === 'denied').length;

    return {
      totalOpen,
      escalatedCount,
      avgConfidence,
      avgProcessingTime: '~7 sec',
      processedToday,
    };
  }, [claims]);

  return (
    <DashboardLayout requiredRole="adjuster">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Claims Queue</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage incoming claims</p>
        </div>

        <MetricsBar metrics={metrics} />
        <ThresholdInfo />
        <ClaimQueue claims={claims} />
      </div>
    </DashboardLayout>
  );
}
