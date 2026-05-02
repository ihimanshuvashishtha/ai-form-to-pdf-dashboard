"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dbLayer, FormSubmission } from "@/lib/supabase";
import { generateAndDownloadPDF } from "@/lib/pdf";
import { useToast } from "@/context/ToastContext";
import { Files, CheckCircle2, FileText, Sparkles, Download, ArrowRight, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await dbLayer.getSubmissions();
        setSubmissions(data);
      } catch (err) {
        toast("Failed to retrieve submissions", "error");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  // Statistics
  const totalSubmissions = submissions.length;
  const draftSubmissions = submissions.filter((s) => s.status === "draft").length;
  const completedSubmissions = submissions.filter((s) => s.status === "completed").length;
  const pdfGeneratedSubmissions = submissions.filter((s) => s.status === "pdf_generated").length;

  const handleDownloadPDF = (submission: FormSubmission) => {
    try {
      generateAndDownloadPDF(submission);
      toast("Report downloaded successfully");
    } catch (error) {
      toast("PDF creation error occurred", "error");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Overview
          </h1>
          <p className="text-sm font-light text-slate-400 mt-1 max-w-md">
            Review workspace metrics and generated documents.
          </p>
        </div>

        <Link
          href="/dashboard/forms/new"
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200"
        >
          <Files className="w-5 h-5" />
          Add Submission
        </Link>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Widget 1 */}
        <div className="p-6 rounded-2xl glassmorphism border border-white/5 flex flex-col justify-between h-40 glow-card relative select-none">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <Files className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              Active
            </span>
          </div>
          <div>
            <h4 className="text-sm font-normal text-slate-400">Total Forms</h4>
            <span className="text-3xl font-extrabold text-slate-100 mt-1">{totalSubmissions}</span>
          </div>
        </div>

        {/* Widget 2 */}
        <div className="p-6 rounded-2xl glassmorphism border border-white/5 flex flex-col justify-between h-40 glow-card relative select-none">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-normal text-slate-400">Completed Forms</h4>
            <span className="text-3xl font-extrabold text-slate-100 mt-1">{completedSubmissions}</span>
          </div>
        </div>

        {/* Widget 3 */}
        <div className="p-6 rounded-2xl glassmorphism border border-white/5 flex flex-col justify-between h-40 glow-card relative select-none">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-normal text-slate-400">PDFs Downloaded</h4>
            <span className="text-3xl font-extrabold text-slate-100 mt-1">{pdfGeneratedSubmissions}</span>
          </div>
        </div>

        {/* Widget 4 */}
        <div className="p-6 rounded-2xl glassmorphism border border-white/5 flex flex-col justify-between h-40 glow-card relative select-none">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-normal text-slate-400">Drafts Stored</h4>
            <span className="text-3xl font-extrabold text-slate-100 mt-1">{draftSubmissions}</span>
          </div>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="rounded-2xl glassmorphism border border-white/5 p-6 sm:p-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-100 tracking-tight">
              Recent Activity
            </h3>
            <p className="text-sm font-light text-slate-400 mt-0.5">
              Review and manage your newly registered customer files
            </p>
          </div>
          <Link
            href="/dashboard/forms"
            className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1.5 transition"
          >
            View All Forms
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-44 border border-dashed border-white/10 rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-xs font-normal text-slate-400">Rendering listings...</span>
            </div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-52 border border-dashed border-white/10 rounded-xl gap-4 p-6 text-center">
            <Files className="w-10 h-10 text-slate-600 animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-slate-300">No submissions found</p>
              <p className="text-xs font-light text-slate-400 mt-0.5 max-w-xs">
                Your records list is empty. Click New Submission to draft your first file.
              </p>
            </div>
            <Link
              href="/dashboard/forms/new"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-foreground py-2 px-4 rounded-xl text-xs font-semibold backdrop-blur-md shadow-md transition"
            >
              Start New Submission
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-spacing-0 select-none">
              <thead>
                <tr className="border-b border-white/5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <th className="py-4 px-4">Project Information</th>
                  <th className="py-4 px-4">Client Contact</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Generated At</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions.slice(0, 5).map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="text-sm font-bold text-slate-100 group-hover:text-primary transition duration-200">
                        {sub.project_title}
                      </div>
                      <div className="text-xs font-light text-slate-400 mt-0.5">{sub.project_type}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-normal text-slate-200">{sub.client_name}</div>
                      <div className="text-xs font-light text-slate-500 mt-0.5">{sub.client_email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                          sub.status === "draft"
                            ? "bg-amber-950/40 border-amber-800/40 text-amber-300"
                            : sub.status === "completed"
                            ? "bg-indigo-950/40 border-indigo-800/40 text-indigo-300"
                            : "bg-emerald-950/40 border-emerald-800/40 text-emerald-300"
                        }`}
                      >
                        <span className="w-2 h-2 bg-current rounded-full" />
                        {sub.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-normal text-slate-400">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link
                          href={`/dashboard/forms/${sub.id}`}
                          className="text-xs font-semibold text-slate-300 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 px-3 py-2 rounded-xl transition backdrop-blur-md"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleDownloadPDF(sub)}
                          className="text-xs font-semibold text-white bg-primary/20 hover:bg-primary/40 border border-primary/40 hover:border-primary/60 px-3 py-2 rounded-xl transition flex items-center gap-1.5 backdrop-blur-md"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
