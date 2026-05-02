"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginMockUser, getCurrentUser } from "@/lib/auth";
import { useToast } from "@/context/ToastContext";
import { Sparkles, ArrowRight, Lock, Mail, User } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (getCurrentUser()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast("Please enter your complete registration details", "error");
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      loginMockUser(email);
      setIsLoading(false);
      toast("Your account has been created successfully!");
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-background relative overflow-hidden px-4 select-none">
      {/* Decorative premium ambient orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] bg-primary/20 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-indigo-500/15 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-2xl glassmorphism shadow-2xl z-10 border border-white/5 animate-fade-in relative">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-3 bg-primary/10 rounded-xl mb-4 border border-primary/20">
            <Sparkles className="w-7 h-7 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Create Account
          </h2>
          <p className="text-sm font-normal text-muted-foreground mt-2 max-w-xs">
            Start saving dynamic client project forms and downloading reports
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-background border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-sm text-foreground outline-none transition placeholder-slate-500 hover:border-white/20"
                placeholder="Jane Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-background border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-sm text-foreground outline-none transition placeholder-slate-500 hover:border-white/20"
                placeholder="jane@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-background border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-sm text-foreground outline-none transition placeholder-slate-500 hover:border-white/20"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Registering...
              </span>
            ) : (
              <>
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-4">
          <p className="text-sm font-normal text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
