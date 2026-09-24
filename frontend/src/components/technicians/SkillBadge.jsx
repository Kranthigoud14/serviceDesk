import React from 'react';
import { ShieldCheck, Clock } from 'lucide-react';

export default function SkillBadge({ skill, isVerified = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${isVerified ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}`}
    >
      {isVerified ? (
        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
      ) : (
        <Clock className="w-3 h-3 text-amber-400 shrink-0" />
      )}
      <span>{skill}</span>
    </span>
  );
}

