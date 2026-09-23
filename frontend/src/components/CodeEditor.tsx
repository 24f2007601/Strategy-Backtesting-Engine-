"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Code2, Play, BookOpen, ChevronDown, Cpu } from "lucide-react";
import { STRATEGY_CATALOG, StrategyOption } from "@/lib/strategies";

interface CodeEditorProps {
  theme?: "dark" | "light";
  strategyType: "custom_code" | "sma_crossover" | "rsi" | "momentum";
  pythonCode: string;
  onChangeCode: (code: string) => void;
  onSelectStrategy: (strategy: "custom_code" | "sma_crossover" | "rsi" | "momentum") => void;
  onRunBacktest: () => void;
  isLoading: boolean;
  shortWindow: number;
  longWindow: number;
  onChangeShortWindow: (val: number) => void;
  onChangeLongWindow: (val: number) => void;
  rsiPeriod: number;
  onChangeRsiPeriod: (val: number) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  theme = "dark",
  strategyType,
  pythonCode,
  onChangeCode,
  onSelectStrategy,
  onRunBacktest,
  isLoading,
  shortWindow,
  longWindow,
  onChangeShortWindow,
  onChangeLongWindow,
  rsiPeriod,
  onChangeRsiPeriod,
}) => {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("sma_crossover");

  const handleSelectStrategyDropdown = (strategyId: string) => {
    setSelectedStrategyId(strategyId);
    const item = STRATEGY_CATALOG.find((s) => s.id === strategyId);
    if (item) {
      onSelectStrategy(item.presetType || "custom_code");
      onChangeCode(item.code);
    }
  };

  const currentStrategy: StrategyOption =
    STRATEGY_CATALOG.find((s) => s.id === selectedStrategyId) || STRATEGY_CATALOG[0];

  const categories = Array.from(new Set(STRATEGY_CATALOG.map((s) => s.category)));

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Editor Header & Strategy Selector Dropdown */}
      <div className="bg-slate-100/90 dark:bg-zinc-950/80 p-3.5 border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 tracking-tight block">Python Strategy IDE</span>
            <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-mono">Quantitative Algorithm Library</span>
          </div>
        </div>

        {/* 18-Strategy Glass Dropdown Menu */}
        <div className="relative flex items-center gap-2">
          <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 hidden md:flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Strategy Preset:
          </label>

          <div className="relative flex-1 sm:w-[260px]">
            <select
              value={selectedStrategyId}
              onChange={(e) => handleSelectStrategyDropdown(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl pl-3 pr-8 py-1.5 text-xs font-bold text-slate-900 dark:text-emerald-300 focus:outline-none cursor-pointer appearance-none shadow-sm"
            >
              {categories.map((cat) => (
                <optgroup key={cat} label={cat} className="bg-white dark:bg-zinc-950 text-slate-700 dark:text-zinc-400 font-sans">
                  {STRATEGY_CATALOG.filter((s) => s.category === cat).map((strat) => (
                    <option key={strat.id} value={strat.id} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 font-sans py-1">
                      {strat.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-600 dark:text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Selected Strategy Description Banner & Sliders */}
      <div className="bg-slate-50 dark:bg-zinc-950/40 px-4 py-2 border-b border-slate-200 dark:border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-2 text-[11px] text-slate-700 dark:text-zinc-300">
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-mono text-[10px] font-bold">
            {currentStrategy.category}
          </span>
          <span className="text-slate-800 dark:text-zinc-200 font-medium">{currentStrategy.description}</span>
        </div>

        {strategyType === "sma_crossover" && (
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-700 dark:text-zinc-400 font-bold">Short:</span>
              <input
                type="number"
                value={shortWindow}
                onChange={(e) => onChangeShortWindow(Number(e.target.value))}
                className="w-14 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg px-1.5 py-0.5 text-slate-900 dark:text-zinc-100 font-mono text-xs focus:border-emerald-500 shadow-sm"
              />
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-700 dark:text-zinc-400 font-bold">Long:</span>
              <input
                type="number"
                value={longWindow}
                onChange={(e) => onChangeLongWindow(Number(e.target.value))}
                className="w-14 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg px-1.5 py-0.5 text-slate-900 dark:text-zinc-100 font-mono text-xs focus:border-emerald-500 shadow-sm"
              />
            </div>
          </div>
        )}

        {strategyType === "rsi" && (
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="text-slate-700 dark:text-zinc-400 font-bold">Period:</span>
            <input
              type="number"
              value={rsiPeriod}
              onChange={(e) => onChangeRsiPeriod(Number(e.target.value))}
              className="w-14 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg px-1.5 py-0.5 text-slate-900 dark:text-zinc-100 font-mono text-xs focus:border-emerald-500 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Monaco Code Editor Canvas */}
      <div className="flex-1 min-h-[340px] bg-white dark:bg-[#090a0f]">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme={theme === "light" ? "vs" : "vs-dark"}
          value={pythonCode}
          onChange={(value) => onChangeCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 12 },
            fontFamily: "JetBrains Mono, Fira Code, monospace",
          }}
        />
      </div>

      {/* Glass Action Footer */}
      <div className="p-3.5 bg-slate-100/90 dark:bg-zinc-950/80 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-zinc-400 font-mono font-medium">
          <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Python Engine • OHLCV Ready</span>
        </div>

        <button
          type="button"
          onClick={onRunBacktest}
          disabled={isLoading}
          className={`px-5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-all duration-200 shadow-lg ${
            isLoading
              ? "bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed border border-slate-300 dark:border-zinc-700"
              : "bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-black shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isLoading ? "Executing Strategy..." : "Run Backtest"}
        </button>
      </div>
    </div>
  );
};
