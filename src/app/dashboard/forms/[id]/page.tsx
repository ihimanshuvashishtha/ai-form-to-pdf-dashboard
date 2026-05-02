"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { dbLayer, FormSubmission } from "@/lib/supabase";
import { generateAndDownloadPDF } from "@/lib/pdf";
import { useToast } from "@/context/ToastContext";
import { improveContentAction } from "@/lib/ai";
import { Files, ArrowLeft, Download, Save, Wand2, Sparkles, CheckCircle2 } from "lucide-react";

export default function SubmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();

  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form input states
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
  const [status, setStatus] = useState<"draft" | "completed" | "pdf_generated">("completed");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isImprovingDescription, setIsImprovingDescription] = useState(false);
  const [isImprovingRequirements, setIsImprovingRequirements] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await dbLayer.getSubmissionById(id);
        if (data) {
          setSubmission(data);
          setClientName(data.client_name);
          setClientEmail(data.client_email);
          setProjectTitle(data.project_title);
          setProjectType(data.project_type);
          setProjectDescription(data.project_description);
          setRequirements(data.requirements);
          setTimeline(data.timeline);
          setBudget(data.budget);
          setNotes(data.notes || "");
          setAiSummary(data.ai_summary || "");
          setStatus(data.status);
        } else {
          toast("Submission not found", "error");
          router.push("/dashboard/forms");
        }
      } catch (err) {
        toast("Failed to retrieve record", "error");
        router.push("/dashboard/forms");
      } finally {
        setIsLoading(false);
      }
    }
    if (id) {
      loadData();
    }
  }, [id, router, toast]);

  // AI actions
  const handleImproveDescription = async () => {
    if (!projectDescription) {
      toast("Input a brief description first", "error");
      return;
    }
    setIsImprovingDescription(true);
    try {
      const res = await improveContentAction(projectDescription, "project_description");
      setProjectDescription(res);
      toast("Description expanded by AI");
    } catch (e) {
      toast("Failed to improve description via AI", "error");
    } finally {
      setIsImprovingDescription(false);
    }
  };

  const handleImproveRequirements = async () => {
    if (!requirements) {
      toast("Add requirements first", "error");
      return;
    }
    setIsImprovingRequirements(true);
    try {
      const res = await improveContentAction(requirements, "requirements");
      setRequirements(res);
      toast("Requirements upgraded via AI");
    } catch (e) {
      toast("Failed to upgrade requirements via AI", "error");
    } finally {
      setIsImprovingRequirements(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!projectTitle || !projectDescription) {
      toast("Enter title & description before summary", "error");
      return;
    }
    setIsGeneratingSummary(true);
    try {
      const summarySource = `Project Title: ${projectTitle}\nRequirements: ${requirements}\nDescription: ${projectDescription}`;
      const res = await improveContentAction(summarySource, "summary");
      setAiSummary(res);
      toast("Professional summary synthesized");
    } catch (e) {
      toast("AI synthesis failed", "error");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !projectTitle || !projectDescription || !requirements || !timeline || !budget) {
      toast("Fill out all required parameters", "error");
      return;
    }
    setIsUpdating(true);

    try {
      const updated = await dbLayer.updateSubmission(id, {
        client_name: clientName,
        client_email: clientEmail,
        project_title: projectTitle,
        project_type: projectType,
        project_description: projectDescription,
        requirements,
        timeline,
        budget,
        notes,
        ai_summary: aiSummary,
        status,
      });

      if (updated) {
        setSubmission(updated);
        toast("Form Submission updated successfully");
        router.push("/dashboard/forms");
      } else {
        toast("Record updating failed", "error");
      }
    } catch (err) {
      toast("An error occurred. Please try again.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!submission) return;
    try {
      generateAndDownloadPDF({
        ...submission,
        client_name: clientName,
        client_email: clientEmail,
        project_title: projectTitle,
        project_type: projectType,
        project_description: projectDescription,
        requirements,
        timeline,
        budget,
        notes,
        ai_summary: aiSummary,
        status,
      });
      toast("Report generated successfully");
    } catch (err) {
      toast("Failed to download PDF", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-[70vh] animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">Locating record details...</span>
        </div>
      </div>
    );
  }

  if (!submission) return null;

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => router.push("/dashboard/forms")}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-100 transition py-2 rounded-xl mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-normal">
            Project Overview Details
          </h1>
          <p className="text-sm font-light text-slate-400 mt-1">
            Review data, trigger OpenAI, and regenerate high-end client PDFs.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="text-xs font-semibold bg-emerald-950/40 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-900/40 border border-emerald-800/40 hover:border-emerald-700/60 transition px-4 py-3.5 rounded-xl flex items-center justify-center gap-2 backdrop-blur-md shadow-md"
          >
            <Download className="w-4.5 h-4.5" />
            Download PDF
          </button>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8 select-none">
        {/* Core Submission configuration details */}
        <div className="p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            Header Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Client Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3.5 px-4 outline-none text-sm font-normal text-slate-100 transition"
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
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3.5 px-4 outline-none text-sm font-normal text-slate-100 transition"
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
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3.5 px-4 outline-none text-sm font-normal text-slate-100 transition"
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
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3.5 px-4 outline-none text-sm font-normal text-slate-100 transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Detailed Scope */}
        <div className="p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Files className="w-5 h-5 text-indigo-400" />
            Work Scope
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
                {isImprovingDescription ? "Refining..." : "AI Refine"}
              </button>
            </div>
            <textarea
              rows={4}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 outline-none text-sm font-normal text-slate-100 transition resize-y"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center select-none">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Requirements <span className="text-rose-500">*</span>
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
              required
            />
          </div>
        </div>

        {/* Executive summary block */}
        <div className="p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 space-y-6">
          <div className="flex justify-between items-center select-none">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-emerald-400" />
              AI Executive Summary
            </h3>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="text-xs font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/40 px-3.5 py-2 rounded-xl flex items-center gap-1 backdrop-blur-md shadow-sm transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingSummary ? "Generating..." : "AI Generate Summary"}
            </button>
          </div>
          <textarea
            rows={4}
            value={aiSummary}
            onChange={(e) => setAiSummary(e.target.value)}
            className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 outline-none text-sm font-normal text-slate-100 transition resize-y"
          />
        </div>

        {/* Scope Metadata Inputs & Status alterations */}
        <div className="p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            Budget, Timeline & Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Timeline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 px-4 outline-none text-sm font-normal text-slate-100 transition"
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
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Workflow Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3.5 px-4 outline-none text-sm font-semibold text-slate-100 transition cursor-pointer"
              >
                <option value="draft">DRAFT</option>
                <option value="completed">COMPLETED</option>
                <option value="pdf_generated">PDF GENERATED</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Additional Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-background border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 outline-none text-sm font-normal text-slate-100 transition resize-y"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 select-none"
        >
          {isUpdating ? "Saving Changes..." : "Save and Update Submission"}
        </button>
      </form>
    </div>
  );
}
