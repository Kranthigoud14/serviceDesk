import React from 'react';
import Button from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading this data.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-rose-900/40 bg-rose-950/20 my-4">
      <div className="p-3.5 rounded-2xl bg-rose-900/30 border border-rose-800/40 text-rose-400 mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-rose-200">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mt-1 mb-5">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

