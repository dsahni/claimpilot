import { ClaimDetails } from './StepDetails';
import { CAR_SECTIONS } from './CarDiagram';
import Card from '@/components/ui/Card';

interface StepReviewProps {
  details: ClaimDetails;
  selectedSections: string[];
  sectionPhotos: Record<string, string[]>;
}

export default function StepReview({ details, selectedSections, sectionPhotos }: StepReviewProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-900">Review & Submit</h2>
      <p className="text-sm text-slate-500">
        Review your claim details before submitting.
      </p>

      <Card className="p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Vehicle Information</h3>
          <p className="text-sm text-slate-700">
            {details.vehicleYear} {details.vehicleMake} {details.vehicleModel}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Incident Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Date</p>
              <p className="text-slate-700">
                {details.incidentDate
                  ? new Date(details.incidentDate + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Location</p>
              <p className="text-slate-700">{details.location || '—'}</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-slate-500 text-sm">Description</p>
            <p className="text-sm text-slate-700 mt-1">{details.description || '—'}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Damaged Areas ({selectedSections.length})
          </h3>
          <div className="space-y-3">
            {selectedSections.map(sectionId => {
              const section = CAR_SECTIONS.find(s => s.id === sectionId);
              const photos = sectionPhotos[sectionId] || [];
              if (!section) return null;
              return (
                <div key={sectionId} className="flex items-start gap-3">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">{section.label}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`${section.label} ${i + 1}`}
                        className="w-12 h-12 object-cover rounded-md border border-slate-200"
                      />
                    ))}
                    {photos.length === 0 && (
                      <span className="text-xs text-slate-400 italic">No photos</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Policy Information</h3>
          <p className="text-sm text-slate-700">Premium Tier — Full Coverage</p>
          <p className="text-xs text-slate-500 mt-1">$500 deductible &middot; 90% coverage after deductible</p>
        </div>
      </Card>
    </div>
  );
}
