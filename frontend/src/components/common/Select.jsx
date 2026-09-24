import React from 'react';

export default function Select({
  label,
  error,
  options = [],
  className = '',
  id,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full rounded-lg bg-slate-900/90 border text-slate-100 text-sm px-3.5 py-2.5 appearance-none focus:outline-none focus:ring-1 transition-colors cursor-pointer ${error ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20"} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
}

