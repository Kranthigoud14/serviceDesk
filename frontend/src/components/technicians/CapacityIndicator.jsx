import React from 'react';

export default function CapacityIndicator({ active = 0, max = 5, size = 'md' }) {
  const percentage = Math.min(Math.round((active / Math.max(max, 1)) * 100), 100);
  const isFull = active >= max;
  const isHigh = percentage >= 80;

  const color = isFull
    ? 'bg-rose-500 shadow-rose-500/30'
    : isHigh
    ? 'bg-amber-500 shadow-amber-500/30'
    : 'bg-cyan-500 shadow-cyan-500/30';

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">Workload Capacity</span>
        <span className="font-mono font-semibold text-slate-200">
          {active} / {max} active ({percentage}%)
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-slate-700/60">
        <div
          className={`h-full rounded-full transition-all duration-500 shadow-sm ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

