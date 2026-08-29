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
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
        <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-xs">No trades executed during this backtest period.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      <div className="p-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-xs text-zinc-200">Trade Execution History Log</span>
        </div>
        <span className="text-xs text-zinc-400 font-mono">{trades.length} Trades</span>
      </div>

      <div className="overflow-x-auto flex-1 max-h-[380px]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800 text-[11px] uppercase tracking-wider sticky top-0">
            <tr>
              <th className="py-2.5 px-4">#</th>
              <th className="py-2.5 px-4">Date</th>
              <th className="py-2.5 px-4">Action</th>
              <th className="py-2.5 px-4">Execution Price</th>
              <th className="py-2.5 px-4">Shares / Units</th>
              <th className="py-2.5 px-4 text-right">Portfolio Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {trades.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-900/40 transition">
                <td className="py-2 px-4 text-zinc-500">{t.id}</td>
                <td className="py-2 px-4 text-zinc-300">{t.date}</td>
                <td className="py-2 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.type === "BUY"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {t.type === "BUY" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {t.type}
                  </span>
                </td>
                <td className="py-2 px-4 font-semibold">${t.price.toLocaleString()}</td>
                <td className="py-2 px-4">{t.shares}</td>
                <td className="py-2 px-4 text-right font-bold text-zinc-100">
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
