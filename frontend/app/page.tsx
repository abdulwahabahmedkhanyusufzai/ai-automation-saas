"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, LayoutGrid, Zap, Shield, Database, CheckCircle2, ChevronRight, Play } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Gradient Backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-500">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-[-0.03em] text-slate-900">Agentic<span className="text-blue-600">SaaS</span></span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-slate-500">
          <Link href="#features" className="hover:text-blue-600 transition-colors">Architecture</Link>
          <Link href="#workflow" className="hover:text-blue-600 transition-colors">Workflow</Link>
          <Link href="/docs" className="hover:text-blue-600 transition-colors">Docs</Link>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors pr-2">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-blue-200 active:scale-95"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8">
        {/* HERO SECTION */}
        <section className="pt-24 pb-32 grid lg:grid-cols-2 gap-20 items-center">
          <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-slate-100 text-blue-600 text-[11px] font-black tracking-[0.15em] uppercase mb-10 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              Next-Gen Multi-Agent Engine
            </div>

            <h1 className="text-6xl md:text-[84px] font-[900] text-slate-900 leading-[0.9] tracking-[-0.05em] mb-10">
              Distributed <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                Agentic Logic.
              </span>
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed mb-12 font-medium">
              Transform high-latency AI requests into real-time, orchestrated microservices. Powered by Go, Redis, and LangGraph for industrial-grade reliability.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all duration-500 shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 group"
              >
                Launch Dashboard <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#"
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 rounded-[2rem] font-bold text-sm border border-slate-100 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-200"
              >
                <Play size={16} className="fill-blue-600 text-blue-600" /> Watch Demo
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-10 grayscale opacity-40">
              <Database size={24} />
              <Zap size={24} />
              <Shield size={24} />
              <LayoutGrid size={24} />
            </div>
          </div>

          {/* Visual Workflow Diagram Component */}
          <div className="hidden lg:block animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
            <div className="relative p-10 bg-white border border-slate-100 rounded-[3.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl" />

              <div className="relative space-y-6">
                {/* Floating Card: Orchestrator */}
                <div className="flex items-center gap-6 p-6 bg-slate-50/50 border border-slate-100 rounded-3xl animate-bounce-slow">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-400">Layer 01</h4>
                    <p className="font-bold text-slate-800">Go Orchestrator</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse delay-75" />
                    <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse delay-150" />
                  </div>
                </div>

                <div className="flex justify-center py-2 h-10">
                  <div className="w-0.5 bg-gradient-to-b from-blue-500 to-transparent rounded-full" />
                </div>

                {/* Floating Card: Agentic Workflow */}
                <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 relative group overflow-hidden">
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative">
                    <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-blue-200/80 mb-4">Real-Time Core</h4>
                    <p className="text-2xl font-black tracking-tight mb-8">LangGraph Engine</p>

                    <div className="grid grid-cols-3 gap-3">
                      {['Planning', 'Researching', 'Styling'].map((p, i) => (
                        <div key={i} className="px-3 py-2 bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center py-2 h-10">
                  <div className="w-0.5 bg-gradient-to-b from-blue-200/50 to-emerald-500 rounded-full" />
                </div>

                {/* Floating Card: Output */}
                <div className="flex items-center gap-6 p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] uppercase tracking-widest text-emerald-600/60">Final Resolution</h4>
                    <p className="font-bold text-slate-800">Structured Intelligence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE SECTION */}
        <section id="features" className="py-24 border-t border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Built for Industrial Scale.</h2>
            <p className="text-lg text-slate-500 font-medium">Polyglot architecture that leverages high-speed Go concurrency and native Python AI ecosystems.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Zap className="text-blue-600" />,
                title: "Async Redis Workers",
                desc: "Never time out a client. Offload heavy reasoning tasks to our distributed Go worker pool.",
                color: "bg-blue-50"
              },
              {
                icon: <LayoutGrid className="text-indigo-600" />,
                title: "LangGraph Orchestration",
                desc: "Complex multi-step agent logic with unified state management and error recovery.",
                color: "bg-indigo-50"
              },
              {
                icon: <Shield className="text-emerald-600" />,
                title: "Hardware isolation",
                desc: "Secure stateless architecture with JWT protection and PostgreSQL audit trails.",
                color: "bg-emerald-50"
              }
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-blue-200 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] transition-all duration-500">
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-[800] text-slate-900 mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-[15px]">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32">
          <div className="relative p-16 sm:p-24 bg-slate-900 rounded-[4rem] text-center overflow-hidden">
            <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[120px]" />

            <div className="relative max-w-2xl mx-auto">
              <Sparkles className="text-blue-400 mx-auto mb-10" size={48} />
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-[-0.03em] mb-10">Ready to orchestrate?</h2>
              <p className="text-xl text-slate-400 font-medium mb-12">Join developers deploying reliable, multi-step AI agents with professional observability.</p>

              <Link
                href="/signup"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
              >
                Create Your Free Account <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          <div className="flex items-center gap-3 grayscale opacity-60">
            <Sparkles size={16} /> <span>Agent Orchestrator 2026</span>
          </div>
          <div className="flex items-center gap-12">
            <a href="#" className="hover:text-blue-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-blue-600 transition-colors">GitHub</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
          </div>
        </footer>
      </main>

      <style jsx global>{`
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