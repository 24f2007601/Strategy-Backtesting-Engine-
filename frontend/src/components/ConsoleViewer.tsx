"use client";

import React from "react";

interface ConsoleViewerProps {
  logs: string[];
}

export const ConsoleViewer: React.FC<ConsoleViewerProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-slate-950 rounded-2xl p-6 font-mono text-xs text-zinc-500 flex-1 overflow-y-auto min-h-[400px] flex items-center justify-center border border-slate-800">
        <p>No execution logs available.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs text-zinc-300 flex-1 overflow-y-auto space-y-1.5 max-h-[440px] shadow-inner border border-slate-800">
      {logs.map((log, idx) => (
        <div key={idx} className="flex items-start gap-2.5">
          <span className="text-zinc-500 select-none font-bold">[{idx + 1}]</span>
          <span
            className={
              log.includes("CRITICAL") || log.includes("ERROR")
                ? "text-red-400 font-semibold"
                : log.includes("Complete")
                ? "text-emerald-400 font-semibold"
                : log.includes("Executing") || log.includes("Loaded")
                ? "text-cyan-300 font-medium"
                : "text-zinc-300"
            }
          >
            {log}
          </span>
        </div>
      ))}
    </div>
  );
};
