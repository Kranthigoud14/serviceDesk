import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}) {
  const variants = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    primary: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-blue-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    violet: 'bg-violet-400',
    cyan: 'bg-cyan-400',
  };

  const sizes = {
    xs: 'text-[11px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

