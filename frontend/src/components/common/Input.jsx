import React from 'react';

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full rounded-lg bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 transition-colors ${Icon ? "pl-9" : "pl-3.5"} pr-3.5 py-2.5 ${error ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"} ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-rose-400 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}

