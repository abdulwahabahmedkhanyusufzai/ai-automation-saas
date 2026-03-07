"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sparkles, Send, Loader2, CheckCircle2, Terminal, Copy, RefreshCw, FileText, LogOut } from "lucide-react";

export default function WorkflowDashboard() {
    const router = useRouter();
    const [instruction, setInstruction] = useState("");
    const [taskId, setTaskId] = useState<string | null>(null);
    const [result, setResult] = useState<string>("");
    const [status, setStatus] = useState<"idle" | "queueing" | "processing" | "success" | "error">("idle");
    const [currentPhase, setCurrentPhase] = useState<string>("");
    const [liveContent, setLiveContent] = useState<string>("");

    // Protect route: Check for token on load
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const triggerWorkflow = async () => {
        if (!instruction.trim()) return;
        setResult("");
        setLiveContent("");
        setCurrentPhase("planning");
        setStatus("queueing");

        const token = localStorage.getItem("token");

        try {
            const res = await axios.post(
                "https://ca-orchestrator.grayglacier-f4d16ba4.eastasia.azurecontainerapps.io/api/v1/workflows/trigger",
                {
                    workflow_id: Math.random().toString(36).substring(7),
                    instruction: instruction,
                },
                {
                    headers: { Authorization: `Bearer ${token}` } // Attach JWT
                }
            );
            setTaskId(res.data.task_id);
            setStatus("processing");
        } catch (err) {
            setStatus("error");
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === "processing" && taskId) {
            interval = setInterval(async () => {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(
                        `https://ca-orchestrator.grayglacier-f4d16ba4.eastasia.azurecontainerapps.io/api/v1/workflows/status/${taskId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` } // Attach JWT
                        }
                    );

                    if (res.data.phase) {
                        setCurrentPhase(res.data.phase);
                    }

                    if (res.data.live) {
                        setLiveContent(res.data.live);
                    }

                    if (res.data.status === "completed") {
                        const rawData = res.data.data;

                        if (!rawData) {
                            setResult("No result returned from workflow.");
                            setStatus("error");
                            setCurrentPhase("completed");
                            clearInterval(interval);
                            return;
                        }

                        let extraction = "";

                        if (typeof rawData.final_result === "string") {
                            extraction = rawData.final_result;
                        } else if (Array.isArray(rawData.final_result)) {
                            extraction = rawData.final_result[0]?.text || JSON.stringify(rawData.final_result, null, 2);
                        } else {
                            extraction = JSON.stringify(rawData, null, 2);
                        }

                        setResult(extraction);
                        setStatus("success");
                        setCurrentPhase("completed");
                        clearInterval(interval);
                    }
                } catch (err) {
                    console.error("Polling error:", err);
                }
            }, 600);
        }
        return () => clearInterval(interval);
    }, [status, taskId]);

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased">
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

            <main className="relative max-w-4xl mx-auto pt-20 px-6 pb-24">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                            <Sparkles size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Agent Orchestrator</h1>
                            <p className="text-sm text-slate-500 font-medium tracking-tight">Distributed Microservices Architecture</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {status === "success" && (
                            <button
                                onClick={() => { setResult(""); setInstruction(""); setStatus("idle"); setCurrentPhase(""); }}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100 shadow-sm"
                                title="Reset Workflow"
                            >
                                <RefreshCw size={18} />
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100 shadow-sm"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* Input Card */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500/40">
                    <textarea
                        className="w-full h-44 p-8 bg-transparent outline-none resize-none text-lg text-slate-700 placeholder:text-slate-300 leading-relaxed font-medium"
                        placeholder="What should the agent analyze today?"
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                    />

                    <div className="flex items-center justify-between p-5 bg-slate-50/50 border-t border-slate-100">
                        <div className="flex items-center gap-4 px-2">
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                <Terminal size={14} className="text-slate-300" />
                                REDIS: {status === "idle" ? "READY" : "ACTIVE"}
                            </span>
                        </div>

                        <button
                            onClick={triggerWorkflow}
                            disabled={status === "queueing" || status === "processing" || !instruction.trim()}
                            className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-bold rounded-2xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-blue-100"
                        >
                            {status === "processing" || status === "queueing" ? (
                                <><Loader2 size={18} className="animate-spin" />Processing</>
                            ) : (
                                <><Send size={16} />Run Workflow</>
                            )}
                        </button>
                    </div>
                </div>

                {/* SaaS Phase Progress Indicator */}
                {(status === "processing" || status === "queueing") && (
                    <div className="mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
                            {[
                                { id: "planning", label: "Planning", icon: <FileText size={16} /> },
                                { id: "researching", label: "Researching", icon: <Terminal size={16} /> },
                                { id: "styling", label: "Styling", icon: <Sparkles size={16} /> }
                            ].map((step, i) => {
                                const isActive = currentPhase === step.id;
                                const isDone = ["planning", "researching", "styling", "completed"].indexOf(currentPhase) > i;

                                return (
                                    <div key={i} className="flex flex-col items-center gap-3 group">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-sm border
                                            ${isDone
                                                ? "bg-emerald-500 text-white border-emerald-400"
                                                : isActive
                                                    ? "bg-blue-600 text-white border-blue-500 shadow-blue-100 scale-110 animate-pulse"
                                                    : "bg-slate-50 text-slate-300 border-slate-100"}`}
                                        >
                                            {isDone ? <CheckCircle2 size={18} /> : step.icon}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors
                                            ${isActive ? "text-blue-600" : isDone ? "text-emerald-500" : "text-slate-400"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Result Area (Structured Markdown) */}
                {(result || status === "processing") && (
                    <div className="mt-14 space-y-6 animate-in fade-in zoom-in-95 duration-700">
                        <div className="flex items-center justify-between px-3">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2.5">
                                {status === "success" ? <CheckCircle2 size={15} className="text-emerald-500" /> : <FileText size={15} />}
                                Analysis Output
                            </h2>
                            {result && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(result)}
                                    className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                                >
                                    <Copy size={13} /> Copy Result
                                </button>
                            )}
                        </div>

                        <div className="p-[2px] bg-gradient-to-br from-blue-500/20 via-transparent to-slate-200/50 rounded-[2.6rem]">
                            <div className="relative p-8 sm:p-12 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.02)] leading-relaxed text-slate-700 overflow-hidden">
                                {/* SaaS Watermark */}
                                <div className="absolute top-10 right-[-40px] rotate-45 bg-slate-50 px-14 py-1.5 text-[10px] font-black text-slate-200 tracking-[0.4em] uppercase pointer-events-none select-none border-y border-slate-100/50">
                                    Agentic Output
                                </div>

                                {result || liveContent ? (
                                    <div className="prose prose-slate max-w-none animate-in fade-in slide-in-from-top-4 duration-1000 
                                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-[17px]
                                        prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
                                        prose-strong:text-slate-900 prose-strong:font-extrabold
                                        prose-table:border-hidden prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-sm
                                        prose-th:bg-slate-50 prose-th:px-4 prose-th:py-3 prose-th:text-[11px] prose-th:uppercase prose-th:tracking-widest
                                        prose-td:px-4 prose-td:py-4 prose-td:text-[15px] prose-td:border-t prose-td:border-slate-50">

                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                code({ node, inline, className, children, ...props }: any) {
                                                    const match = /language-(\w+)/.exec(className || "");
                                                    return !inline && match ? (
                                                        <div className="my-8 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                                                            <div className="bg-slate-50 px-5 py-3 text-[10px] font-bold text-slate-400 border-b border-slate-100 flex justify-between uppercase">
                                                                <span>{match[1]} query</span>
                                                            </div>
                                                            <SyntaxHighlighter
                                                                style={oneLight as any}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{ margin: 0, padding: '24px', fontSize: '14px', background: '#fff' }}
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, "")}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-bold text-[0.9em]" {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                },
                                            }}
                                        >
                                            {result || liveContent}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="h-4 w-full bg-slate-50 rounded-full animate-pulse" />
                                        <div className="h-4 w-[85%] bg-slate-50 rounded-full animate-pulse" />
                                        <div className="h-4 w-[40%] bg-slate-50 rounded-full animate-pulse" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}