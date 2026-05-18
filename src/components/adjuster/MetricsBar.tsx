'use client';

import { motion } from 'framer-motion';

interface Metrics {
  totalOpen: number;
  escalatedCount: number;
  avgConfidence: number;
  avgProcessingTime: string;
  processedToday: number;
}

interface MetricsBarProps {
  metrics: Metrics;
}

export default function MetricsBar({ metrics }: MetricsBarProps) {
  const items = [
    { label: 'Open Claims', value: metrics.totalOpen.toString() },
    { label: 'Escalated', value: metrics.escalatedCount.toString(), highlight: true },
    { label: 'Avg Confidence', value: `${metrics.avgConfidence}%` },
    { label: 'Avg Processing', value: metrics.avgProcessingTime },
    { label: 'Processed Today', value: metrics.processedToday.toString() },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="bg-white rounded-xl border border-slate-200 p-4"
        >
          <p className="text-xs text-slate-500 mb-1">{item.label}</p>
          <p className={`text-xl font-semibold ${item.highlight ? 'text-rose-600' : 'text-slate-900'}`}>
            {item.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
