interface WizardProgressProps {
  currentStep: number;
  steps: string[];
}

export default function WizardProgress({ currentStep, steps }: WizardProgressProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const isActive = i === currentStep;
        const isComplete = i < currentStep;
        return (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 transition-colors ${
                  isComplete
                    ? 'bg-indigo-600 text-white'
                    : isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isComplete ? '✓' : i + 1}
              </div>
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  isActive ? 'text-slate-900' : isComplete ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px flex-1 mx-2 ${
                  i < currentStep ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
