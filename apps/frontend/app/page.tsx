"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  ChefHat, 
  Utensils, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap, 
  CircleAlert, 
  LogIn, 
  ChevronRight, 
  Play, 
  Activity, 
  Plus, 
  CheckCircle2, 
  Layers, 
  Smartphone, 
  Database,
  Coffee,
  DollarSign
} from "lucide-react";

interface Table {
  id: number;
  name: string;
  seats: number;
  status: "available" | "waiting" | "cooking" | "serving" | "paying";
  orders: string[];
  total: number;
  timeElapsed: number;
}

interface KDSTicket {
  id: number;
  tableId: number;
  items: string[];
  status: "pending" | "preparing" | "ready";
  minutesAgo: number;
}

export default function BistroLandingPage() {
  // Demo State for interactive dashboard
  const [tables, setTables] = useState<Table[]>([
    { id: 1, name: "Table 1", seats: 2, status: "serving", orders: ["1x Ribeye Steak", "1x Caesar Salad", "1x Pinot Noir"], total: 84.00, timeElapsed: 24 },
    { id: 2, name: "Table 2", seats: 4, status: "waiting", orders: ["2x Grilled Salmon", "1x Truffle Fries", "2x IPA Beer"], total: 92.50, timeElapsed: 4 },
    { id: 3, name: "Table 3", seats: 2, status: "available", orders: [], total: 0.00, timeElapsed: 0 },
    { id: 4, name: "Table 4", seats: 6, status: "cooking", orders: ["1x Seafood Paella", "2x Lobster Roll", "1x Chardonnay"], total: 174.00, timeElapsed: 12 },
    { id: 5, name: "Table 5", seats: 2, status: "paying", orders: ["1x Tiramisu", "2x Espresso"], total: 22.00, timeElapsed: 48 },
    { id: 6, name: "Table 6", seats: 4, status: "available", orders: [], total: 0.00, timeElapsed: 0 }
  ]);

  const [kdsTickets, setKdsTickets] = useState<KDSTicket[]>([
    { id: 201, tableId: 4, items: ["1x Seafood Paella", "2x Lobster Roll"], status: "preparing", minutesAgo: 12 },
    { id: 202, tableId: 2, items: ["2x Grilled Salmon", "1x Truffle Fries"], status: "pending", minutesAgo: 4 }
  ]);

  const [selectedTableId, setSelectedTableId] = useState<number>(4);
  const [dinnerRushActive, setDinnerRushActive] = useState(false);
  const [analyticsSurge, setAnalyticsSurge] = useState(24);
  const [recentLog, setRecentLog] = useState<string>("BistroOS POS cluster online. Standby.");

  // Simulate dinner rush updates
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (dinnerRushActive) {
      timer = setInterval(() => {
        // Increment times
        setTables(prev => prev.map(t => t.status !== "available" ? { ...t, timeElapsed: t.timeElapsed + 1 } : t));
        setKdsTickets(prev => prev.map(tick => ({ ...tick, minutesAgo: tick.minutesAgo + 1 })));
        
        // Random event
        const rand = Math.random();
        if (rand < 0.3) {
          // Table 3 becomes occupied
          setTables(prev => {
            const next = [...prev];
            const t3 = next.find(t => t.id === 3);
            if (t3 && t3.status === "available") {
              t3.status = "waiting";
              t3.orders = ["1x Margherita Pizza", "1x Aperol Spritz"];
              t3.total = 32.00;
              t3.timeElapsed = 1;
              setRecentLog("New order placed on Table 3 -> Sent to KDS.");
              
              // Add to KDS
              setKdsTickets(kt => [...kt, {
                id: Math.floor(Math.random() * 100) + 203,
                tableId: 3,
                items: ["1x Margherita Pizza", "1x Aperol Spritz"],
                status: "pending",
                minutesAgo: 1
              }]);
            }
            return next;
          });
        } else if (rand < 0.6) {
          // Finish preparing first KDS ticket
          setKdsTickets(prev => {
            if (prev.length === 0) return prev;
            const next = [...prev];
            const preparingIndex = next.findIndex(t => t.status === "preparing");
            if (preparingIndex !== -1) {
              const ticket = next[preparingIndex];
              ticket.status = "ready";
              setRecentLog(`KDS Ticket #${ticket.id} (Table ${ticket.tableId}) is READY.`);
              
              // Update table status to serving
              setTables(ts => ts.map(t => t.id === ticket.tableId ? { ...t, status: "serving" } : t));
            }
            return next;
          });
        } else if (rand < 0.8) {
          // Table 5 finishes payment and leaves
          setTables(prev => {
            const next = [...prev];
            const t5 = next.find(t => t.id === 5);
            if (t5 && t5.status === "paying") {
              t5.status = "available";
              t5.orders = [];
              t5.total = 0.00;
              t5.timeElapsed = 0;
              setRecentLog("Table 5 has cleared payment. Table is available.");
            }
            return next;
          });
        }
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [dinnerRushActive]);

  const handleSimulateOrder = () => {
    // Manually add a rush order
    const nextTableIndex = tables.findIndex(t => t.status === "available");
    if (nextTableIndex !== -1) {
      setTables(prev => {
        const next = [...prev];
        const t = next[nextTableIndex];
        t.status = "waiting";
        t.orders = ["1x Chef's Ribeye Special", "1x Bordeaux Red Wine"];
        t.total = 78.00;
        t.timeElapsed = 1;
        
        // Add to KDS
        const ticketId = Math.floor(Math.random() * 100) + 250;
        setKdsTickets(kt => [...kt, {
          id: ticketId,
          tableId: t.id,
          items: ["1x Chef's Ribeye Special", "1x Bordeaux Red Wine"],
          status: "pending",
          minutesAgo: 1
        }]);

        setRecentLog(`AI-Recommended dinner special ordered on Table ${t.id}.`);
        setSelectedTableId(t.id);
        return next;
      });
      setAnalyticsSurge(prev => Math.min(prev + 8, 92));
    } else {
      setRecentLog("All tables occupied! Expand floor plan or clear Table 5.");
    }
  };

  const handleClearKds = (id: number) => {
    setKdsTickets(prev => prev.filter(t => t.id !== id));
    setRecentLog(`KDS Ticket #${id} cleared by kitchen staff.`);
  };

  const handleStartRush = () => {
    setDinnerRushActive(!dinnerRushActive);
    setRecentLog(dinnerRushActive ? "Simulation paused." : "Dinner Rush Simulator Started. Telemetry streaming live...");
  };

  const selectedTable = tables.find(t => t.id === selectedTableId);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-orange-500/20 selection:text-orange-400">
      
      {/* Ambient Lighting Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[900px] h-[900px] bg-orange-600/10 rounded-full blur-[160px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-amber-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Modern Sleek Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 bg-[#07090E]/60 backdrop-blur-md">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2.5 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500">
            <ChefHat size={22} className="text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">Bistro<span className="text-orange-500">OS</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[12px] font-semibold uppercase tracking-wider text-slate-400">
          <a href="#demo" className="hover:text-orange-500 transition-colors">Interactive Demo</a>
          <a href="#features" className="hover:text-orange-500 transition-colors">Core Engine</a>
          <a href="#analytics" className="hover:text-orange-500 transition-colors">AI Forecasting</a>
          <a href="#pricing" className="hover:text-orange-500 transition-colors">Plans</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(249,115,22,0.2)] active:scale-95"
          >
            Launch System
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 text-center lg:text-left lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-8 mb-16 lg:mb-0 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-[10px] font-black tracking-widest uppercase shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              REAL-TIME OPERATION CLUSTER
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.05]">
              The Operating <br />
              System for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400">
                Modern Restaurants.
              </span>
            </h1>

            <p className="text-base text-slate-400 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
              Stop fighting split-seconds. Pipe front-of-house table telemetry, live KDS pipelines, and AI menu-forecasting agents into a single Redis-powered dashboard. Built for high-frequency dining operations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 active:scale-95 group"
              >
                Start Free Trial <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl font-bold text-sm tracking-wider uppercase border border-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play size={14} className="fill-orange-400 text-orange-400" />
                Live Demo
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 text-left max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white">4ms</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">PubSub Delay</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">99.99%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">KDS Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">+18%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Margin Gain</p>
              </div>
            </div>
          </div>

          {/* DYNAMIC TELEMETRY DEMO PREVIEW */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
            <div className="p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
              <div className="bg-[#0A0D14] border border-white/5 rounded-[2.4rem] p-6 space-y-6">
                
                {/* Simulator Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-orange-400 uppercase">Live Simulation Control</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      FOH & Kitchen Engine
                      <span className={`w-2.5 h-2.5 rounded-full ${dinnerRushActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleStartRush}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                        dinnerRushActive 
                        ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400' 
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {dinnerRushActive ? "Pause Dinner Rush" : "Simulate Dinner Rush"}
                    </button>
                    <button
                      onClick={handleSimulateOrder}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add Order
                    </button>
                  </div>
                </div>

                <div id="demo" className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* FOH FLOOR PLAN */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <Utensils size={14} className="text-orange-500" /> Dining Floor Map
                      </h4>
                      <span className="text-[10px] text-slate-500">6 Tables Active</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {tables.map(table => {
                        const statusColors = {
                          available: "bg-slate-800/40 border-slate-700 hover:border-slate-600 text-slate-400",
                          waiting: "bg-amber-500/10 border-amber-500/40 hover:border-amber-500 text-amber-400 animate-pulse",
                          cooking: "bg-rose-500/10 border-rose-500/40 hover:border-rose-500 text-rose-400",
                          serving: "bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-500 text-emerald-400",
                          paying: "bg-blue-500/10 border-blue-500/40 hover:border-blue-500 text-blue-400"
                        };

                        const isSelected = selectedTableId === table.id;

                        return (
                          <button
                            key={table.id}
                            onClick={() => setSelectedTableId(table.id)}
                            className={`p-3 rounded-xl border text-left transition-all relative ${statusColors[table.status]} ${
                              isSelected ? 'ring-2 ring-orange-500 border-transparent shadow-lg' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-extrabold text-xs text-white">{table.name}</span>
                              <span className="text-[8px] opacity-70 font-semibold">{table.seats} Pax</span>
                            </div>
                            <div className="text-[9px] uppercase font-bold tracking-wider mt-2">
                              {table.status}
                            </div>
                            {table.status !== "available" && (
                              <div className="text-[8px] opacity-60 mt-1">
                                {table.timeElapsed} min
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Table Details Sidebar (Interactive) */}
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                      {selectedTable ? (
                        <>
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs font-black text-white">{selectedTable.name} Details</span>
                            <span className="text-xs font-bold text-orange-400">${selectedTable.total.toFixed(2)}</span>
                          </div>
                          {selectedTable.orders.length > 0 ? (
                            <ul className="space-y-1">
                              {selectedTable.orders.map((item, i) => (
                                <li key={i} className="text-[10px] text-slate-300 flex justify-between">
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[10px] text-slate-500 italic">No active orders. Table is vacant.</p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-slate-500 italic">Select a table to view active bill.</p>
                      )}
                    </div>
                  </div>

                  {/* KITCHEN DISPLAY SYSTEM */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <Clock size={14} className="text-orange-500" /> Kitchen Tickets (KDS)
                      </h4>
                      <span className="text-[10px] text-slate-500">{kdsTickets.length} Pending</span>
                    </div>

                    <div className="space-y-3 h-[255px] overflow-y-auto pr-1">
                      {kdsTickets.map(ticket => {
                        const statusBadge = {
                          pending: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
                          preparing: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
                          ready: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse"
                        };

                        return (
                          <div key={ticket.id} className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2 hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-white">TICKET #{ticket.id}</span>
                              <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${statusBadge[ticket.status]}`}>
                                {ticket.status}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-300 space-y-1">
                              {ticket.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[9px] text-slate-500">
                              <span>Table {ticket.tableId} • {ticket.minutesAgo} min ago</span>
                              <button 
                                onClick={() => handleClearKds(ticket.id)}
                                className="text-orange-400 hover:text-orange-300 font-bold uppercase text-[8px]"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {kdsTickets.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 p-8 border border-dashed border-white/5 rounded-xl">
                          <CheckCircle2 size={24} className="text-emerald-500/50 mb-2" />
                          <p className="text-xs font-semibold">Kitchen Queue Clear</p>
                          <p className="text-[9px] opacity-70">Simulation is idling.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Live Console Logs */}
                <div className="p-3 bg-[#06080C] border border-white/5 rounded-xl flex items-center justify-between text-[9px] font-mono text-slate-500">
                  <div className="flex items-center gap-2 truncate">
                    <Activity size={12} className="text-orange-500 animate-pulse" />
                    <span className="text-orange-400/80">SYSTEM LOG:</span>
                    <span className="text-slate-300 truncate">{recentLog}</span>
                  </div>
                  <span className="shrink-0">TELEMETRY ON</span>
                </div>

              </div>
            </div>
          </div>

        </section>

        {/* INTEGRATION MARQUEE */}
        <section className="py-16 border-y border-white/5 bg-[#05070B] relative">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Integrated Ecosystem Partners</p>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 text-slate-400 font-bold text-sm tracking-widest opacity-60">
              <span className="flex items-center gap-2"><DollarSign size={16} /> SQUARE POS</span>
              <span className="flex items-center gap-2"><Layers size={16} /> TOAST INTEGRATION</span>
              <span className="flex items-center gap-2"><Smartphone size={16} /> UBER EATS APIS</span>
              <span className="flex items-center gap-2"><Database size={16} /> STRIPE TERMINAL</span>
            </div>
          </div>
        </section>

        {/* CORE FEATURES GRID */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-28 space-y-20">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              An Engine Built for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">High-Concurrency Dining.</span>
            </h2>
            <p className="text-slate-400 font-medium">
              Ditch the outdated point-of-sale terminal. BistroOS provides millisecond-level responsiveness for fast-casual and fine-dining environments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:border-orange-500/20 transition-all duration-300 space-y-6 group">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock size={22} />
              </div>
              <h3 className="text-xl font-bold text-white">Kitchen Display System</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Zero ticket loss. Instantly stream menu orders from tablet menus and delivery terminals directly to prep and line stations on high-contrast kitchen monitors.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:border-orange-500/20 transition-all duration-300 space-y-6 group">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Utensils size={22} />
              </div>
              <h3 className="text-xl font-bold text-white">Dynamic Floor Layouts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Map your tables visually. Color-coded telemetries inform staff instantly when tables are awaiting appetizers, bills, or require immediate bussing attention.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:border-orange-500/20 transition-all duration-300 space-y-6 group">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp size={22} />
              </div>
              <h3 className="text-xl font-bold text-white">AI Demand Forecasting</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Built-in agent pipelines analyze upcoming bookings, current ingredient prices, and historical weather data to recommend menu prices and supply lists.
              </p>
            </div>

          </div>
        </section>

        {/* AI PREDICTIVE SHOWCASE */}
        <section id="analytics" className="max-w-7xl mx-auto px-6 py-20">
          <div className="p-8 md:p-16 bg-gradient-to-br from-[#0F1420] to-[#0A0D15] border border-white/5 rounded-[3.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-orange-400 text-[10px] font-black tracking-widest uppercase">
                  <Sparkles size={12} /> GEMINI AI AGENT
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Autopilot Menu <br />Engineering.
                </h2>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  BistroOS embeds advanced Gemini models to handle the thinking. The model analyzes your inventory usage, identifies slow-moving plates, and constructs digital margin optimizations on the fly.
                </p>
                <div className="space-y-4 pt-4">
                  {[
                    "Inventory Auto-Ordering based on predicted weather and regional holidays.",
                    "Dynamic menu item descriptions generated for seasonal changes.",
                    "Labor scheduling plans tailored to reservation density peaks."
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3">
                      <CheckCircle2 className="text-orange-500 shrink-0 mt-0.5" size={16} />
                      <p className="text-xs md:text-sm text-slate-300 font-medium">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphical Card */}
              <div className="bg-[#06080C] border border-white/5 rounded-[2.5rem] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-400">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">AI Insights</p>
                      <h4 className="text-xs font-black text-white">Menu Profit Optimization</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">+12.4% Est. Margin</span>
                </div>

                {/* AI Advice Output Mockup */}
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-bold text-orange-400">ALERT: SURGE IN TOMAHAWK RESERVATIONS</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      "I detected 18 steak requests for Saturday evening. Wagyu steak supplier wholesale cost is -8% this week. Recommend featuring a 'Wagyu Ribeye Special' with a 3.4x markup to capture high demand margins."
                    </p>
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => {
                          setRecentLog("AI recommendation applied: Featured Menu Special updated.");
                          setTables(ts => ts.map(t => t.id === 4 ? { ...t, total: t.total + 30 } : t));
                        }}
                        className="px-3 py-1.5 bg-orange-500 text-white font-bold text-[9px] rounded-lg"
                      >
                        Apply Menu Special
                      </button>
                      <button className="px-3 py-1.5 bg-white/5 text-slate-400 text-[9px] rounded-lg font-bold">Ignore</button>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>Dynamic Inventory Levels</span>
                      <span className="text-white">Beef Ribeye (48kg / 60kg)</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-28 border-t border-white/5">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Simple Pricing, Scales with Your Tables.</h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto">
              Choose the package that matches your capacity. All plans include 4ms Redis PubSub signaling and core KDS connectivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Plan 1 */}
            <div className="p-10 bg-white/5 border border-white/5 rounded-3xl hover:border-orange-500/10 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Bistro Lite</h4>
                  <p className="text-4xl font-black text-white">$0<span className="text-sm text-slate-500 font-bold"> / month</span></p>
                </div>
                <p className="text-slate-400 text-xs">For small coffee bars, bistros, and food trucks needing simple order management.</p>
                <ul className="space-y-3 border-t border-white/5 pt-6 text-slate-300 text-xs">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> Up to 5 tables map</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> 1 KDS prep terminal</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> Local shift tracking</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> Email support</li>
                </ul>
              </div>
              <Link 
                href="/signup" 
                className="mt-8 block w-full text-center py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 text-xs tracking-wider uppercase"
              >
                Start Free
              </Link>
            </div>

            {/* Plan 2 */}
            <div className="p-10 bg-[#0F121B] border border-orange-500/30 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl" />
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-orange-400 mb-2">Bistro Pro</h4>
                    <p className="text-4xl font-black text-white">$49<span className="text-sm text-slate-500 font-bold"> / month</span></p>
                  </div>
                  <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 font-bold text-[8px] rounded-full uppercase tracking-wider border border-orange-500/20">RECOMMENDED</span>
                </div>
                <p className="text-slate-400 text-xs">For high-volume restaurants, multi-room dining facilities, and full operations.</p>
                <ul className="space-y-3 border-t border-white/5 pt-6 text-slate-200 text-xs">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> Unlimited tables mapping</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> Multi-device KDS pipelines</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> Gemini AI forecasting agent</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> SMS customer notifications</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-500" /> 24/7 Priority support</li>
                </ul>
              </div>
              <Link 
                href="/signup" 
                className="mt-8 block w-full text-center py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/10 text-xs tracking-wider uppercase"
              >
                Upgrade to Pro
              </Link>
            </div>

          </div>
        </section>

        {/* CTA CLOSING */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="relative p-12 md:p-20 bg-gradient-to-r from-orange-500 to-rose-600 rounded-[3rem] text-center overflow-hidden">
            <div className="absolute top-[-50%] left-[-20%] w-[900px] h-[900px] bg-white/10 rounded-full blur-[140px]" />
            
            <div className="relative max-w-2xl mx-auto space-y-8">
              <ChefHat className="text-white mx-auto" size={48} />
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Streamline your shift tonight.</h2>
              <p className="text-orange-100 text-sm md:text-base font-semibold max-w-lg mx-auto">
                Join over 4,000 kitchens leveraging BistroOS to shave minutes off prep times and maximize table turnaround speeds.
              </p>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white hover:bg-black rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-2xl active:scale-95"
              >
                Initialize BistroOS <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <div className="flex items-center gap-2">
          <ChefHat size={16} /> <span>BistroOS © 2026</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">POS Integration</a>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}