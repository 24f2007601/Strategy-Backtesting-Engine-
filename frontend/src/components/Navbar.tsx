"use client";

import React from "react";
import { Activity, LineChart, Code2, Globe, Cpu } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-zinc-100 tracking-tight">QuantStudio</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                PRO ENGINE
              </span>
            </div>
            <p className="text-xs text-zinc-400">Global Strategy Backtester & Code IDE</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-4 text-xs font-medium text-zinc-400">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Global Indices Enabled</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Python Sandbox Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
