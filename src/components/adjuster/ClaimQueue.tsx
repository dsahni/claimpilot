'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Claim, ClaimFilter } from '@/types';
import ClaimQueueRow from './ClaimQueueRow';

const STATUS_OPTIONS: { label: string; value: ClaimFilter }[] = [
  { label: 'Escalated', value: 'escalated' },
  { label: 'Awaiting Info', value: 'awaiting_information' },
  { label: 'Auto-Approved', value: 'auto_approved' },
  { label: 'Approved', value: 'approved' },
  { label: 'In Repair', value: 'repair' },
  { label: 'Final Inspection', value: 'final_inspection' },
  { label: 'Denied', value: 'denied' },
  { label: 'Closed', value: 'closed' },
];

function matchesFilter(claim: Claim, filter: ClaimFilter): boolean {
  return claim.status === filter;
}

function applyFilters(claims: Claim[], selected: ClaimFilter[], dateFrom: string, dateTo: string): Claim[] {
  return claims.filter(c => {
    if (selected.length > 0 && !selected.some(f => matchesFilter(c, f))) return false;
    const date = new Date(c.createdAt);
    if (dateFrom && date < new Date(dateFrom)) return false;
    if (dateTo && date > new Date(dateTo + 'T23:59:59')) return false;
    return true;
  });
}

interface ClaimQueueProps {
  claims: Claim[];
}

export default function ClaimQueue({ claims }: ClaimQueueProps) {
  const [selected, setSelected] = useState<ClaimFilter[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleFilter(value: ClaimFilter) {
    setSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  function clearAll() {
    setSelected([]);
    setDateFrom('');
    setDateTo('');
  }

  const hasActiveFilters = selected.length > 0 || dateFrom || dateTo;
  const filtered = applyFilters(claims, selected, dateFrom, dateTo);

  const buttonLabel = selected.length === 0
    ? 'All Statuses'
    : selected.length === 1
      ? STATUS_OPTIONS.find(o => o.value === selected[0])?.label ?? '1 selected'
      : `${selected.length} statuses`;

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50 flex-wrap">

        {/* Status dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className={`inline-flex items-center gap-2 text-sm border rounded-lg px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              selected.length > 0
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
            </svg>
            {buttonLabel}
            <svg className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute z-50 top-full left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1">
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</span>
                {selected.length > 0 && (
                  <button
                    onClick={() => setSelected([])}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Clear
                  </button>
                )}
              </div>
              {STATUS_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(opt.value)}
                    onChange={() => toggleFilter(opt.value)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Submitted:</span>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {hasActiveFilters && (
          <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Clear all
          </button>
        )}

        <span className="ml-auto text-xs text-slate-400">{filtered.length} claim{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="overflow-x-auto overflow-hidden rounded-b-xl">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Claim #</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Policyholder</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Vehicle</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Submitted</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">AI Confidence</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {filtered.map((claim, i) => (
                <ClaimQueueRow key={claim.id} claim={claim} index={i} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  No claims match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
