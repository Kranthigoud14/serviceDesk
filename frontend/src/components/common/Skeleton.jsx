import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-800/60 ${className}`}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3 w-full">
      <div className="h-10 bg-slate-800/40 rounded-lg animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-slate-900/40 border border-slate-800/60 rounded-lg">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-5 bg-slate-800/50 rounded animate-pulse"
              style={{ width: `${100 / cols}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-3">
      <div className="flex justify-between items-center">
        <div className="w-24 h-4 bg-slate-800/60 rounded animate-pulse" />
        <div className="w-16 h-4 bg-slate-800/60 rounded animate-pulse" />
      </div>
      <div className="w-3/4 h-6 bg-slate-800/80 rounded animate-pulse" />
      <div className="w-full h-4 bg-slate-800/40 rounded animate-pulse" />
      <div className="pt-3 flex gap-2">
        <div className="w-20 h-6 bg-slate-800/50 rounded-full animate-pulse" />
        <div className="w-20 h-6 bg-slate-800/50 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

