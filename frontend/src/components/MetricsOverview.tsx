"use client";

import React from "react";
import { MetricSummary } from "@/lib/types";
import { TrendingUp, ShieldAlert, Award, Target, Scale, DollarSign, Wallet } from "lucide-react";

interface MetricsOverviewProps {
  metrics: MetricSummary;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics }) => {
  const isPositiveReturn = metrics.total_return_pct >= 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
      {/* 1. Total Return */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-slate-200 dark:border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Total Return</span>
          <div className={`p-1.5 rounded-lg border ${isPositiveReturn ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" : "bg-rose-100 dark:bg-red-500/10 text-rose-700 dark:text-red-400 border-rose-200 dark:border-red-500/20"}`}>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className={`text-xl font-black font-mono tracking-tight ${isPositiveReturn ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {metrics.total_return_pct >= 0 ? "+" : ""}{metrics.total_return_pct}%
          </p>
          <p className="text-[10px] text-slate-600 dark:text-zinc-400 mt-1 font-medium">
            Bench: <span className="text-slate-800 dark:text-zinc-200 font-mono font-bold">{metrics.benchmark_return_pct >= 0 ? "+" : ""}{metrics.benchmark_return_pct}%</span>
          </p>
        </div>
      </div>

      {/* 2. CAGR */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-slate-200 dark:border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">CAGR</span>
          <div className="p-1.5 rounded-lg border bg-sky-100 dark:bg-cyan-500/10 text-sky-700 dark:text-cyan-400 border-sky-200 dark:border-cyan-500/20">
            <Award className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl font-black font-mono text-slate-900 dark:text-zinc-100 tracking-tight">
            {metrics.annualized_return_cagr >= 0 ? "+" : ""}{metrics.annualized_return_cagr}%
          </p>
          <p className="text-[10px] text-slate-600 dark:text-zinc-400 mt-1 font-medium">Annualized Return</p>
        </div>
      </div>

      {/* 3. Sharpe Ratio */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-slate-200 dark:border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Sharpe Ratio</span>
          <div className="p-1.5 rounded-lg border bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20">
            <Scale className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl font-black font-mono text-purple-700 dark:text-purple-300 tracking-tight">
            {metrics.sharpe_ratio}
          </p>
          <p className="text-[10px] text-slate-600 dark:text-zinc-400 mt-1 font-medium">
            {metrics.sharpe_ratio > 1.0 ? "High Risk-Adjusted" : "Moderate Risk"}
          </p>
        </div>
      </div>

      {/* 4. Max Drawdown */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-slate-200 dark:border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Max Drawdown</span>
          <div className="p-1.5 rounded-lg border bg-rose-100 dark:bg-red-500/10 text-rose-700 dark:text-red-400 border-rose-200 dark:border-red-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl font-black font-mono text-rose-600 dark:text-red-400 tracking-tight">
            -{metrics.max_drawdown_pct}%
          </p>
          <p className="text-[10px] text-slate-600 dark:text-zinc-400 mt-1 font-medium">Peak-to-Trough Risk</p>
        </div>
      </div>

      {/* 5. Win Rate */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-slate-200 dark:border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Win Rate</span>
          <div className="p-1.5 rounded-lg border bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">
            <Target className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
            {metrics.win_rate_pct}%
          </p>
          <p className="text-[10px] text-slate-600 dark:text-zinc-400 mt-1 font-medium">{metrics.total_trades} Executed Trades</p>
        </div>
      </div>

      {/* 6. Total Fees Paid */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-slate-200 dark:border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Total Fees</span>
          <div className="p-1.5 rounded-lg border bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/20">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl font-black font-mono text-amber-700 dark:text-amber-300 tracking-tight">
            ${metrics.total_fees_paid.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-600 dark:text-zinc-400 mt-1 font-medium">Comm + Slippage</p>
        </div>
      </div>

      {/* 7. Final Portfolio Value */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-slate-200 dark:border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Final Equity</span>
          <div className="p-1.5 rounded-lg border bg-slate-200 dark:bg-zinc-800/80 text-slate-800 dark:text-zinc-300 border-slate-300 dark:border-white/10">
            <Wallet className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl font-black font-mono text-slate-900 dark:text-zinc-100 tracking-tight">
            ${metrics.final_portfolio_value.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-600 dark:text-zinc-400 mt-1 font-medium">Start: ${metrics.initial_capital.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
