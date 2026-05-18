'use client';

import { Assessment } from '@/types';
import Card from '@/components/ui/Card';

interface EditableAssessmentProps {
  assessment: Assessment;
  onChange: (updated: Assessment) => void;
  readOnly?: boolean;
}

const severityOptions = ['Minor', 'Moderate', 'Severe'] as const;
const typeOptions = ['Scratch', 'Dent', 'Structural', 'Complete Loss'] as const;

export default function EditableAssessment({ assessment, onChange, readOnly = false }: EditableAssessmentProps) {
  const updateDamage = (index: number, field: string, value: string) => {
    const updated = { ...assessment };
    updated.damageClassification = [...assessment.damageClassification];
    updated.damageClassification[index] = { ...updated.damageClassification[index], [field]: value };
    onChange(updated);
  };

  const updateCost = (index: number, field: string, value: number) => {
    const updated = { ...assessment };
    updated.costBreakdown = [...assessment.costBreakdown];
    const item = { ...updated.costBreakdown[index], [field]: value };
    item.subtotal = (item.laborHours * item.laborRate) + item.partsCost;
    updated.costBreakdown[index] = item;
    updated.totalEstimate = updated.costBreakdown.reduce((sum, c) => sum + c.subtotal, 0);
    updated.coveredAmount = Math.round(updated.totalEstimate * (assessment.policyTierAdjustment.coveragePercent / 100));
    updated.outOfPocket = updated.totalEstimate - updated.coveredAmount + assessment.policyTierAdjustment.deductible;
    onChange(updated);
  };

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Assessment Details</h3>

      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Damage Classification</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-3 text-xs font-medium text-slate-500">Area</th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-slate-500">Severity</th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-slate-500">Type</th>
                <th className="text-left py-2 text-xs font-medium text-slate-500">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {assessment.damageClassification.map((d, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{d.area}</td>
                  <td className="py-2 pr-3">
                    {readOnly ? (
                      <span className="text-slate-700">{d.severity}</span>
                    ) : (
                      <select
                        value={d.severity}
                        onChange={e => updateDamage(i, 'severity', e.target.value)}
                        className="text-sm border border-slate-200 rounded px-2 py-1 bg-white"
                      >
                        {severityOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    {readOnly ? (
                      <span className="text-slate-700">{d.type}</span>
                    ) : (
                      <select
                        value={d.type}
                        onChange={e => updateDamage(i, 'type', e.target.value)}
                        className="text-sm border border-slate-200 rounded px-2 py-1 bg-white"
                      >
                        {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    )}
                  </td>
                  <td className="py-2 text-slate-500">{d.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Cost Breakdown</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-3 text-xs font-medium text-slate-500">Item</th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-slate-500">Labor Hrs</th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-slate-500">Rate/Hr</th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-slate-500">Parts</th>
                <th className="text-right py-2 text-xs font-medium text-slate-500">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {assessment.costBreakdown.map((c, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{c.item}</td>
                  <td className="py-2 pr-3">
                    {readOnly ? (
                      <span className="text-slate-700">{c.laborHours}</span>
                    ) : (
                      <input
                        type="number"
                        value={c.laborHours}
                        onChange={e => updateCost(i, 'laborHours', parseFloat(e.target.value) || 0)}
                        className="w-16 text-sm border border-slate-200 rounded px-2 py-1"
                      />
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    {readOnly ? (
                      <span className="text-slate-700">${c.laborRate}</span>
                    ) : (
                      <input
                        type="number"
                        value={c.laborRate}
                        onChange={e => updateCost(i, 'laborRate', parseFloat(e.target.value) || 0)}
                        className="w-20 text-sm border border-slate-200 rounded px-2 py-1"
                      />
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    {readOnly ? (
                      <span className="text-slate-700">${c.partsCost}</span>
                    ) : (
                      <input
                        type="number"
                        value={c.partsCost}
                        onChange={e => updateCost(i, 'partsCost', parseFloat(e.target.value) || 0)}
                        className="w-24 text-sm border border-slate-200 rounded px-2 py-1"
                      />
                    )}
                  </td>
                  <td className="py-2 text-right font-medium text-slate-900">${c.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-300">
                <td colSpan={4} className="py-2 text-right font-medium text-slate-700">Total Estimate:</td>
                <td className="py-2 text-right font-semibold text-slate-900">${assessment.totalEstimate.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200">
        <div>
          <p className="text-xs text-slate-500">Coverage ({assessment.policyTierAdjustment.coveragePercent}%)</p>
          <p className="text-sm font-semibold text-slate-900">${assessment.coveredAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Deductible</p>
          <p className="text-sm font-semibold text-slate-900">${assessment.policyTierAdjustment.deductible.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Out of Pocket</p>
          <p className="text-sm font-semibold text-slate-900">${assessment.outOfPocket.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
}
