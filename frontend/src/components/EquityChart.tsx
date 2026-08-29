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

interface EquityChartProps {
  equityCurve: EquityDataPoint[];
}

export const EquityChart: React.FC<EquityChartProps> = ({ equityCurve }) => {
  if (equityCurve.length === 0) return null;

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-zinc-100">Portfolio Performance vs Benchmark</h3>
          <p className="text-xs text-zinc-400">Equity growth over time and drawdown profile</p>
        </div>
      </div>

      <div className="w-full flex-1 min-h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={equityCurve} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              tick={{ fontSize: 11 }}
              tickFormatter={(val) => val.slice(0, 7)}
            />
            <YAxis
              yAxisId="equity"
              stroke="#71717a"
              tick={{ fontSize: 11 }}
              domain={['auto', 'auto']}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="drawdown"
              orientation="right"
              stroke="#ef4444"
              tick={{ fontSize: 11 }}
              domain={[0, 'auto']}
              tickFormatter={(val) => `-${val}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                borderColor: "#27272a",
                borderRadius: "0.5rem",
                fontSize: "12px",
                color: "#f4f4f5",
              }}
              formatter={(value: any, name: any) => {
                if (name === "Strategy Equity") return [`$${Number(value).toLocaleString()}`, name];
                if (name === "Benchmark (Buy & Hold)") return [`$${Number(value).toLocaleString()}`, name];
                if (name === "Drawdown %") return [`-${Number(value).toFixed(2)}%`, name];
                return [value, name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            <Area
              yAxisId="drawdown"
              type="monotone"
              dataKey="drawdown_pct"
              name="Drawdown %"
              fill="url(#drawdownGradient)"
              stroke="#ef4444"
              strokeWidth={1}
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
              stroke="#3b82f6"
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
