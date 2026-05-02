"use client";

import React, { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/context/ToastContext";
import { Settings, User, Sparkles, Database } from "lucide-react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setFullName(user.full_name || "Demo Portfolio User");
      setEmail(user.email || "demo@portfolio.com");
    }
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast("Account and profile information updated successfully");
    }, 800);
  };

  const handleResetStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_form_submissions");
      localStorage.removeItem("portfolio_form_draft");
      toast("Workspace data cleared! Please reload the page to refresh defaults.");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-4xl select-none">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Account Settings
        </h1>
        <p className="text-sm font-light text-slate-400 mt-1 max-w-md">
          Personalize your workspace defaults and clean temporary local data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Basic Profile Details
          </h3>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3.5 px-4 outline-none text-sm font-normal text-slate-100 transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-background/50 border border-white/5 text-slate-500 rounded-xl py-3.5 px-4 outline-none text-sm font-normal cursor-not-allowed select-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 flex flex-col justify-between h-auto gap-6 select-none relative">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              Advanced Data Cleaning
            </h3>
            <p className="text-xs font-light text-slate-400 mt-2 max-w-xs leading-relaxed">
              Resets all stored local submissions, form drafts, and template records. Deletes demo data.
            </p>
          </div>

          <button
            onClick={handleResetStorage}
            className="text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 hover:border-rose-700/60 transition py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 backdrop-blur-md"
          >
            Reset Workspace Cache
          </button>
        </div>
      </div>
    </div>
  );
}
