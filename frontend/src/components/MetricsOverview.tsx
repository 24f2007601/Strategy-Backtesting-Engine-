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
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400">Total Return</span>
          <div className={`p-1 rounded-lg ${isPositiveReturn ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className={`text-lg font-black font-mono tracking-tight ${isPositiveReturn ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "text-red-400"}`}>
            {metrics.total_return_pct >= 0 ? "+" : ""}{metrics.total_return_pct}%
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">
            Bench: <span className="text-zinc-400 font-mono">{metrics.benchmark_return_pct >= 0 ? "+" : ""}{metrics.benchmark_return_pct}%</span>
          </p>
        </div>
      </div>

      {/* 2. CAGR */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400">CAGR</span>
          <div className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Award className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-lg font-black font-mono text-zinc-100 tracking-tight">
            {metrics.annualized_return_cagr >= 0 ? "+" : ""}{metrics.annualized_return_cagr}%
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">Annualized Return</p>
        </div>
      </div>

      {/* 3. Sharpe Ratio */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400">Sharpe Ratio</span>
          <div className="p-1 rounded-lg bg-purple-500/10 text-purple-400">
            <Scale className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-lg font-black font-mono text-purple-300 tracking-tight drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
            {metrics.sharpe_ratio}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">
            {metrics.sharpe_ratio > 1.0 ? "High Risk-Adjusted" : "Moderate Risk"}
          </p>
        </div>
      </div>

      {/* 4. Max Drawdown */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400">Max Drawdown</span>
          <div className="p-1 rounded-lg bg-red-500/10 text-red-400">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-lg font-black font-mono text-red-400 tracking-tight">
            -{metrics.max_drawdown_pct}%
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">Peak-to-Trough Risk</p>
        </div>
      </div>

      {/* 5. Win Rate */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400">Win Rate</span>
          <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Target className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-lg font-black font-mono text-emerald-400 tracking-tight">
            {metrics.win_rate_pct}%
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">{metrics.total_trades} Executed Trades</p>
        </div>
      </div>

      {/* 6. Total Fees Paid */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400">Total Fees</span>
          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-lg font-black font-mono text-amber-300 tracking-tight">
            ${metrics.total_fees_paid.toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">Comm + Slippage</p>
        </div>
      </div>

      {/* 7. Final Portfolio Value */}
      <div className="glass-card glass-card-hover p-3.5 rounded-2xl flex flex-col justify-between border-t border-t-white/15">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400">Final Equity</span>
          <div className="p-1 rounded-lg bg-zinc-800/80 text-zinc-300">
            <Wallet className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-lg font-black font-mono text-zinc-100 tracking-tight">
            ${metrics.final_portfolio_value.toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">Start: ${metrics.initial_capital.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
