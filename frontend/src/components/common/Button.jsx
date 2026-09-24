import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  };

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 border border-blue-500/30 focus:ring-blue-500 active:scale-[0.98]',
    secondary: 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 hover:border-slate-600 focus:ring-slate-500 active:scale-[0.98]',
    danger: 'bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-500/30 focus:ring-rose-500 active:scale-[0.98]',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/30 focus:ring-emerald-500 active:scale-[0.98]',
    violet: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 border border-violet-500/30 focus:ring-violet-500 active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700 focus:ring-slate-500',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 focus:ring-slate-500 border border-transparent',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

