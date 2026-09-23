"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { TickerSelector } from "@/components/TickerSelector";
import { BacktestControls } from "@/components/BacktestControls";
import { CodeEditor } from "@/components/CodeEditor";
import { CandlestickChart } from "@/components/CandlestickChart";
import { EquityChart } from "@/components/EquityChart";
import { MetricsOverview } from "@/components/MetricsOverview";
import { TradesTable } from "@/components/TradesTable";
import { ConsoleViewer } from "@/components/ConsoleViewer";
import { fetchGlobalIndices, DEFAULT_INDICES } from "@/lib/api";
import { TickerInfo } from "@/lib/types";
import { useTheme } from "@/hooks/useTheme";
import { useBacktest } from "@/hooks/useBacktest";
import { BarChart3, LineChart, History, Terminal, AlertCircle } from "lucide-react";

type ActiveTab = "candlesticks" | "equity" | "trades" | "logs";

export default function Home() {
  const [indices, setIndices] = useState<TickerInfo[]>(DEFAULT_INDICES);
  const [activeTab, setActiveTab] = useState<ActiveTab>("candlesticks");
  const { theme, toggleTheme } = useTheme();

  const {
    selectedTicker,
    setSelectedTicker,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    interval,
    setInterval,
    initialCapital,
    setInitialCapital,
    commissionPct,
    setCommissionPct,
    slippagePct,
    setSlippagePct,
    strategyType,
    setStrategyType,
    pythonCode,
    setPythonCode,
    shortWindow,
    setShortWindow,
    longWindow,
    setLongWindow,
    rsiPeriod,
    setRsiPeriod,
    isLoading,
    errorMsg,
    backtestResult,
    executeBacktest,
  } = useBacktest();

  useEffect(() => {
    fetchGlobalIndices().then(setIndices);
  }, []);

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-gradient-to-br from-slate-100 via-slate-50 to-sky-50/50 text-slate-900"
          : "bg-[#060709] text-zinc-100"
      } font-sans antialiased selection:bg-emerald-500/25 relative overflow-hidden flex flex-col transition-colors duration-300`}
    >
      {/* Dynamic Ambient Background Mesh Blobs */}
      <div className={`ambient-blob w-[600px] h-[600px] ${theme === "light" ? "bg-emerald-400/25" : "bg-emerald-600/15"} top-[-100px] left-[-100px]`} />
      <div className={`ambient-blob w-[500px] h-[500px] ${theme === "light" ? "bg-sky-400/20" : "bg-cyan-600/12"} top-[20%] right-[-150px]`} />
      <div className={`ambient-blob w-[650px] h-[650px] ${theme === "light" ? "bg-indigo-300/20" : "bg-purple-600/10"} bottom-[-150px] left-[25%]`} />

      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="relative z-10 flex-1 max-w-[1600px] w-full mx-auto px-4 py-3 space-y-4">
        {/* Top Control Bar: Ticker Selection & Parameters */}
        <div className="glass-panel rounded-2xl p-4 space-y-3.5 transition-all duration-300">
          <TickerSelector
            indices={indices}
            selectedTicker={selectedTicker}
            onSelectTicker={setSelectedTicker}
          />
          <BacktestControls
            startDate={startDate}
            onChangeStartDate={setStartDate}
            endDate={endDate}
            onChangeEndDate={setEndDate}
            interval={interval}
            onChangeInterval={setInterval}
            initialCapital={initialCapital}
            onChangeCapital={setInitialCapital}
            commissionPct={commissionPct}
            onChangeCommission={setCommissionPct}
            slippagePct={slippagePct}
            onChangeSlippage={setSlippagePct}
          />
        </div>

        {/* Error Glass Banner */}
        {errorMsg && (
          <div className="bg-rose-50 dark:glass-card border border-rose-300 dark:border-red-500/30 text-rose-800 dark:text-red-300 rounded-2xl p-4 flex items-center gap-3 text-xs shadow-lg">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-red-500/10 border border-rose-300 dark:border-red-500/20 text-rose-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            </div>
            <div>
              <p className="font-bold text-rose-900 dark:text-red-200">Backtest Execution Error</p>
              <p className="text-rose-700 dark:text-red-300/90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Main Workbench Layout: Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Monaco Python IDE */}
          <div className="lg:col-span-5 h-[650px]">
            <CodeEditor
              theme={theme}
              strategyType={strategyType}
              pythonCode={pythonCode}
              onChangeCode={setPythonCode}
              onSelectStrategy={setStrategyType}
              onRunBacktest={executeBacktest}
              isLoading={isLoading}
              shortWindow={shortWindow}
              longWindow={longWindow}
              onChangeShortWindow={setShortWindow}
              onChangeLongWindow={setLongWindow}
              rsiPeriod={rsiPeriod}
              onChangeRsiPeriod={setRsiPeriod}
            />
          </div>

          {/* Right Column: Results & Charts */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {backtestResult && <MetricsOverview metrics={backtestResult.metrics} />}

            {/* Chart & Analysis Tabs Container */}
            <div className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden shadow-2xl min-h-[510px]">
              {/* Tab Navigation Header */}
              <div className="bg-slate-100/90 dark:bg-zinc-950/70 p-2.5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("candlesticks")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all duration-200 shadow-sm ${
                      activeTab === "candlesticks"
                        ? "bg-white dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-slate-300 dark:border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-extrabold"
                        : "text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-200 hover:bg-slate-200/70 dark:hover:bg-white/10"
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Candlestick & Trades
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("equity")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all duration-200 shadow-sm ${
                      activeTab === "equity"
                        ? "bg-white dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-slate-300 dark:border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-extrabold"
                        : "text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-200 hover:bg-slate-200/70 dark:hover:bg-white/10"
                    }`}
                  >
                    <LineChart className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Equity Curve & Drawdown
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("trades")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all duration-200 shadow-sm ${
                      activeTab === "trades"
                        ? "bg-white dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-slate-300 dark:border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-extrabold"
                        : "text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-200 hover:bg-slate-200/70 dark:hover:bg-white/10"
                    }`}
                  >
                    <History className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    Trades Log ({backtestResult?.trades.length || 0})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("logs")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all duration-200 shadow-sm ${
                      activeTab === "logs"
                        ? "bg-white dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-slate-300 dark:border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)] font-extrabold"
                        : "text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-200 hover:bg-slate-200/70 dark:hover:bg-white/10"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Console
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="p-3 flex-1 flex flex-col">
                {activeTab === "candlesticks" && backtestResult && (
                  <CandlestickChart
                    theme={theme}
                    candlesticks={backtestResult.candlesticks}
                    trades={backtestResult.trades}
                    ticker={backtestResult.ticker}
                    tickerName={backtestResult.ticker_name}
                  />
                )}

                {activeTab === "equity" && backtestResult && (
                  <EquityChart theme={theme} equityCurve={backtestResult.equity_curve} />
                )}

                {activeTab === "trades" && backtestResult && (
                  <TradesTable trades={backtestResult.trades} />
                )}

                {activeTab === "logs" && backtestResult && (
                  <ConsoleViewer logs={backtestResult.logs} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
