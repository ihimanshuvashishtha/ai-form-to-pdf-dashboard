"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-50 pointer-events-none animate-fade-in select-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const bgStyles = {
    success: "bg-emerald-950/80 border-emerald-500/50 text-emerald-200",
    error: "bg-rose-950/80 border-rose-500/50 text-rose-200",
    info: "bg-indigo-950/80 border-indigo-500/50 text-indigo-200",
  }[toast.type];

  return (
    <div
      className={`p-4 rounded-xl border backdrop-blur-md shadow-2xl flex justify-between items-center max-w-sm min-w-[280px] pointer-events-auto transition-all duration-300 transform scale-100 ease-out select-none animate-bounce-in ${bgStyles}`}
    >
      <div className="text-sm font-medium pr-4">{toast.message}</div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-lg opacity-60 hover:opacity-100 transition focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
