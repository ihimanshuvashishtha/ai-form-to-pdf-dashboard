"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { dbLayer } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";
import { improveContentAction } from "@/lib/ai";
import { Sparkles, Files, Trash2, Save, Wand2 } from "lucide-react";

export default function NewFormPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [aiSummary, setAiSummary] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImprovingDescription, setIsImprovingDescription] = useState(false);
  const [isImprovingRequirements, setIsImprovingRequirements] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Auto-save & draft restoration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("portfolio_form_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setClientName(parsed.clientName || "");
          setClientEmail(parsed.clientEmail || "");
          setProjectTitle(parsed.projectTitle || "");
          setProjectType(parsed.projectType || "");
          setProjectDescription(parsed.projectDescription || "");
          setRequirements(parsed.requirements || "");
          setTimeline(parsed.timeline || "");
          setBudget(parsed.budget || "");
          setNotes(parsed.notes || "");
          setAiSummary(parsed.aiSummary || "");
        } catch (e) {
          // Empty or invalid draft
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(
          "portfolio_form_draft",
          JSON.stringify({
            clientName,
            clientEmail,
            projectTitle,
            projectType,
            projectDescription,
            requirements,
            timeline,
            budget,
            notes,
            aiSummary,
          })
        );
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [clientName, clientEmail, projectTitle, projectType, projectDescription, requirements, timeline, budget, notes, aiSummary]);

  const handleClearDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_form_draft");
      setClientName("");
      setClientEmail("");
      setProjectTitle("");
      setProjectType("");
      setProjectDescription("");
      setRequirements("");
      setTimeline("");
      setBudget("");
      setNotes("");
      setAiSummary("");
      toast("Draft cleared completely");
    }
  };

  // AI assistant handlers
  const handleImproveDescription = async () => {
    if (!projectDescription) {
      toast("Enter a brief description first", "error");
      return;
    }
    setIsImprovingDescription(true);
    try {
      const response = await improveContentAction(projectDescription, "project_description");
      setProjectDescription(response);
      toast("Description enriched by AI");
    } catch (e) {
      toast("AI enrichment failed. Please try again.", "error");
    } finally {
      setIsImprovingDescription(false);
    }
  };

  const handleImproveRequirements = async () => {
    if (!requirements) {
      toast("Add some requirements first", "error");
      return;
    }
    setIsImprovingRequirements(true);
    try {
      const response = await improveContentAction(requirements, "requirements");
      setRequirements(response);
      toast("Requirements upgraded by AI");
    } catch (e) {
      toast("AI upgrade failed. Please try again.", "error");
    } finally {
      setIsImprovingRequirements(false);
    }
  };

  const handleGenerateSummary = async () => {
    const summarySource = `Project Title: ${projectTitle}\nRequirements: ${requirements}\nDescription: ${projectDescription}`;
    if (!projectTitle || !projectDescription) {
      toast("Enter title & description before summary", "error");
      return;
    }
    setIsGeneratingSummary(true);
    try {
      const response = await improveContentAction(summarySource, "summary");
      setAiSummary(response);
      toast("Professional summary created by AI");
    } catch (e) {
      toast("AI summary failed. Please try again.", "error");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !projectTitle || !projectDescription || !requirements || !timeline || !budget) {
      toast("Ensure all required inputs are populated", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      await dbLayer.insertSubmission({
        client_name: clientName,
        client_email: clientEmail,
        project_title: projectTitle,
        project_type: projectType || "Custom Development",
        project_description: projectDescription,
        requirements,
        timeline,
        budget,
        notes,
        ai_summary: aiSummary,
        status: "completed",
      });

      // Clear local storage draft
      if (typeof window !== "undefined") {
        localStorage.removeItem("portfolio_form_draft");
      }
      toast("Form Submission saved successfully");
      router.push("/dashboard/forms");
    } catch (err) {
      toast("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-normal">
            New Project Form
          </h1>
          <p className="text-sm font-light text-slate-400 mt-1">
            Capture customer parameters with built-in auto-saving and AI optimization.
          </p>
        </div>

        <button
          onClick={handleClearDraft}
          className="text-xs font-semibold bg-rose-950/40 text-rose-300 hover:text-rose-100 hover:bg-rose-900/40 border border-rose-800/40 hover:border-rose-700/60 transition py-3 px-4 rounded-xl flex items-center justify-center gap-2 backdrop-blur-md"
        >
          <Trash2 className="w-4 h-4" />
          Clear Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 select-none">
        {/* Client & Project Header details */}
        <div className="p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Client & Scope Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-none">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Client Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 px-4 outline-none text-sm font-normal text-slate-100 transition"
                placeholder="Ex. Quantum Innovations"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Client Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 px-4 outline-none text-sm font-normal text-slate-100 transition"
                placeholder="Ex. hello@quantum.tech"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 px-4 outline-none text-sm font-normal text-slate-100 transition"
                placeholder="Ex. AI Infrastructure Expansion"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Project Type <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 px-4 outline-none text-sm font-normal text-slate-100 transition"
                placeholder="Ex. Full-Stack Web Application"
                required
              />
            </div>
          </div>
        </div>

        {/* Detailed Scope */}
        <div className="p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Files className="w-5 h-5 text-indigo-400" />
            Detailed Description & Requirements
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center select-none">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Project Description <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleImproveDescription}
                disabled={isImprovingDescription}
                className="text-xs font-semibold bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 hover:bg-indigo-900/40 px-3 py-1.5 rounded-xl flex items-center gap-1 backdrop-blur-md shadow-sm transition disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                {isImprovingDescription ? "Improving..." : "AI Improve"}
              </button>
            </div>
            <textarea
              rows={4}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 outline-none text-sm font-normal text-slate-100 transition resize-y"
              placeholder="Ex. Brief overview of project goals, features, and target outcomes."
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center select-none">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Specific Requirements <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleImproveRequirements}
                disabled={isImprovingRequirements}
                className="text-xs font-semibold bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 hover:bg-indigo-900/40 px-3 py-1.5 rounded-xl flex items-center gap-1 backdrop-blur-md shadow-sm transition disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                {isImprovingRequirements ? "Upgrading..." : "AI Upgrade"}
              </button>
            </div>
            <textarea
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 outline-none text-sm font-normal text-slate-100 transition resize-y"
              placeholder="Ex. List of technical and operational deliverables."
              required
            />
          </div>
        </div>

        {/* Deliverables summary or AI assistant insights */}
        <div className="p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 space-y-6">
          <div className="flex justify-between items-center select-none">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-emerald-400 animate-pulse" />
              AI Executive Summary
            </h3>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="text-xs font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/40 px-3.5 py-2 rounded-xl flex items-center gap-1 backdrop-blur-md shadow-sm transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingSummary ? "Synthesizing..." : "Generate AI Summary"}
            </button>
          </div>
          <textarea
            rows={4}
            value={aiSummary}
            onChange={(e) => setAiSummary(e.target.value)}
            className="w-full bg-background/50 border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 outline-none text-sm font-normal text-slate-100 transition resize-y"
            placeholder="Review parameters and generate an AI Executive Summary for the PDF client proposal."
          />
        </div>

        {/* Scope Metadata Inputs */}
        <div className="p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Save className="w-5 h-5 text-amber-400" />
            Budget, Timeline & Extra Notes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-none">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Timeline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 px-4 outline-none text-sm font-normal text-slate-100 transition"
                placeholder="Ex. 6 Weeks"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Budget <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 px-4 outline-none text-sm font-normal text-slate-100 transition"
                placeholder="Ex. $15,000"
                required
              />
            </div>
          </div>

          <div className="space-y-2 select-none">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Additional Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 outline-none text-sm font-normal text-slate-100 transition resize-y"
              placeholder="Ex. General comments or miscellaneous requirements."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none"
        >
          {isSubmitting ? "Saving Submission..." : "Save and Submit Form"}
        </button>
      </form>
    </div>
  );
}
