import { Claim } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface AuthorizationLetterProps {
  claim: Claim;
}

export default function AuthorizationLetter({ claim }: AuthorizationLetterProps) {
  if (!claim.assessment) return null;

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Authorization Letter</h3>
        <Button variant="secondary" size="sm" onClick={() => alert('PDF download would be triggered here')}>
          Download PDF
        </Button>
      </div>

      <div className="bg-slate-50 rounded-lg p-6 text-sm text-slate-700 space-y-4 border border-slate-200">
        <div className="text-right text-xs text-slate-500">{today}</div>

        <p>
          <strong>ClaimPilot Insurance Services</strong><br />
          Claim Authorization Department
        </p>

        <p>Dear {claim.policyholderName},</p>

        <p>
          This letter serves as official authorization for repairs related to your insurance claim{' '}
          <strong>{claim.id}</strong>, filed on{' '}
          {new Date(claim.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
          .
        </p>

        <p>
          <strong>Vehicle:</strong> {claim.vehicle.year} {claim.vehicle.make} {claim.vehicle.model}<br />
          <strong>Policy Number:</strong> {claim.policyNumber}<br />
          <strong>Approved Amount:</strong> ${claim.assessment.coveredAmount.toLocaleString()}<br />
          <strong>Deductible:</strong> ${claim.assessment.policyTierAdjustment.deductible.toLocaleString()}
        </p>

        <p>
          You are authorized to proceed with repairs at any of the recommended repair facilities listed below.
          Please present this authorization letter and your policy information at the time of service.
        </p>

        <p>
          If you have any questions, please contact our claims department at{' '}
          <strong>1-800-CLAIM-AI</strong> or <strong>claims@claimpilot.com</strong>.
        </p>

        <p className="pt-4">
          Sincerely,<br />
          <strong>ClaimPilot Claims Department</strong><br />
          <span className="text-xs text-slate-500">AI-Assisted Authorization</span>
        </p>
      </div>
    </Card>
  );
}
