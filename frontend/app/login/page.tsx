"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Lock, LogIn, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const successMessage = searchParams.get("message");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("http://localhost:8080/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Google Login Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Invalid credentials");
            }

            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-slate-900 font-sans antialiased px-6 py-12">
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-6">
                        <Sparkles size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome back</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Sign in to your orchestrator dashboard.</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">

                    {successMessage && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 text-sm font-medium">
                            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                            {successMessage}
                        </div>
                    )}

                    <div className="mb-8">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Google Login Failed")}
                            useOneTap
                            theme="outline"
                            size="large"
                            width="100%"
                            shape="pill"
                        />
                    </div>

                    <div className="relative mb-8 text-center">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-100" />
                        <span className="relative bg-white px-4 text-[11px] font-black uppercase tracking-widest text-slate-300">or use email</span>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-blue-100"
                        >
                            {loading ? (
                                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
                            ) : (
                                <><LogIn size={18} /> Sign In</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm font-medium text-slate-500 mt-8">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 inline-flex items-center gap-1 transition-all">
                        Create one <ArrowRight size={14} />
                    </Link>
                </p>
            </div>
        </div>
    );
}