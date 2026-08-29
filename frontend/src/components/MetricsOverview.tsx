"use client";

import React from "react";
import { MetricSummary } from "@/lib/types";
import { TrendingUp, ShieldAlert, Award, Target, Scale, Zap, DollarSign } from "lucide-react";

interface MetricsOverviewProps {
  metrics: MetricSummary;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics }) => {
  const isPositiveReturn = metrics.total_return_pct >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
      {/* 1. Total Return */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-400">Total Return</span>
          <TrendingUp className={`w-3.5 h-3.5 ${isPositiveReturn ? "text-emerald-400" : "text-red-400"}`} />
        </div>
        <div className="mt-2">
          <p className={`text-base font-extrabold font-mono ${isPositiveReturn ? "text-emerald-400" : "text-red-400"}`}>
            {metrics.total_return_pct >= 0 ? "+" : ""}{metrics.total_return_pct}%
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Bench: {metrics.benchmark_return_pct >= 0 ? "+" : ""}{metrics.benchmark_return_pct}%
          </p>
        </div>
      </div>

      {/* 2. CAGR */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-400">CAGR (Annual)</span>
          <Award className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div className="mt-2">
          <p className="text-base font-extrabold font-mono text-zinc-100">
            {metrics.annualized_return_cagr >= 0 ? "+" : ""}{metrics.annualized_return_cagr}%
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Annualized Return</p>
        </div>
      </div>

      {/* 3. Sharpe Ratio */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-400">Sharpe Ratio</span>
          <Scale className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <div className="mt-2">
          <p className="text-base font-extrabold font-mono text-purple-400">
            {metrics.sharpe_ratio}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            {metrics.sharpe_ratio > 1.0 ? "Great Risk Adj." : "Moderate Risk"}
          </p>
        </div>
      </div>

      {/* 4. Max Drawdown */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-400">Max Drawdown</span>
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
        </div>
        <div className="mt-2">
          <p className="text-base font-extrabold font-mono text-red-400">
            -{metrics.max_drawdown_pct}%
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Peak-to-Trough Risk</p>
        </div>
      </div>

      {/* 5. Win Rate */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-400">Win Rate</span>
          <Target className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="mt-2">
          <p className="text-base font-extrabold font-mono text-emerald-400">
            {metrics.win_rate_pct}%
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">{metrics.total_trades} Executed Trades</p>
        </div>
      </div>

      {/* 6. Total Fees Paid */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-400">Total Fees</span>
          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="mt-2">
          <p className="text-base font-extrabold font-mono text-amber-400">
            ${metrics.total_fees_paid.toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Comm + Slippage</p>
        </div>
      </div>

      {/* 7. Final Portfolio Value */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-400">Final Equity</span>
          <span className="text-[10px] font-mono text-zinc-500">USD</span>
        </div>
        <div className="mt-2">
          <p className="text-base font-extrabold font-mono text-zinc-100">
            ${metrics.final_portfolio_value.toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Start: ${metrics.initial_capital.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
