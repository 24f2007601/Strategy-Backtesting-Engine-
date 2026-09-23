"use client";

import React from "react";
import { Activity } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-2">
      <div className="max-w-[1600px] mx-auto h-16 rounded-2xl glass-panel px-5 flex items-center justify-between transition-all duration-300">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-300" />
            <div className="relative p-2.5 bg-zinc-950/80 border border-emerald-500/30 rounded-xl text-emerald-400 shadow-inner flex items-center justify-center">
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
          </div>

          <div>
            <h1 className="font-extrabold text-lg text-zinc-100 tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              QuantStudio
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium">
              Quantitative Backtesting Workbench
            </p>
          </div>
        </div>

        {/* Clean Production Status Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl glass-card text-zinc-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
          <span className="text-[11px] font-mono text-zinc-300">Engine Operational</span>
        </div>
      </div>
    </header>
  );
};
