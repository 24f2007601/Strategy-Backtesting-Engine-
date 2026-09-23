"use client";

import React from "react";
import { Calendar, Clock, DollarSign, Percent, SlidersHorizontal } from "lucide-react";

interface BacktestControlsProps {
  startDate: string;
  onChangeStartDate: (date: string) => void;
  endDate: string;
  onChangeEndDate: (date: string) => void;
  interval: string;
  onChangeInterval: (interval: string) => void;
  initialCapital: number;
  onChangeCapital: (capital: number) => void;
  commissionPct: number;
  onChangeCommission: (commission: number) => void;
  slippagePct: number;
  onChangeSlippage: (slippage: number) => void;
}

const TIMEFRAME_OPTIONS = [
  { value: "1d", label: "1 Day (Daily)" },
  { value: "1wk", label: "1 Week" },
  { value: "1mo", label: "1 Month" },
  { value: "1h", label: "1 Hour (Intraday)" },
  { value: "15m", label: "15 Minutes" },
  { value: "5m", label: "5 Minutes" },
];

export const BacktestControls: React.FC<BacktestControlsProps> = ({
  startDate,
  onChangeStartDate,
  endDate,
  onChangeEndDate,
  interval,
  onChangeInterval,
  initialCapital,
  onChangeCapital,
  commissionPct,
  onChangeCommission,
  slippagePct,
  onChangeSlippage,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-3 border-t border-slate-200 dark:border-white/5 text-xs">
      {/* 1. Start Date */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-slate-700 dark:text-zinc-400 font-bold flex items-center gap-1.5 text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-500" /> Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChangeStartDate(e.target.value)}
          className="bg-white dark:glass-input border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-slate-900 dark:text-zinc-200 font-mono focus:outline-none focus:border-emerald-500 shadow-sm text-xs"
        />
      </div>

      {/* 2. End Date */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-slate-700 dark:text-zinc-400 font-bold flex items-center gap-1.5 text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-500" /> End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChangeEndDate(e.target.value)}
          className="bg-white dark:glass-input border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-slate-900 dark:text-zinc-200 font-mono focus:outline-none focus:border-emerald-500 shadow-sm text-xs"
        />
      </div>

      {/* 3. Timeframe Interval */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-slate-700 dark:text-zinc-400 font-bold flex items-center gap-1.5 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Timeframe
        </label>
        <select
          value={interval}
          onChange={(e) => onChangeInterval(e.target.value)}
          className="bg-white dark:glass-input border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-slate-900 dark:text-zinc-200 font-mono focus:outline-none cursor-pointer shadow-sm text-xs font-semibold"
        >
          {TIMEFRAME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-200">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Initial Capital */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-slate-700 dark:text-zinc-400 font-bold flex items-center gap-1.5 text-[11px]">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Capital ($)
        </label>
        <input
          type="number"
          value={initialCapital}
          onChange={(e) => onChangeCapital(Number(e.target.value))}
          className="bg-white dark:glass-input border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-slate-900 dark:text-zinc-200 font-mono focus:outline-none focus:border-emerald-500 shadow-sm text-xs"
        />
      </div>

      {/* 5. Commission % */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-slate-700 dark:text-zinc-400 font-bold flex items-center gap-1.5 text-[11px]">
          <Percent className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Commission (%)
        </label>
        <input
          type="number"
          step="0.01"
          value={commissionPct}
          onChange={(e) => onChangeCommission(Number(e.target.value))}
          className="bg-white dark:glass-input border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-slate-900 dark:text-zinc-200 font-mono focus:outline-none focus:border-emerald-500 shadow-sm text-xs"
        />
      </div>

      {/* 6. Slippage % */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-slate-700 dark:text-zinc-400 font-bold flex items-center gap-1.5 text-[11px]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Slippage (%)
        </label>
        <input
          type="number"
          step="0.01"
          value={slippagePct}
          onChange={(e) => onChangeSlippage(Number(e.target.value))}
          className="bg-white dark:glass-input border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-slate-900 dark:text-zinc-200 font-mono focus:outline-none focus:border-emerald-500 shadow-sm text-xs"
        />
      </div>
    </div>
  );
};
