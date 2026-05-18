'use client';

export interface CarSection {
  id: string;
  label: string;
  x: number;
  y: number;
}

export const CAR_SECTIONS: CarSection[] = [
  { id: 'front-bumper', label: 'Front Bumper', x: 50, y: 6 },
  { id: 'left-front', label: 'Left Front', x: 19, y: 14 },
  { id: 'right-front', label: 'Right Front', x: 81, y: 14 },
  { id: 'hood', label: 'Hood', x: 50, y: 24 },
  { id: 'left-fender', label: 'Left Fender', x: 11, y: 34 },
  { id: 'right-fender', label: 'Right Fender', x: 89, y: 34 },
  { id: 'windshield', label: 'Windshield', x: 50, y: 38 },
  { id: 'left-doors', label: 'Left Doors', x: 8, y: 52 },
  { id: 'roof', label: 'Roof', x: 50, y: 52 },
  { id: 'right-doors', label: 'Right Doors', x: 92, y: 52 },
  { id: 'left-rear', label: 'Left Rear', x: 11, y: 70 },
  { id: 'right-rear', label: 'Right Rear', x: 89, y: 70 },
  { id: 'trunk', label: 'Trunk', x: 50, y: 76 },
  { id: 'rear-bumper', label: 'Rear Bumper', x: 50, y: 94 },
];

interface CarDiagramProps {
  selectedSections: string[];
  onToggleSection: (sectionId: string) => void;
}

export default function CarDiagram({ selectedSections, onToggleSection }: CarDiagramProps) {
  return (
    <div className="relative w-full max-w-[280px] mx-auto" style={{ aspectRatio: '280/480' }}>
      {/* Car SVG */}
      <svg
        viewBox="0 0 200 340"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Car body shadow */}
        <path
          d="M 68,24 C 68,10 132,10 132,24 L 146,52 L 156,85 L 158,115 L 159,160 L 159,180 L 158,225 L 156,255 L 146,288 L 132,316 C 132,330 68,330 68,316 L 54,288 L 44,255 L 42,225 L 41,180 L 41,160 L 42,115 L 44,85 L 54,52 Z"
          fill="#e2e8f0"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        {/* Windshield */}
        <path
          d="M 62,100 L 72,85 L 128,85 L 138,100 L 140,120 L 60,120 Z"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        {/* Rear window */}
        <path
          d="M 62,240 L 60,220 L 140,220 L 138,240 L 128,255 L 72,255 Z"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        {/* Center line (hood to trunk) */}
        <line x1="100" y1="30" x2="100" y2="85" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4 3" />
        <line x1="100" y1="120" x2="100" y2="220" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4 3" />
        <line x1="100" y1="255" x2="100" y2="310" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4 3" />
        {/* Side mirrors */}
        <ellipse cx="36" cy="115" rx="6" ry="4" fill="#cbd5e1" />
        <ellipse cx="164" cy="115" rx="6" ry="4" fill="#cbd5e1" />
        {/* Headlights */}
        <rect x="72" y="26" width="16" height="6" rx="3" fill="#fef9c3" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="112" y="26" width="16" height="6" rx="3" fill="#fef9c3" stroke="#cbd5e1" strokeWidth="0.5" />
        {/* Taillights */}
        <rect x="72" y="308" width="16" height="6" rx="3" fill="#fecaca" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="112" y="308" width="16" height="6" rx="3" fill="#fecaca" stroke="#cbd5e1" strokeWidth="0.5" />
      </svg>

      {/* Hotspot buttons overlaid */}
      {CAR_SECTIONS.map(section => {
        const isActive = selectedSections.includes(section.id);
        return (
          <button
            key={section.id}
            onClick={() => onToggleSection(section.id)}
            className="absolute flex items-center justify-center group"
            style={{
              left: `${section.x}%`,
              top: `${section.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            title={section.label}
            type="button"
          >
            {/* Pulse rings for active state */}
            {isActive && (
              <>
                <span className="absolute w-10 h-10 rounded-full bg-rose-400/20 animate-ping" />
                <span className="absolute w-8 h-8 rounded-full bg-rose-400/30" />
              </>
            )}
            {/* Button circle */}
            <span
              className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all duration-200 ${
                isActive
                  ? 'bg-rose-500 text-white shadow-rose-300/50'
                  : 'bg-white text-slate-400 hover:text-slate-600 hover:shadow-lg border border-slate-200'
              }`}
            >
              {isActive ? '−' : '+'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
