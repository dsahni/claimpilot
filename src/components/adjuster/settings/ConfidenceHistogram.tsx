'use client';

const SVG_WIDTH = 400;
const SVG_HEIGHT = 100;
const BAR_AREA_LEFT = 20;
const BAR_AREA_RIGHT = 10;
const BAR_AREA_TOP = 8;
const BAR_AREA_BOTTOM = 24;
const PLOT_W = SVG_WIDTH - BAR_AREA_LEFT - BAR_AREA_RIGHT;
const PLOT_H = SVG_HEIGHT - BAR_AREA_TOP - BAR_AREA_BOTTOM;

interface ConfidenceHistogramProps {
  scores: number[];
  approveThreshold: number;
  denyFloor: number;
}

function barColor(bucketIndex: number, denyFloor: number, approveThreshold: number): string {
  const mid = bucketIndex * 10 + 5;
  if (mid < denyFloor) return '#f43f5e';
  if (mid >= approveThreshold) return '#10b981';
  return '#f59e0b';
}

export default function ConfidenceHistogram({ scores, approveThreshold, denyFloor }: ConfidenceHistogramProps) {
  const buckets = Array(10).fill(0) as number[];
  scores.forEach(s => { buckets[Math.min(Math.floor(s / 10), 9)]++; });
  const maxCount = Math.max(...buckets, 1);

  const lineX = BAR_AREA_LEFT + (approveThreshold / 100) * PLOT_W;
  const labelX = Math.min(lineX + 3, SVG_WIDTH - BAR_AREA_RIGHT - 22);

  return (
    <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-24" aria-hidden="true">
      {/* Subtle vertical grid lines */}
      {[25, 50, 75].map(pct => {
        const x = BAR_AREA_LEFT + (pct / 100) * PLOT_W;
        return (
          <line key={pct} x1={x} y1={BAR_AREA_TOP} x2={x} y2={BAR_AREA_TOP + PLOT_H}
            stroke="#f1f5f9" strokeWidth={1} />
        );
      })}

      {/* Bars */}
      {buckets.map((count, i) => {
        const barH = count === 0 ? 0 : Math.max(4, (count / maxCount) * PLOT_H);
        return (
          <rect key={i}
            x={BAR_AREA_LEFT + (i * PLOT_W / 10) + 1}
            y={BAR_AREA_TOP + PLOT_H - barH}
            width={PLOT_W / 10 - 2}
            height={barH}
            fill={barColor(i, denyFloor, approveThreshold)}
            rx={2}
          />
        );
      })}

      {/* Approve threshold line */}
      <line x1={lineX} y1={BAR_AREA_TOP - 4} x2={lineX} y2={BAR_AREA_TOP + PLOT_H}
        stroke="#4f46e5" strokeWidth={2} strokeDasharray="4 3" />
      <text x={labelX} y={BAR_AREA_TOP + 1} fontSize={9} fill="#4f46e5" fontWeight="600"
        dominantBaseline="hanging">
        {approveThreshold}%
      </text>

      {/* X-axis labels */}
      {[0, 20, 40, 60, 80, 100].map(v => (
        <text key={v}
          x={BAR_AREA_LEFT + (v / 100) * PLOT_W}
          y={SVG_HEIGHT - 4}
          fontSize={8} fill="#94a3b8" textAnchor="middle">
          {v}
        </text>
      ))}
    </svg>
  );
}
