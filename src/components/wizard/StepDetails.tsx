'use client';

import Input from '@/components/ui/Input';

interface ClaimDetails {
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  incidentDate: string;
  description: string;
  location: string;
}

interface StepDetailsProps {
  data: ClaimDetails;
  onChange: (data: ClaimDetails) => void;
}

const policyVehicles = [
  { year: 2025, make: 'Honda', model: 'Civic LX', color: 'Black', vin: '2HGFE2F56RH408421' },
  { year: 2024, make: 'Tesla', model: 'Model 3', color: 'Silver', vin: '5YJ3E1EA0RF123456' },
];

export default function StepDetails({ data, onChange }: StepDetailsProps) {
  const selectedKey = `${data.vehicleYear}-${data.vehicleMake}-${data.vehicleModel}`;

  const selectVehicle = (v: typeof policyVehicles[0]) => {
    onChange({
      ...data,
      vehicleYear: String(v.year),
      vehicleMake: v.make,
      vehicleModel: v.model,
    });
  };

  const update = (field: keyof ClaimDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-900">Vehicle & Incident Details</h2>
      <p className="text-sm text-slate-500">Select the vehicle involved and describe the incident.</p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle on Policy</label>
        <div className="grid grid-cols-1 gap-3">
          {policyVehicles.map((v) => {
            const key = `${v.year}-${v.make}-${v.model}`;
            const isSelected = key === selectedKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectVehicle(v)}
                className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {v.year} {v.make} {v.model}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {v.color} &middot; VIN: {v.vin}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Input
        label="Incident Date"
        type="date"
        value={data.incidentDate}
        onChange={e => update('incidentDate', e.target.value)}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Incident Description
        </label>
        <textarea
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors min-h-[100px] resize-y"
          placeholder="Describe what happened..."
          value={data.description}
          onChange={e => update('description', e.target.value)}
        />
      </div>

      <Input
        label="Location / Address"
        placeholder="123 Main St, San Francisco, CA"
        value={data.location}
        onChange={e => update('location', e.target.value)}
      />
    </div>
  );
}

export type { ClaimDetails };
