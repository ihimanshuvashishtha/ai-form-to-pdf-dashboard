"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import { useToast } from "@/context/ToastContext";
import { LayoutDashboard, FilePlus2, Files, Sparkles, Settings, LogOut, ChevronRight } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthValid, setIsAuthValid] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      toast("You must be logged in to view the dashboard", "error");
      router.push("/login");
    } else {
      setIsAuthValid(true);
    }
  }, [router, toast]);

  if (!isAuthValid) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutUser();
    toast("Logged out successfully");
    router.push("/login");
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Forms", href: "/dashboard/forms", icon: Files },
    { name: "New Submission", href: "/dashboard/forms/new", icon: FilePlus2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-1 bg-background select-none text-foreground min-h-screen relative">
      {/* Decorative ambient orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-[140px] pointer-events-none" />

      {/* Modern Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-card/40 backdrop-blur-md border-r border-white/5 py-8 px-6 z-20 sticky top-0 h-screen select-none justify-between shadow-lg">
        <div>
          {/* Brand header */}
          <Link href="/dashboard" className="flex items-center gap-3 mb-10 group">
            <div className="p-2.5 bg-primary/15 rounded-xl border border-primary/30 backdrop-blur-md group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-extrabold text-lg tracking-wider text-slate-100">
              Form<span className="text-primary font-light">to</span>PDF
            </span>
          </Link>

          {/* Nav links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between py-3.5 px-4 rounded-xl text-sm font-semibold transition group ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent hover:border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition duration-200 mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Logout Session
        </button>
      </aside>

      {/* Main workspace container */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen px-4 py-8 sm:px-10 sm:py-12 z-10 overflow-y-auto">
        {/* Mobile Header navbar */}
        <header className="flex md:hidden justify-between items-center bg-card/40 backdrop-blur-md border border-white/5 p-4 rounded-xl mb-6 shadow-md select-none">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-2 bg-primary/15 rounded-xl border border-primary/30">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-extrabold text-sm tracking-wide">
              Form<span className="text-primary font-light">to</span>PDF
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold bg-rose-950/40 text-rose-300 py-2 px-3 border border-rose-800/40 rounded-xl hover:bg-rose-900/60 transition"
          >
            Logout
          </button>
        </header>

        {children}
      </main>
    </div>
  );
}
