"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Lock, UserPlus, Loader2, ArrowRight, Github } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const githubCode = searchParams.get("code");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle GitHub Callback automatically
    useEffect(() => {
        if (githubCode) {
            handleGithubLogin(githubCode);
        }
    }, [githubCode]);

    const handleGithubLogin = async (code: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://ca-orchestrator.grayglacier-f4d16ba4.eastasia.azurecontainerapps.io/github-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "GitHub Signup Failed");
        } finally {
            setLoading(false);
        }
    };

    const redirectToGithub = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        const redirectUri = window.location.origin + "/signup";
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://ca-orchestrator.grayglacier-f4d16ba4.eastasia.azurecontainerapps.io/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Google Signup Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("https://ca-orchestrator.grayglacier-f4d16ba4.eastasia.azurecontainerapps.io/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create account");
            }

            router.push("/login?message=Account created successfully. Please log in.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-slate-900 font-sans antialiased px-6">
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-6">
                        <Sparkles size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create your account</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Start orchestrating AI workflows today.</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">
                    <div className="flex flex-col gap-3 mb-8">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Google Signup Failed")}
                            useOneTap
                            theme="outline"
                            size="large"
                            width="100%"
                            shape="pill"
                        />

                        <button
                            onClick={redirectToGithub}
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all duration-300 active:scale-[0.98] text-sm"
                        >
                            <Github size={18} />
                            Continue with GitHub
                        </button>
                    </div>

                    <div className="relative mb-8 text-center">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-100" />
                        <span className="relative bg-white px-4 text-[11px] font-black uppercase tracking-widest text-slate-300">or use email</span>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 bg-slate-50 hover:bg-white transition-colors"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 bg-slate-50 hover:bg-white transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600 text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
