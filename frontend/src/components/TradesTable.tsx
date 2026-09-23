"use client";

import React from "react";
import { TradeRecord } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, History, DollarSign } from "lucide-react";

interface TradesTableProps {
  trades: TradeRecord[];
}

export const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {
  if (trades.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center text-zinc-500 flex flex-col items-center justify-center">
        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 mb-3">
          <History className="w-8 h-8 opacity-40 text-zinc-400" />
        </div>
        <p className="text-xs font-medium text-zinc-400">No trades executed during this backtest timeframe.</p>
        <p className="text-[11px] text-zinc-600 mt-1">Try adjusting strategy parameters or widening date range.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Table Header */}
      <div className="p-3.5 bg-zinc-950/70 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-zinc-100">Trade Execution History Log</span>
            <span className="ml-2 text-[10px] text-zinc-400 font-mono">({trades.length} Total Executions)</span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-zinc-900/80 text-zinc-300 border border-white/5">
          All Orders Filled
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1 max-h-[380px]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-950/80 backdrop-blur-md text-zinc-400 border-b border-white/5 text-[10px] uppercase tracking-wider sticky top-0 z-10">
            <tr>
              <th className="py-2.5 px-4 font-semibold">#</th>
              <th className="py-2.5 px-4 font-semibold">Date & Time</th>
              <th className="py-2.5 px-4 font-semibold">Action</th>
              <th className="py-2.5 px-4 font-semibold">Executed Price</th>
              <th className="py-2.5 px-4 font-semibold">Shares / Units</th>
              <th className="py-2.5 px-4 font-semibold">Trading Fee</th>
              <th className="py-2.5 px-4 text-right font-semibold">Portfolio Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {trades.map((t) => (
              <tr key={t.id} className="hover:bg-white/[0.03] transition-colors duration-150">
                <td className="py-2.5 px-4 text-zinc-500 font-bold">{t.id}</td>
                <td className="py-2.5 px-4 text-zinc-300">{t.date}</td>
                <td className="py-2.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold ${
                      t.type === "BUY"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        : "bg-red-500/15 text-red-300 border border-red-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                    }`}
                  >
                    {t.type === "BUY" ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                    {t.type}
                  </span>
                </td>
                <td className="py-2.5 px-4 font-bold text-zinc-100">${t.price.toLocaleString()}</td>
                <td className="py-2.5 px-4 text-zinc-400">{t.shares}</td>
                <td className="py-2.5 px-4 text-amber-400/90">${t.fee.toLocaleString()}</td>
                <td className="py-2.5 px-4 text-right font-extrabold text-zinc-100">
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
