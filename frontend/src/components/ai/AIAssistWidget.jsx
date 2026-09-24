import React, { useState } from 'react';
import { useAiStore } from '../../store/aiStore';
import {
  Sparkles,
  Zap,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import Button from '../common/Button';

export default function AIAssistWidget({ ticket }) {
  const { summarize, suggestResolution, getInsights, loading, error } = useAiStore();
  const [activeTab, setActiveTab] = useState('summary'); // summary, resolution, insights
  const [summaryData, setSummaryData] = useState(null);
  const [resolutionData, setResolutionData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!ticket) return null;

  const handleGenerateSummary = async () => {
    const res = await summarize({
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
    });
    if (res.success) setSummaryData(res.data);
  };

  const handleGenerateResolution = async () => {
    const res = await suggestResolution({
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
    });
    if (res.success) setResolutionData(res.data);
  };

  const handleGenerateInsights = async () => {
    const res = await getInsights(ticket._id);
    if (res.success) setInsightsData(res.data);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 rounded-2xl border border-violet-800/40 bg-gradient-to-b from-violet-950/20 via-slate-900/60 to-slate-950/80 shadow-xl space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-violet-800/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              AI Diagnostic Copilot
            </h4>
            <span className="text-[10px] text-violet-300">
              Assisted triage, root-cause guidance & playbooks
            </span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30 text-[10px] font-semibold">
          AI Suggested
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
        {[
          { id: 'summary', label: 'Executive Summary', icon: Zap },
          { id: 'resolution', label: 'Troubleshooting Playbook', icon: Wrench },
          { id: 'insights', label: 'Operational Insights', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'summary' && !summaryData) handleGenerateSummary();
                if (tab.id === 'resolution' && !resolutionData) handleGenerateResolution();
                if (tab.id === 'insights' && !insightsData) handleGenerateInsights();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-8 text-center space-y-2">
          <Sparkles className="w-6 h-6 text-violet-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Analyzing ticket telemetry and symptoms...</p>
        </div>
      ) : error ? (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
          {error}
        </div>
      ) : (
        <div>
          {/* Tab 1: Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-3">
              {summaryData ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    {summaryData.summary}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Provider: {summaryData.provider}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(summaryData.summary)}
                      className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy Summary'}
                    </button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="violet" icon={Sparkles} onClick={handleGenerateSummary}>
                  Generate Ticket Summary
                </Button>
              )}
            </div>
          )}

          {/* Tab 2: Resolution Playbook */}
          {activeTab === 'resolution' && (
            <div className="space-y-3">
              {resolutionData ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider block">
                      Recommended Troubleshooting Sequence:
                    </span>
                    <ol className="space-y-1.5 list-decimal list-inside text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      {resolutionData.suggestedSteps?.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </div>

                  {resolutionData.potentialRootCauses?.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                        Potential Root Causes:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                        {resolutionData.potentialRootCauses.map((rc, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {rc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Button size="sm" variant="violet" icon={Wrench} onClick={handleGenerateResolution}>
                  Generate Troubleshooting Playbook
                </Button>
              )}
            </div>
          )}

          {/* Tab 3: Insights */}
          {activeTab === 'insights' && (
            <div className="space-y-3">
              {insightsData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Estimated MTTR</span>
                    <p className="text-sm font-bold font-mono text-cyan-400">
                      ~{insightsData.estimatedResolutionMinutes} mins
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Complexity Level</span>
                    <p className="text-sm font-bold text-violet-400">
                      {insightsData.difficultyLevel}
                    </p>
                  </div>
                  <div className="sm:col-span-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                      SLA Urgency Advisory
                    </span>
                    {insightsData.slaUrgencyNotice}
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="violet" icon={Clock} onClick={handleGenerateInsights}>
                  Analyze Operational Insights
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
