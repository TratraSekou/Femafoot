"use client"
import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastMessage = {
  id: number;
  message: string;
  type?: "success" | "error";
};

interface ToastContextType {
  toast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto",
              "flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border backdrop-blur-md text-sm font-medium",
              t.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
            )}
          >
            {t.type === "success" && <CheckCircle2 className="h-4 w-4" />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
