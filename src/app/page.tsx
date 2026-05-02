"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, FileText, Bot, Download, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background select-none min-h-screen relative overflow-x-hidden">
      {/* Dynamic atmospheric ambient orbs */}
      <div className="absolute top-[-150px] right-[-100px] w-[600px] h-[600px] bg-primary/25 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute top-[250px] left-[-200px] w-[500px] h-[500px] bg-indigo-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/30 backdrop-blur-md glow-card">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-foreground">
            Form<span className="text-primary font-light">to</span>PDF
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold hover:text-primary transition py-2 px-3 sm:px-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition duration-200"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto px-6 py-16 sm:py-28 z-10 relative">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 backdrop-blur-md px-4 py-1.5 rounded-full mb-8 hover:bg-primary/15 transition animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            Next-Gen Document AI Assistant
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-6 leading-tight animate-fade-in">
          AI-Powered Proposal & PDF Reports In Seconds
        </h1>

        <p className="text-base sm:text-xl font-light text-slate-400 max-w-2xl leading-relaxed mb-10 animate-fade-in">
          Build dynamic customer submissions, utilize our deep-learning AI to expand summaries, and instantly download high-quality client PDFs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold text-base py-4 px-8 rounded-xl flex items-center justify-center gap-2.5 shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Create Your Form Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-foreground font-semibold text-base py-4 px-8 rounded-xl flex items-center justify-center gap-2 backdrop-blur-md shadow-lg transition active:scale-[0.98]"
          >
            Login to Dashboard
          </Link>
        </div>
      </main>

      {/* Feature Grids */}
      <section className="max-w-7xl w-full mx-auto px-6 py-20 z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Built For High Performance
          </h2>
          <p className="text-sm sm:text-base font-light text-slate-400 max-w-lg mx-auto">
            Everything you need to capture, polish, and document your clients projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl glassmorphism border border-white/5 glow-card relative flex flex-col items-start text-left group">
            <div className="p-3.5 bg-primary/10 rounded-2xl mb-6 border border-primary/20 text-primary group-hover:scale-110 transition duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-primary transition duration-300">
              Dynamic Forms
            </h3>
            <p className="text-sm font-light text-slate-400 leading-relaxed mb-4">
              Capture requirements via an advanced Zod-validated input array. Instant error checks prevent incomplete files.
            </p>
            <div className="flex items-center gap-2 mt-auto text-primary text-sm font-semibold group-hover:gap-3 transition-all duration-300">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl glassmorphism border border-white/5 glow-card relative flex flex-col items-start text-left group">
            <div className="p-3.5 bg-indigo-500/10 rounded-2xl mb-6 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition duration-300">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-indigo-400 transition duration-300">
              Smart AI Expansion
            </h3>
            <p className="text-sm font-light text-slate-400 leading-relaxed mb-4">
              Leverage OpenAI algorithms on the fly to refine descriptions, summaries, and functional specs for absolute clarity.
            </p>
            <div className="flex items-center gap-2 mt-auto text-indigo-400 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl glassmorphism border border-white/5 glow-card relative flex flex-col items-start text-left group">
            <div className="p-3.5 bg-emerald-500/10 rounded-2xl mb-6 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition duration-300">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-emerald-400 transition duration-300">
              Paginated PDFs
            </h3>
            <p className="text-sm font-light text-slate-400 leading-relaxed mb-4">
              Export high-fidelity, elegantly formatted documents directly to your desktop. Instantly send proposals to customers.
            </p>
            <div className="flex items-center gap-2 mt-auto text-emerald-400 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Steps section */}
      <section className="max-w-7xl w-full mx-auto px-6 py-20 border-t border-white/5 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            How It Works
          </h2>
          <p className="text-sm sm:text-base font-light text-slate-400 max-w-lg mx-auto">
            Three simple phases to generate professional project documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/15 border border-primary/30 rounded-2xl flex items-center justify-center text-primary font-bold text-lg mb-6 backdrop-blur-md glow-card">
              1
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2">Create Dynamic Form</h4>
            <p className="text-sm font-light text-slate-400 max-w-xs">
              Fill out technical requirements, project timelines, and notes. Save drafts dynamically with LocalStorage.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-indigo-500/15 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 font-bold text-lg mb-6 backdrop-blur-md glow-card">
              2
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2">Polish with AI</h4>
            <p className="text-sm font-light text-slate-400 max-w-xs">
              Enhance project information and generate professional client-ready summaries instantly.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 font-bold text-lg mb-6 backdrop-blur-md glow-card">
              3
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2">Instant PDF Export</h4>
            <p className="text-sm font-light text-slate-400 max-w-xs">
              Review submission parameters, select file status, and generate fully styled PDF reports.
            </p>
          </div>
        </div>
      </section>

      {/* Simple CTA Footer */}
      <footer className="mt-auto border-t border-white/5 py-10 z-10 backdrop-blur-md bg-background/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-xs font-normal text-slate-500">
            &copy; {new Date().getFullYear()} Form to PDF Creator AI. Built with Next.js 14, Supabase, and OpenAI.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-medium text-slate-400 hover:text-primary transition">
              Terms of Use
            </Link>
            <Link href="/signup" className="text-xs font-medium text-slate-400 hover:text-primary transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
