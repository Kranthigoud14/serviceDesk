import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Clock,
  CheckCircle2,
  ArrowRight,
  Boxes,
  Users,
  Activity,
  Zap,
  Lock,
  BookOpen,
  BarChart3,
  KeyRound,
  FileCheck,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import Button from '../../components/common/Button';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const handleCta = () => {
    if (isAuthenticated) {
      if (user?.role === 'System Admin') navigate('/admin/dashboard');
      else if (user?.role === 'IT Manager') navigate('/manager/dashboard');
      else if (user?.role === 'Technician') navigate('/technician/dashboard');
      else if (user?.role === 'Asset Manager') navigate('/asset-manager/dashboard');
      else navigate('/employee/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans overflow-x-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">
                ServiceDesk<span className="text-cyan-400 font-extrabold">PRO</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Workforce Intel
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Capabilities</a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">Verified Workflow</a>
            <a href="#workforce" className="hover:text-cyan-400 transition-colors">Workforce Intel</a>
            <a href="#ai" className="hover:text-cyan-400 transition-colors">AI Diagnostics</a>
            <a href="#security" className="hover:text-cyan-400 transition-colors">Security & RBAC</a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button variant="primary" size="sm" onClick={handleCta} icon={ArrowRight}>
                Open Dashboard ({user?.role})
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-36 overflow-hidden">
        {/* Glow Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-purple-600/20 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Generation Enterprise ITSM SaaS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Workforce Intelligence v2</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Verified IT Service Management with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Workforce Intelligence
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Eliminate resolution ambiguity and technician bottlenecks. ServiceDesk Pro unifies skill-verified workforce dispatch, photo-proof resolution, employee OTP service verification, SLA automation, and AI diagnostic insights in a single enterprise platform.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={handleCta}
              className="w-full sm:w-auto px-8 shadow-xl shadow-cyan-500/20"
            >
              {isAuthenticated ? 'Go to Workspace' : 'Launch Platform Demo'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={BookOpen}
              onClick={() => navigate('/knowledge-base')}
              className="w-full sm:w-auto px-6"
            >
              Explore Knowledge Portal
            </Button>
          </div>

          {/* Telemetry Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Zero Ambiguity</span>
              </div>
              <p className="text-xl font-bold text-slate-100 font-mono">OTP Verified</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Mandatory 6-digit confirmation</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Workforce v2</span>
              </div>
              <p className="text-xl font-bold text-slate-100 font-mono">Real-time Intel</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Skills, availability & capacity</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">SLA Engine</span>
              </div>
              <p className="text-xl font-bold text-slate-100 font-mono">Active Guard</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated breach notifications</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-2 text-violet-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">AI Powered</span>
              </div>
              <p className="text-xl font-bold text-slate-100 font-mono">Smart Triage</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Auto-categorization & fix steps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Lifecycle Workflow */}
      <section id="workflow" className="py-20 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">End-to-End Integrity</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              The 6-Stage Verified Resolution Lifecycle
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Unlike legacy helpdesks where tickets are closed without verification, ServiceDesk Pro ensures employee validation and quality proof at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Ticket Created', desc: 'AI auto-suggests category & SLA target.', icon: Activity, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30' },
              { step: '02', title: 'Smart Dispatch', desc: 'Dispatched via verified skills & capacity.', icon: Cpu, color: 'text-blue-400 border-blue-500/30 bg-blue-950/30' },
              { step: '03', title: 'Work In Progress', desc: 'Technician updates live state with SLA countdown.', icon: Clock, color: 'text-amber-400 border-amber-500/30 bg-amber-950/30' },
              { step: '04', title: 'Proof & Resolve', desc: 'Technician submits resolution notes & photo proof.', icon: FileCheck, color: 'text-violet-400 border-violet-500/30 bg-violet-950/30' },
              { step: '05', title: 'OTP Verification', desc: 'Employee confirms physical fix via 6-digit OTP.', icon: KeyRound, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30' },
              { step: '06', title: 'Rating & Close', desc: 'Employee rates service. Feedback updates tech profile.', icon: ShieldCheck, color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/30' }
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.step} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">{st.step}</span>
                    <div className={`p-2 rounded-lg border ${st.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{st.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workforce Intelligence Section */}
      <section id="workforce" className="py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Workforce Intelligence v2
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
                Operations Command Center with Verified Skills & Capacity
              </h2>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                Dispatching tickets blindly leads to breached SLAs and overwhelmed technicians. ServiceDesk Pro evaluates 4 multidimensional metrics before assignment:
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  { title: 'Verified Skill Match', desc: 'IT Managers officially verify technician skills before tickets can be routed.' },
                  { title: 'Real-Time Capacity Balancing', desc: 'Hard limits on active tickets ensure no technician is overloaded beyond threshold.' },
                  { title: 'Live Availability States', desc: 'Instant status toggle (Available, Busy, Offline) prevents missed dispatches.' },
                  { title: 'Historical Customer Rating Index', desc: 'Empirical service satisfaction metrics guide critical enterprise dispatch.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Workforce Card */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-200">Workforce Dispatch Engine</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  Optimal Match 96%
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">David Miller</h4>
                    <p className="text-[11px] text-slate-400 font-mono">Senior Network & Security Engineer</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                    Available
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Active Workload</span>
                    <span className="font-mono text-slate-200 font-bold">2 / 5 (40%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Network (Verified)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Hardware (Verified)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                    ? 4.9 Rating
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Diagnostic Assistance */}
      <section id="ai" className="py-20 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Intelligent Service Desk
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              AI Diagnostic Insights & Automated Triage
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Empower employees with instantaneous classification and guide technicians with verified troubleshooting playbooks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">Ticket Summarization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transforms verbose or confusing user problem reports into concise operational statements with identified root symptoms and affected assets.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">Smart Auto-Classification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically detects category (Hardware, Network, Access, Software, Email) and evaluates severity to set accurate SLA targets.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">Resolution Playbooks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recommends step-by-step troubleshooting procedures, identifies common root causes, and provides safety checklists prior to resolution submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Workspaces */}
      <section id="security" className="py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Role-Based Operations</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Designed for Four Core Business Roles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'IT Manager', desc: 'Manage tickets, technicians, SLA, workforce and operations.', icon: Users, color: 'text-blue-400' },
              { role: 'Technician', desc: 'Handle assigned tickets, skills, availability and service resolution.', icon: Cpu, color: 'text-violet-400' },
              { role: 'Employee', desc: 'Create and track IT service requests and verify completed services.', icon: ShieldCheck, color: 'text-emerald-400' },
              { role: 'Asset Manager', desc: 'Manage IT assets, assignments, warranty and asset-related tickets.', icon: Boxes, color: 'text-amber-400' }
            ].map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                  <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 w-fit ${r.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-100">{r.role}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-slate-900/40 to-slate-950 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Ready to experience Verified IT Service Management?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Sign in to your role dashboard or create a new account to test intelligent dispatch and verified service resolution.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="primary" icon={ArrowRight} onClick={handleCta}>
              Enter ServiceDesk Pro
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
              Account Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">ServiceDesk Pro</span>
            <span>? Verified IT Service Management with Workforce Intelligence</span>
          </div>
          <p>? {new Date().getFullYear()} ServiceDesk Pro SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
