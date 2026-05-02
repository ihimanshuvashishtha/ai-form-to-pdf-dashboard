"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dbLayer, FormSubmission } from "@/lib/supabase";
import { generateAndDownloadPDF } from "@/lib/pdf";
import { useToast } from "@/context/ToastContext";
import { Files, Search, Download, Trash2, ArrowRight, X } from "lucide-react";

export default function FormsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "draft" | "completed" | "pdf_generated">("all");

  // Deletion modal state
  const [deletingSubmission, setDeletingSubmission] = useState<FormSubmission | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await dbLayer.getSubmissions();
      setSubmissions(data);
    } catch (e) {
      toast("Error loading all data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadPDF = (submission: FormSubmission) => {
    try {
      generateAndDownloadPDF(submission);
      toast("Report downloaded successfully");
    } catch (error) {
      toast("PDF creation error occurred", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deletingSubmission) return;
    try {
      const success = await dbLayer.deleteSubmission(deletingSubmission.id);
      if (success) {
        toast("Form Submission deleted successfully");
        setDeletingSubmission(null);
        loadData();
      } else {
        toast("Failed to delete record", "error");
      }
    } catch (err) {
      toast("Delete action failed", "error");
    }
  };

  // Filter computation
  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === "all" || item.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl select-none relative">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Form Submissions
          </h1>
          <p className="text-sm font-light text-slate-400 mt-1 max-w-md">
            Complete database of your customers project files and draft reports.
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

      {/* Advanced Filter controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        {/* Status Tab buttons */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl shadow-sm">
          {(["all", "draft", "completed", "pdf_generated"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer select-none ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {tab === "all" ? "All Submissions" : tab.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dynamic Text Search input field */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card/40 backdrop-blur-md border border-white/5 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl outline-none text-xs font-normal text-slate-100 placeholder-slate-500 transition hover:border-white/10"
            placeholder="Search Project, Name, Email..."
          />
        </div>
      </div>

      {/* Database Listing Card Table */}
      <div className="rounded-2xl glassmorphism border border-white/5 p-6 sm:p-8 relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-44">
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-xs font-normal text-slate-400">Refreshing list...</span>
            </div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-52 border border-dashed border-white/10 rounded-xl gap-4 p-6 text-center">
            <Files className="w-10 h-10 text-slate-600 animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-slate-300">No matching files</p>
              <p className="text-xs font-light text-slate-400 mt-0.5 max-w-xs leading-relaxed">
                We could not locate any records matching the provided criteria. Try expanding search or tab parameters.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto select-none">
            <table className="w-full text-left border-collapse border-spacing-0">
              <thead>
                <tr className="border-b border-white/5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <th className="py-4 px-4">Project Overview</th>
                  <th className="py-4 px-4">Client Detail</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Generated At</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubmissions.map((sub) => (
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
                          View
                        </Link>
                        <button
                          onClick={() => handleDownloadPDF(sub)}
                          className="text-xs font-semibold text-white bg-primary/20 hover:bg-primary/40 border border-primary/40 hover:border-primary/60 px-3 py-2 rounded-xl transition flex items-center gap-1.5 backdrop-blur-md"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                        <button
                          onClick={() => setDeletingSubmission(sub)}
                          className="text-xs font-semibold text-rose-300 bg-rose-950/20 hover:bg-rose-900/40 border border-rose-800/40 hover:border-rose-700/60 p-2 rounded-xl transition"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Confirmation Deletion trigger modal */}
      {deletingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 select-none animate-fade-in">
          <div className="bg-card border border-white/10 p-6 sm:p-8 rounded-2xl max-w-sm w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-100">Confirm Deletion</h3>
              </div>
              <button
                onClick={() => setDeletingSubmission(null)}
                className="text-slate-400 hover:text-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-light text-slate-400 leading-relaxed">
              Are you sure you wish to permanently delete the <b className="text-slate-200">{deletingSubmission.project_title}</b> record?
              This operation cannot be reversed.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeletingSubmission(null)}
                className="flex-1 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl transition text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40"
              >
                <Trash2 className="w-4 h-4" />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
