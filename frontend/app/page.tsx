"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, LayoutGrid, Zap, Shield, Database, CheckCircle2, ChevronRight, Play, Github, Globe, Terminal, Activity, MousePointer2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Gradient Backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-500">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-[-0.03em] text-slate-900">Agentic<span className="text-blue-600">SaaS</span></span>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="#architecture" className="hover:text-blue-600 transition-colors">Architecture</Link>
          <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#security" className="hover:text-blue-600 transition-colors">Security</Link>
          <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-blue-200 active:scale-95"
          >
            Start Building
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8">
        {/* HERO SECTION */}
        <section className="pt-24 pb-32 grid lg:grid-cols-2 gap-20 items-center">
          <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-slate-100 text-blue-600 text-[11px] font-black tracking-[0.15em] uppercase mb-10 shadow-sm transition-all hover:border-blue-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              V3 Intelligence Distribution
            </div>

            <h1 className="text-6xl md:text-[88px] font-[900] text-slate-900 leading-[0.85] tracking-[-0.05em] mb-10">
              Compute <br />
              With <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600">
                Signals.
              </span>
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed mb-12 font-medium max-w-lg">
              The first industrial-grade AI orchestrator. Pipe Gemini intelligence into high-concurrency Go workers with sub-latency real-time signaling.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all duration-500 shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 group"
              >
                Launch App <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#"
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 rounded-[2rem] font-bold text-sm border border-slate-100 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <Play size={14} className="fill-blue-600 text-blue-600 translate-x-0.5" />
                </div>
                See How It Works
              </Link>
            </div>
          </div>

          {/* Visual Performance Component */}
          <div className="hidden lg:block animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
            <div className="relative p-10 bg-white border border-slate-100 rounded-[4rem] shadow-[0_50px_120px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 rounded-full blur-[100px]" />

              <div className="relative space-y-6">
                {/* Live Telemetry Card */}
                <div className="p-6 bg-slate-950 rounded-[2.5rem] text-white shadow-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Activity className="text-emerald-400" size={18} />
                      <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Live Telemetry</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-800" />)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Gemini Signal", val: "28ms", color: "bg-blue-500" },
                      { label: "Redis Latency", val: "4ms", color: "bg-indigo-500" },
                      { label: "Go Worker Load", val: "12%", color: "bg-emerald-500" }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold text-slate-400">
                          <span>{stat.label}</span>
                          <span>{stat.val}</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${stat.color} rounded-full transition-all duration-1000`} style={{ width: i === 0 ? '78%' : i === 1 ? '12%' : '45%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent Workflow Card */}
                <div className="p-8 bg-blue-600 rounded-[2.5rem] shadow-xl text-white relative group">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Agentic Engine</p>
                      <h4 className="text-xl font-black">LangGraph Workflow</h4>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {['Planning Node', 'Research Hub', 'UI Stylist'].map((node, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/10 border border-white/5 rounded-2xl group-hover:translate-x-2 transition-transform duration-500">
                        <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                        <span className="text-[12px] font-black uppercase tracking-wider">{node}</span>
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-[10px] font-medium text-blue-200 uppercase">Status</span>
                          <div className="px-2 py-0.5 bg-blue-500 rounded-md text-[9px] font-black">ACTIVE</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY LOGO CLOUD */}
        <section className="py-20 flex flex-col items-center">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-12">Universal Integration Layer</p>
          <div className="flex flex-wrap items-center justify-center gap-16 md:gap-24 grayscale opacity-30 invert hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-3 font-black text-xl"><Globe size={24} /> NEXT.JS</div>
            <div className="flex items-center gap-3 font-black text-xl"><Terminal size={24} /> GO-FIBER</div>
            <div className="flex items-center gap-3 font-black text-xl"><Database size={24} /> REDIS</div>
            <div className="flex items-center gap-3 font-black text-xl"><Terminal size={24} /> PYTHON</div>
          </div>
        </section>

        {/* ARCHITECTURE SECTION */}
        <section id="architecture" className="py-32 border-t border-slate-100">
          <div className="grid lg:grid-cols-2 gap-20 items-center text-left">
            <div className="relative">
              <h2 className="text-5xl font-black text-slate-900 tracking-[-0.03em] mb-10 leading-[1.1]">
                Industrial Architecture. <br />
                <span className="text-blue-600">Zero Bottlenecks.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { icon: <Zap size={20} />, title: "Distributed Task Handlers", desc: "Built on Go workers with atomic Redis operations for guaranteed transaction support." },
                  { icon: <Activity size={20} />, title: "Real-Time Telemetry", desc: "Agents stream their reasoning steps back through high-frequency signals, reducing perceived latency." },
                  { icon: <Shield size={20} />, title: "Stateless Security", desc: "Enterprise auth with JWT and secure OAuth hooks for Google and GitHub providers." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-100 rounded-[4rem] rotate-2 transition-transform group-hover:rotate-0" />
              <div className="relative p-12 bg-white border border-slate-100 rounded-[3.5rem] shadow-xl">
                <pre className="p-8 bg-slate-50 rounded-3xl text-[12px] font-mono text-slate-600 overflow-x-hidden leading-relaxed">
                  <span className="text-pink-500">func</span> <span className="text-blue-600">HandleWorkflowTask</span>(ctx <span className="text-blue-600">Context</span>) &#123; <br />
                  &nbsp;&nbsp;<span className="text-slate-400">// Initiate Agent reasoning across nodes</span> <br />
                  &nbsp;&nbsp;<span className="text-blue-600">agent</span> := <span className="text-blue-600">NewLangGraphEngine</span>() <br />
                  &nbsp;&nbsp;<span className="text-blue-600">result</span>, <span className="text-blue-600">err</span> := <span className="text-blue-600">agent</span>.Run(task) <br />
                  <br />
                  &nbsp;&nbsp;<span className="text-pink-500">return</span> <span className="text-blue-600">result</span>.StreamToClient() <br />
                  &#125;
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* DUAL AUTH SECTION */}
        <section id="security" className="py-24 bg-slate-900 rounded-[4rem] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="relative max-w-4xl mx-auto text-center px-8 text-left md:text-center shrink-0">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl mb-10">
              <Shield size={16} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Developer Cloud Identity</span>
            </div>
            <h2 className="text-5xl font-black mb-8 leading-[1]">Universal Onboarding.</h2>
            <p className="text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto">Skip the password resets. Integrated with Enterprise-grade IDPs for instant, secure access.</p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 select-none pointer-events-none">
              <div className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl">
                <Github size={20} />
                <span className="font-black tracking-tight">GitHub Identity</span>
              </div>
              <div className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl">
                <MousePointer2 size={20} className="text-blue-400" />
                <span className="font-black tracking-tight">Google OAuth 2.0</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-32">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Scale When You're Ready.</h2>
            <ul className="flex justify-center gap-10 text-sm font-bold text-slate-500">
              <li className="flex items-center gap-2"><CheckCircle2 className="text-blue-600" size={16} /> Free Dashboard</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="text-blue-600" size={16} /> Real-time Nodes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="text-blue-600" size={16} /> Secure Secrets</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="p-12 bg-white border border-slate-100 rounded-[3rem] transition-all hover:border-blue-200">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">Free Tier</h4>
              <p className="text-5xl font-black text-slate-900 mb-8">$0<span className="text-lg text-slate-400 font-bold tracking-normal uppercase"> / mo</span></p>
              <ul className="space-y-4 mb-12">
                {['Single Workflow', 'Email Support', 'Basic Telemetry', 'Shared Worker Hub'].map((f, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-medium text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center py-5 bg-slate-50 text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-colors">Start Free</Link>
            </div>

            <div className="p-12 bg-slate-900 border border-white/5 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-400 mb-6">Pro Plan</h4>
              <p className="text-5xl font-black text-white mb-8">$29<span className="text-lg text-slate-400 font-bold tracking-normal uppercase"> / mo</span></p>
              <ul className="space-y-4 mb-12 relative z-10">
                {['Unlimited Flows', 'GitHub Auth Sync', 'Sub-Latency Signals', 'Private Worker Pool'].map((f, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-medium text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-900/40 transition-all active:scale-95">Upgrade Pro</Link>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24">
          <div className="relative p-16 sm:p-24 bg-blue-600 rounded-[4rem] text-center overflow-hidden">
            <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px]" />

            <div className="relative max-w-2xl mx-auto">
              <Sparkles className="text-white mx-auto mb-10" size={48} />
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-[-0.03em] mb-10">Orchestrate the future.</h2>
              <p className="text-xl text-blue-100 font-medium mb-12">The most performant way to build multi-agent AI ecosystems is here.</p>

              <Link
                href="/signup"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
              >
                Start Your Journey <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          <div className="flex items-center gap-3 grayscale opacity-60">
            <Sparkles size={16} /> <span>Agent Orchestrator 2026</span>
          </div>
          <div className="flex items-center gap-10">
            <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Architecture</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}