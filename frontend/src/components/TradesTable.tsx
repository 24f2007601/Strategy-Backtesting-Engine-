"use client";

import React from "react";
import { TradeRecord } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, History } from "lucide-react";

interface TradesTableProps {
  trades: TradeRecord[];
}

export const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {
  if (trades.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center text-slate-500 dark:text-zinc-500 flex flex-col items-center justify-center">
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 mb-3">
          <History className="w-8 h-8 opacity-40 text-slate-500 dark:text-zinc-400" />
        </div>
        <p className="text-xs font-bold text-slate-800 dark:text-zinc-300">No trades executed during this backtest timeframe.</p>
        <p className="text-[11px] text-slate-600 dark:text-zinc-500 mt-1">Try adjusting strategy parameters or widening date range.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Table Header */}
      <div className="p-3.5 bg-slate-100/90 dark:bg-zinc-950/70 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">Trade Execution History Log</span>
            <span className="ml-2 text-[10px] text-slate-600 dark:text-zinc-400 font-mono font-bold">({trades.length} Total Executions)</span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-200 dark:bg-zinc-900/80 text-slate-800 dark:text-zinc-300 border border-slate-300 dark:border-white/5">
          All Orders Filled
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1 max-h-[380px]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-200/90 dark:bg-zinc-950/80 backdrop-blur-md text-slate-800 dark:text-zinc-400 border-b border-slate-300 dark:border-white/5 text-[10px] uppercase tracking-wider sticky top-0 z-10">
            <tr>
              <th className="py-2.5 px-4 font-bold">#</th>
              <th className="py-2.5 px-4 font-bold">Date & Time</th>
              <th className="py-2.5 px-4 font-bold">Action</th>
              <th className="py-2.5 px-4 font-bold">Executed Price</th>
              <th className="py-2.5 px-4 font-bold">Shares / Units</th>
              <th className="py-2.5 px-4 font-bold">Trading Fee</th>
              <th className="py-2.5 px-4 text-right font-bold">Portfolio Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-800 dark:text-zinc-300">
            {trades.map((t) => (
              <tr key={t.id} className="hover:bg-slate-100/70 dark:hover:bg-white/[0.03] transition-colors duration-150">
                <td className="py-2.5 px-4 text-slate-600 dark:text-zinc-500 font-bold">{t.id}</td>
                <td className="py-2.5 px-4 text-slate-800 dark:text-zinc-300 font-medium">{t.date}</td>
                <td className="py-2.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold ${
                      t.type === "BUY"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                        : "bg-rose-100 text-rose-800 border border-rose-300 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30"
                    }`}
                  >
                    {t.type === "BUY" ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-rose-700 dark:text-red-400" />
                    )}
                    {t.type}
                  </span>
                </td>
                <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-zinc-100">${t.price.toLocaleString()}</td>
                <td className="py-2.5 px-4 text-slate-700 dark:text-zinc-400 font-medium">{t.shares}</td>
                <td className="py-2.5 px-4 text-amber-700 dark:text-amber-400/90 font-bold">${t.fee.toLocaleString()}</td>
                <td className="py-2.5 px-4 text-right font-black text-slate-900 dark:text-zinc-100">
                  ${t.value.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
