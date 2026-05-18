'use client';

import { useState } from 'react';
import { Claim, Assessment } from '@/types';
import Button from '@/components/ui/Button';

type AdjusterAction = 'approve' | 'approve_with_edits' | 'deny' | 'flag_for_review' | 'request_info' | 'move_to_repair' | 'move_to_final_inspection' | 'close';

interface ActionPanelProps {
  claim: Claim;
  editedAssessment?: Assessment;
  onAction: (action: AdjusterAction, payload?: { notes?: string; updatedAssessment?: Assessment }) => void;
}

export default function ActionPanel({ claim, editedAssessment, onAction }: ActionPanelProps) {
  const [notes, setNotes] = useState('');
  const { status } = claim;
  const isEscalated = status === 'escalated' || status === 'awaiting_information';
  const isApproved = status === 'approved' || status === 'auto_approved';
  const isRepair = status === 'repair';
  const isClosed = status === 'closed';

  const notesField = (placeholder = 'Add notes...', height = 'h-20') => (
    <div>
      <label className="text-xs font-medium text-slate-500 block mb-1">Notes</label>
      <textarea
        placeholder={placeholder}
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className={`w-full text-sm border border-slate-200 rounded-lg p-3 resize-none ${height} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
      />
    </div>
  );

  const closeButton = (
    <Button
      variant="ghost"
      size="sm"
      className="text-slate-500 border border-slate-200 hover:bg-slate-100"
      onClick={() => onAction('close', { notes: notes || undefined })}
    >
      Close Claim
    </Button>
  );

  if (isClosed) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-sm font-medium text-slate-500">This claim has been closed.</p>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <p className="text-sm font-medium text-rose-700">This claim has been denied.</p>
        {notesField()}
        <div className="flex gap-3">{closeButton}</div>
      </div>
    );
  }

  if ((isApproved || isRepair) && !isEscalated) {
    const approvalLabel = status === 'auto_approved' ? 'Auto-Approved' : status === 'repair' ? 'In Repair' : 'Approved';
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            {approvalLabel}
          </span>
          <span className="text-sm text-slate-500">
            {status === 'auto_approved' ? 'This claim was automatically approved by AI.' : status === 'repair' ? 'This claim is in repair.' : 'This claim was approved by an adjuster.'}
          </span>
        </div>
        {notesField()}
        <div className="flex gap-3 flex-wrap">
          {!isRepair && (
            <Button variant="primary" size="sm" onClick={() => onAction('move_to_repair', { notes: notes || undefined })}>
              Move to In Repair
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={() => onAction('move_to_final_inspection', { notes: notes || undefined })}>
            Move to Final Inspection
          </Button>
          <Button variant="danger" size="sm" onClick={() => onAction('flag_for_review', { notes: notes || 'Flagged by adjuster for manual review' })}>
            Flag for Review
          </Button>
          {closeButton}
        </div>
      </div>
    );
  }

  if (status === 'final_inspection') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            Final Inspection
          </span>
          <span className="text-sm text-slate-500">This claim is undergoing final inspection.</span>
        </div>
        {notesField()}
        <div className="flex gap-3 flex-wrap">{closeButton}</div>
      </div>
    );
  }

  if (isEscalated) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-semibold text-slate-900">Adjuster Decision</h4>
        {notesField('Add adjuster notes...', 'h-24')}
        <div className="flex gap-3 flex-wrap">
          <Button variant="success" onClick={() => onAction(editedAssessment ? 'approve_with_edits' : 'approve', { notes: notes || undefined, updatedAssessment: editedAssessment })}>
            Approve
          </Button>
          <Button variant="warning" onClick={() => onAction('request_info', { notes: notes || 'Additional information or documentation is required to process this claim.' })}>
            Request More Info
          </Button>
          <Button variant="danger" onClick={() => onAction('deny', { notes: notes || undefined })}>
            Deny Claim
          </Button>
          {closeButton}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <p className="text-sm text-slate-500">This claim is still being processed by AI.</p>
      {notesField()}
      <div className="flex gap-3">{closeButton}</div>
    </div>
  );
}
