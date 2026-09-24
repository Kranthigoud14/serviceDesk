import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../store/toastStore';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Bell, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();
  const navigate = useNavigate();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isClickable = !!toast.relatedTicket;

        return (
          <div
            key={toast.id}
            onClick={() => {
              if (toast.relatedTicket) {
                navigate('/tickets/' + toast.relatedTicket);
                removeToast(toast.id);
              }
            }}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 ${isClickable ? "cursor-pointer" : ""} ${toast.type === "success" ? "bg-emerald-950/90 border-emerald-500/30" : toast.type === "error" ? "bg-rose-950/90 border-rose-500/30" : toast.type === "warning" ? "bg-amber-950/90 border-amber-500/30" : toast.type === "realtime" ? "bg-cyan-950/90 border-cyan-500/40" : "bg-slate-900/90 border-slate-700/80"}`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'realtime' && <Bell className="w-5 h-5 text-cyan-400 animate-bounce" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100">
                  {toast.title}
                </h4>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToast(toast.id);
                  }}
                  className="text-slate-400 hover:text-slate-200 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs mt-1 text-slate-300 line-clamp-2">{toast.message}</p>
              {isClickable && (
                <span className="inline-block text-[11px] font-medium text-cyan-400 hover:underline mt-1.5">
                  View Ticket →
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

