"use client";

import React from "react";
import { Activity, Sun, Moon } from "lucide-react";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-2">
      <div className="max-w-[1600px] mx-auto h-16 rounded-2xl glass-panel px-5 flex items-center justify-between transition-all duration-300 shadow-lg">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-300" />
            <div className="relative p-2.5 bg-emerald-600 dark:bg-zinc-950/80 border border-emerald-500/40 rounded-xl text-white dark:text-emerald-400 shadow-inner flex items-center justify-center">
              <Activity className="h-5 w-5 fill-current" />
            </div>
          </div>

          <div>
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-zinc-100 tracking-tight">
              QuantStudio
            </h1>
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 font-medium">
              Quantitative Backtesting Workbench
            </p>
          </div>
        </div>

        {/* Right Section: Status Badge & Glass Theme Toggle */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white dark:glass-card border border-slate-300 dark:border-white/10 text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
            <span className="text-[11px] font-mono text-slate-700 dark:text-zinc-300">Engine Operational</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:glass-card border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-sm"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-zinc-200 hidden xs:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="text-slate-900 hidden xs:inline">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
