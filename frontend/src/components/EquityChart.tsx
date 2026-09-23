"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { EquityDataPoint } from "@/lib/types";
import { LineChart as LineChartIcon, Activity } from "lucide-react";

interface EquityChartProps {
  theme?: "dark" | "light";
  equityCurve: EquityDataPoint[];
}

export const EquityChart: React.FC<EquityChartProps> = ({ theme = "dark", equityCurve }) => {
  if (equityCurve.length === 0) return null;

  const isLight = theme === "light";

  return (
    <div className="flex flex-col h-full glass-card rounded-2xl overflow-hidden shadow-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80 dark:border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
            <LineChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 tracking-tight">Portfolio Performance vs Benchmark</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">Strategy Equity Growth vs Buy & Hold Benchmark with Drawdown Profile</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {equityCurve.length} Data Points
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full flex-1 min-h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={equityCurve} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="equityLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.04)"} />

            <XAxis
              dataKey="date"
              stroke={isLight ? "#94a3b8" : "#52525b"}
              tick={{ fontSize: 11, fill: isLight ? "#334155" : "#71717a" }}
              tickFormatter={(val) => val.slice(0, 7)}
            />

            <YAxis
              yAxisId="equity"
              stroke={isLight ? "#94a3b8" : "#52525b"}
              tick={{ fontSize: 11, fill: isLight ? "#334155" : "#71717a" }}
              domain={["auto", "auto"]}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />

            <YAxis
              yAxisId="drawdown"
              orientation="right"
              stroke="#f43f5e"
              tick={{ fontSize: 11, fill: "#f43f5e" }}
              domain={[0, "auto"]}
              tickFormatter={(val) => `-${val}%`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(10, 12, 18, 0.85)",
                backdropFilter: "blur(16px)",
                borderColor: isLight ? "rgba(226, 232, 240, 0.9)" : "rgba(255, 255, 255, 0.12)",
                borderRadius: "1rem",
                boxShadow: isLight ? "0 16px 32px 0 rgba(15, 23, 42, 0.1)" : "0 16px 32px 0 rgba(0, 0, 0, 0.5)",
                fontSize: "12px",
                color: isLight ? "#0f172a" : "#f4f4f5",
                padding: "10px 14px",
              }}
              formatter={(value: any, name: any) => {
                if (name === "Strategy Equity") return [`$${Number(value).toLocaleString()}`, name];
                if (name === "Benchmark (Buy & Hold)") return [`$${Number(value).toLocaleString()}`, name];
                if (name === "Drawdown %") return [`-${Number(value).toFixed(2)}%`, name];
                return [value, name];
              }}
            />

            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />

            <Area
              yAxisId="drawdown"
              type="monotone"
              dataKey="drawdown_pct"
              name="Drawdown %"
              fill="url(#drawdownGradient)"
              stroke="#f43f5e"
              strokeWidth={1.5}
            />

            <Line
              yAxisId="equity"
              type="monotone"
              dataKey="strategy_value"
              name="Strategy Equity"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
            />

            <Line
              yAxisId="equity"
              type="monotone"
              dataKey="benchmark_value"
              name="Benchmark (Buy & Hold)"
              stroke="#38bdf8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
