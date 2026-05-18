'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ConfidenceHistogram from '@/components/adjuster/settings/ConfidenceHistogram';

const ASSESSED_SCORES = [42, 58, 92, 95];

const CATEGORIES = [
  { key: 'structural' as const, label: 'Structural Damage',      risk: 'High risk — default raised to 90%',     locked: false },
  { key: 'cosmetic'   as const, label: 'Scratches / Cosmetic',   risk: 'Low risk — default lowered to 75%',     locked: false },
  { key: 'totalLoss'  as const, label: 'Total Loss',             risk: 'Always escalates to human review',      locked: true  },
  { key: 'glass'      as const, label: 'Glass / Windshield',     risk: 'Moderate risk — default 80%',           locked: false },
];

const FRAUD_DESCRIPTIONS = {
  low:    'Only flag obvious signals (duplicate claim IDs, identical photos).',
  medium: 'Flag photo metadata anomalies, description-photo mismatches, and pre-existing damage patterns.',
  high:   'Aggressive flagging including statistical outliers, repair cost anomalies, and policyholder history patterns.',
};

export default function AdjusterSettings() {
  const [approveThreshold, setApproveThreshold] = useState(85);
  const [denyFloor, setDenyFloor] = useState(30);
  const [categoryThresholds, setCategoryThresholds] = useState({
    structural: 90,
    cosmetic:   75,
    totalLoss:  100,
    glass:      80,
  });
  const [fraudSensitivity, setFraudSensitivity] = useState<'low' | 'medium' | 'high'>('medium');
  const [aiTransparency, setAiTransparency] = useState(false);
  const [notifications, setNotifications] = useState({
    escalations:        true,
    highValue:          false,
    highValueThreshold: 5000,
    fraudFlags:         true,
    autoApprovals:      false,
  });
  const [saveToast, setSaveToast] = useState(false);

  const autoApproveCount = ASSESSED_SCORES.filter(s => s >= approveThreshold).length;
  const denyCount        = ASSESSED_SCORES.filter(s => s < denyFloor).length;
  const reviewCount      = ASSESSED_SCORES.filter(s => s >= denyFloor && s < approveThreshold).length;
  const approveCount     = ASSESSED_SCORES.filter(s => s >= approveThreshold).length;

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const updateCategory = (key: keyof typeof categoryThresholds, val: number) => {
    setCategoryThresholds(prev => ({ ...prev, [key]: val }));
  };

  const sectionDelay = (i: number) => ({ delay: i * 0.07, duration: 0.3 });

  return (
    <DashboardLayout requiredRole="adjuster">
      <div className="space-y-6 max-w-3xl">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-2xl font-semibold text-slate-900">AI Model Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure how ClaimPilot&apos;s AI processes and routes claims</p>
        </motion.div>

        {/* Save toast */}
        <AnimatePresence>
          {saveToast && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm font-medium text-emerald-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Settings saved successfully.
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Section 1: Auto-Approve Threshold ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(0)}>
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Auto-Approve Confidence Threshold
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Claims with AI scores at or above this threshold are automatically approved without human review.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range" min={50} max={99} value={approveThreshold}
                onChange={e => setApproveThreshold(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-2xl font-semibold text-indigo-600 w-16 text-right tabular-nums">
                {approveThreshold}%
              </span>
            </div>

            <p className="text-sm text-slate-500">
              At this threshold,{' '}
              <span className="font-semibold text-slate-900">{autoApproveCount} of {ASSESSED_SCORES.length}</span>{' '}
              assessed claims would auto-approve.
            </p>

            <div className="border border-slate-100 rounded-lg bg-slate-50 px-3 pt-3 pb-1">
              <p className="text-xs text-slate-400 mb-1">Confidence score distribution — recent claims</p>
              <ConfidenceHistogram
                scores={ASSESSED_SCORES}
                approveThreshold={approveThreshold}
                denyFloor={denyFloor}
              />
            </div>
          </Card>
        </motion.div>

        {/* ── Section 2: Auto-Deny Floor + Zone Bar ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(1)}>
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Auto-Deny Floor
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Claims below this score are automatically denied or flagged as likely fraudulent.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range" min={0} max={50} value={denyFloor}
                onChange={e => setDenyFloor(Number(e.target.value))}
                className="flex-1 accent-rose-500"
              />
              <span className="text-2xl font-semibold text-rose-500 w-16 text-right tabular-nums">
                {denyFloor}%
              </span>
            </div>

            {/* Three-zone bar */}
            <div className="space-y-1.5">
              <div className="relative h-7 rounded-full overflow-hidden bg-slate-100">
                {/* Red zone */}
                <div className="absolute inset-y-0 left-0 bg-rose-400 transition-all duration-150"
                  style={{ width: `${denyFloor}%` }} />
                {/* Amber zone */}
                <div className="absolute inset-y-0 bg-amber-400 transition-all duration-150"
                  style={{ left: `${denyFloor}%`, width: `${Math.max(0, approveThreshold - denyFloor)}%` }} />
                {/* Green zone */}
                <div className="absolute inset-y-0 bg-emerald-400 transition-all duration-150"
                  style={{ left: `${approveThreshold}%`, right: 0 }} />
                {/* Divider lines */}
                <div className="absolute inset-y-0 w-0.5 bg-white shadow-sm" style={{ left: `${denyFloor}%` }} />
                <div className="absolute inset-y-0 w-0.5 bg-white shadow-sm" style={{ left: `${approveThreshold}%` }} />
              </div>

              {/* Zone labels */}
              <div className="flex text-xs font-medium">
                <span className="text-rose-600" style={{ width: `${denyFloor}%`, minWidth: denyFloor > 0 ? 'auto' : 0 }}>
                  {denyFloor > 8 ? `Auto-deny (${denyCount})` : ''}
                </span>
                <span className="text-amber-600 text-center flex-1">
                  Review ({reviewCount})
                </span>
                <span className="text-emerald-600 text-right" style={{ width: `${100 - approveThreshold}%` }}>
                  {(100 - approveThreshold) > 12 ? `Auto-approve (${approveCount})` : `(${approveCount})`}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Three zones: <span className="text-rose-600 font-medium">auto-deny</span> ·{' '}
              <span className="text-amber-600 font-medium">human review</span> ·{' '}
              <span className="text-emerald-600 font-medium">auto-approve</span>
            </p>
          </Card>
        </motion.div>

        {/* ── Section 3: Per-Category Threshold Overrides ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(2)}>
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Per-Category Threshold Overrides
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Override the global threshold for specific damage types based on cost and risk.
              </p>
            </div>

            <div className="space-y-5">
              {CATEGORIES.map(cat => (
                <div key={cat.key} className="flex items-center gap-4">
                  <div className="w-48 flex-shrink-0">
                    <p className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                      {cat.label}
                      {cat.locked && (
                        <span className="text-slate-400 text-xs" dangerouslySetInnerHTML={{ __html: '&#128274;' }} />
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{cat.risk}</p>
                  </div>
                  <input
                    type="range" min={50} max={100}
                    value={categoryThresholds[cat.key]}
                    disabled={cat.locked}
                    onChange={e => !cat.locked && updateCategory(cat.key, Number(e.target.value))}
                    className={`flex-1 ${cat.locked ? 'opacity-40 cursor-not-allowed' : 'accent-indigo-600'}`}
                  />
                  <span className={`text-sm font-semibold w-12 text-right tabular-nums ${cat.locked ? 'text-slate-400' : 'text-indigo-600'}`}>
                    {cat.locked ? '—' : `${categoryThresholds[cat.key]}%`}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ── Section 4: Fraud Sensitivity ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(3)}>
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Fraud Sensitivity Level
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Controls how aggressively the AI flags claims for potential fraud.
              </p>
            </div>

            <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
              {(['low', 'medium', 'high'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setFraudSensitivity(level)}
                  className={`px-5 py-2 text-sm font-medium capitalize border-r border-slate-200 last:border-r-0 transition-colors ${
                    fraudSensitivity === level
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <p className="text-sm text-slate-600">{FRAUD_DESCRIPTIONS[fraudSensitivity]}</p>

            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <span className="text-amber-500 mt-0.5 flex-shrink-0" dangerouslySetInnerHTML={{ __html: '&#9888;' }} />
              <p className="text-xs text-amber-700">
                Higher sensitivity may increase false positives, negatively impacting legitimate customer claims and trust.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* ── Section 5: AI Transparency ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(4)}>
          <Card className="p-6 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              AI Transparency to Policyholder
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Show AI reasoning to policyholder</p>
              </div>
              <button
                role="switch"
                aria-checked={aiTransparency}
                onClick={() => setAiTransparency(v => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  aiTransparency ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  aiTransparency ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={String(aiTransparency)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-slate-500"
              >
                {aiTransparency
                  ? 'Policyholder sees damage classification details, cost breakdown methodology, and AI confidence scores.'
                  : 'Policyholder sees only the final estimate and claim status.'}
              </motion.p>
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* ── Section 6: Notification Preferences ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(5)}>
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Notification Preferences
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose which events trigger an adjuster alert.
              </p>
            </div>

            <div className="space-y-3">
              {/* All escalations */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={notifications.escalations}
                  onChange={e => setNotifications(prev => ({ ...prev, escalations: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-slate-700">All escalations</p>
                  <p className="text-xs text-slate-400">Claims routed for human review due to low AI confidence</p>
                </div>
              </label>

              {/* High-value claims */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={notifications.highValue}
                  onChange={e => setNotifications(prev => ({ ...prev, highValue: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-slate-700">High-value claims above</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-500">$</span>
                    <input
                      type="number"
                      value={notifications.highValueThreshold}
                      onChange={e => setNotifications(prev => ({ ...prev, highValueThreshold: Number(e.target.value) }))}
                      disabled={!notifications.highValue}
                      className="w-24 text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </label>

              {/* Fraud flags */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={notifications.fraudFlags}
                  onChange={e => setNotifications(prev => ({ ...prev, fraudFlags: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-slate-700">Fraud flags</p>
                  <p className="text-xs text-slate-400">Claims flagged by the fraud detection agent</p>
                </div>
              </label>

              {/* All auto-approvals */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={notifications.autoApprovals}
                  onChange={e => setNotifications(prev => ({ ...prev, autoApprovals: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-slate-700">All auto-approvals</p>
                  <p className="text-xs text-slate-400">Claims automatically approved by AI above the confidence threshold</p>
                </div>
              </label>
            </div>
          </Card>
        </motion.div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={sectionDelay(6)}
          className="flex items-center justify-between pt-2 pb-8"
        >
          <p className="text-xs text-slate-400">Changes apply immediately in prototype mode</p>
          <Button variant="primary" onClick={handleSave}>
            Save Settings
          </Button>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
