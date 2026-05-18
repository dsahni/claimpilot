'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockPolicy } from '@/data/mockPolicy';

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
      {title}
    </h2>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 py-2 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500 sm:w-48 shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {status}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PolicyPage() {
  const p = mockPolicy;

  const coveragesByVehicle = p.coverages.reduce<Record<string, typeof p.coverages>>((acc, c) => {
    if (!acc[c.vehicle]) acc[c.vehicle] = [];
    acc[c.vehicle].push(c);
    return acc;
  }, {});

  return (
    <DashboardLayout requiredRole="policyholder">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Policy Details</h1>
            <p className="text-sm text-slate-500 mt-1">Your active insurance policy information</p>
          </div>
          <StatusBadge status={p.status} />
        </div>

        {/* Policy Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <SectionHeader title="Policy Overview" />
          <div>
            <InfoRow label="Policy Number" value={p.policyNumber} />
            <InfoRow label="Policy Status" value={p.status} />
            <InfoRow label="Effective Date" value={formatDate(p.effectiveDate)} />
            <InfoRow label="Expiration / Renewal Date" value={formatDate(p.expirationDate)} />
            <InfoRow label="Named Insured" value={p.namedInsured.name} />
          </div>
        </div>

        {/* Drivers */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <SectionHeader title="Drivers" />
          {p.drivers.map((d) => (
            <div key={d.licenseNumber} className="mb-4">
              <InfoRow label="Name" value={d.name} />
              <InfoRow label="Date of Birth" value={formatDate(d.dateOfBirth)} />
              <InfoRow label="License Number" value={d.licenseNumber} />
              <InfoRow label="License State" value={d.licenseState} />
              <InfoRow label="Relation" value={d.relation} />
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <SectionHeader title="Contact Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Your Information
              </p>
              <InfoRow label="Address" value={p.namedInsured.address} />
              <InfoRow label="Phone" value={p.namedInsured.phone} />
              <InfoRow label="Email" value={p.namedInsured.email} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Your Agent
              </p>
              <InfoRow label="Agent Name" value={p.agent.name} />
              <InfoRow label="Office" value={p.agent.office} />
              <InfoRow label="Phone" value={p.agent.phone} />
              <InfoRow label="Email" value={p.agent.email} />
              <InfoRow label="Address" value={p.agent.address} />
            </div>
          </div>
        </div>

        {/* Covered Vehicles */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <SectionHeader title="Covered Vehicles" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {p.vehicles.map((v) => (
              <div
                key={v.vin}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🚗</span>
                  <p className="font-semibold text-slate-900">
                    {v.year} {v.make} {v.model}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Color</span>
                    <span className="font-medium text-slate-900">{v.color}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Trim</span>
                    <span className="font-medium text-slate-900">{v.trim}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">VIN</span>
                    <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      {v.vin}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage by Vehicle */}
        {Object.entries(coveragesByVehicle).map(([vehicleName, coverages]) => (
          <div key={vehicleName} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <SectionHeader title={`Coverage — ${vehicleName}`} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3 pr-4">Coverage Type</th>
                    <th className="pb-3 pr-4">Description</th>
                    <th className="pb-3 pr-4">Limit</th>
                    <th className="pb-3">Deductible</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {coverages.map((c) => (
                    <tr key={c.type} className="align-top">
                      <td className="py-3 pr-4 font-medium text-slate-900 whitespace-nowrap">
                        {c.type}
                      </td>
                      <td className="py-3 pr-4 text-slate-500 max-w-xs">{c.description}</td>
                      <td className="py-3 pr-4 font-medium text-slate-900 whitespace-nowrap">
                        {c.limit}
                      </td>
                      <td className="py-3 font-medium text-slate-900 whitespace-nowrap">
                        {c.deductible}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
