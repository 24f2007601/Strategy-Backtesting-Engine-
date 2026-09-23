"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { TickerSelector } from "@/components/TickerSelector";
import { CodeEditor } from "@/components/CodeEditor";
import { CandlestickChart } from "@/components/CandlestickChart";
import { EquityChart } from "@/components/EquityChart";
import { MetricsOverview } from "@/components/MetricsOverview";
import { TradesTable } from "@/components/TradesTable";
import { fetchGlobalIndices, runBacktestApi, DEFAULT_INDICES } from "@/lib/api";
import { BacktestRequest, BacktestResponse, TickerInfo } from "@/lib/types";
import {
  BarChart3,
  LineChart,
  History,
  Terminal,
  Calendar,
  DollarSign,
  AlertCircle,
  Percent,
  SlidersHorizontal,
  Clock,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [indices, setIndices] = useState<TickerInfo[]>(DEFAULT_INDICES);
  const [selectedTicker, setSelectedTicker] = useState("^GSPC");
  const [startDate, setStartDate] = useState("2022-01-01");
  const [endDate, setEndDate] = useState("2024-01-01");
  const [interval, setInterval] = useState("1d");
  const [initialCapital, setInitialCapital] = useState(10000);
  const [commissionPct, setCommissionPct] = useState(0.1);
  const [slippagePct, setSlippagePct] = useState(0.05);

  const [strategyType, setStrategyType] = useState<"custom_code" | "sma_crossover" | "rsi" | "momentum">("sma_crossover");
  const [pythonCode, setPythonCode] = useState(
    `# Dual Moving Average Crossover Strategy\ndef generate_signals(df):\n    short_window = 20\n    long_window = 50\n    \n    sma_short = df['Close'].rolling(window=short_window).mean()\n    sma_long = df['Close'].rolling(window=long_window).mean()\n    \n    signals = pd.Series(0, index=df.index)\n    signals[sma_short > sma_long] = 1   # BUY Signal\n    signals[sma_short < sma_long] = -1  # SELL Signal\n    return signals\n`
  );
  const [shortWindow, setShortWindow] = useState(20);
  const [longWindow, setLongWindow] = useState(50);
  const [rsiPeriod, setRsiPeriod] = useState(14);

  const [activeTab, setActiveTab] = useState<"candlesticks" | "equity" | "trades" | "logs">("candlesticks");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResponse | null>(null);

  // Load indices catalog on initial load
  useEffect(() => {
    fetchGlobalIndices().then(setIndices);
  }, []);

  // Run backtest
  const handleRunBacktest = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const payload: BacktestRequest = {
      ticker: selectedTicker,
      start_date: startDate,
      end_date: endDate,
      interval: interval,
      initial_capital: initialCapital,
      commission_pct: commissionPct,
      slippage_pct: slippagePct,
      strategy_type: strategyType,
      python_code: pythonCode,
      short_window: shortWindow,
      long_window: longWindow,
      rsi_period: rsiPeriod,
      rsi_overbought: 70,
      rsi_oversold: 30,
    };

    try {
      const res = await runBacktestApi(payload);
      setBacktestResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to execute backtest.");
    } finally {
      setIsLoading(false);
    }
  };

  // Run backtest automatically on initial page mount
  useEffect(() => {
    handleRunBacktest();
  }, []);

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 font-sans antialiased selection:bg-emerald-500/25 selection:text-emerald-200 relative overflow-hidden flex flex-col">
      {/* Dynamic Ambient Background Mesh Blobs */}
      <div className="ambient-blob w-[600px] h-[600px] bg-emerald-600/15 top-[-100px] left-[-100px]" />
      <div className="ambient-blob w-[500px] h-[500px] bg-cyan-600/12 top-[20%] right-[-150px]" />
      <div className="ambient-blob w-[650px] h-[650px] bg-purple-600/10 bottom-[-150px] left-[25%]" />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-[1600px] w-full mx-auto px-4 py-3 space-y-4">
        {/* Top Control Bar: Ticker Selection, Timeframe & Parameters */}
        <div className="glass-panel rounded-2xl p-4 space-y-3.5 transition-all duration-300">
          <TickerSelector
            indices={indices}
            selectedTicker={selectedTicker}
            onSelectTicker={(ticker) => {
              setSelectedTicker(ticker);
            }}
          />

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-3 border-t border-white/5 text-xs">
            {/* Start Date */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-zinc-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="glass-input rounded-xl px-3 py-1.5 text-zinc-200 font-mono focus:outline-none"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-zinc-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" /> End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="glass-input rounded-xl px-3 py-1.5 text-zinc-200 font-mono focus:outline-none"
              />
            </div>

            {/* Timeframe Interval */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-zinc-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Timeframe
              </label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="glass-input rounded-xl px-3 py-1.5 text-zinc-200 font-mono focus:outline-none cursor-pointer"
              >
                <option value="1d" className="bg-zinc-950 text-zinc-200">1 Day (Daily)</option>
                <option value="1wk" className="bg-zinc-950 text-zinc-200">1 Week</option>
                <option value="1mo" className="bg-zinc-950 text-zinc-200">1 Month</option>
                <option value="1h" className="bg-zinc-950 text-zinc-200">1 Hour (Intraday)</option>
                <option value="15m" className="bg-zinc-950 text-zinc-200">15 Minutes</option>
                <option value="5m" className="bg-zinc-950 text-zinc-200">5 Minutes</option>
              </select>
            </div>

            {/* Initial Capital */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-zinc-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Capital ($)
              </label>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="glass-input rounded-xl px-3 py-1.5 text-zinc-200 font-mono focus:outline-none"
              />
            </div>

            {/* Commission % */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-zinc-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <Percent className="w-3.5 h-3.5 text-amber-400" /> Commission (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={commissionPct}
                onChange={(e) => setCommissionPct(Number(e.target.value))}
                className="glass-input rounded-xl px-3 py-1.5 text-zinc-200 font-mono focus:outline-none"
              />
            </div>

            {/* Slippage % */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-zinc-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" /> Slippage (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={slippagePct}
                onChange={(e) => setSlippagePct(Number(e.target.value))}
                className="glass-input rounded-xl px-3 py-1.5 text-zinc-200 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Error Glass Banner */}
        {errorMsg && (
          <div className="glass-card border-red-500/30 text-red-300 rounded-2xl p-4 flex items-center gap-3 text-xs shadow-lg shadow-red-950/20">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            </div>
            <div>
              <p className="font-bold text-red-200">Backtest Execution Error</p>
              <p className="text-red-300/90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Main Workbench Layout: Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Monaco Python IDE (5 Cols) */}
          <div className="lg:col-span-5 h-[650px]">
            <CodeEditor
              strategyType={strategyType}
              pythonCode={pythonCode}
              onChangeCode={setPythonCode}
              onSelectStrategy={setStrategyType}
              onRunBacktest={handleRunBacktest}
              isLoading={isLoading}
              shortWindow={shortWindow}
              longWindow={longWindow}
              onChangeShortWindow={setShortWindow}
              onChangeLongWindow={setLongWindow}
              rsiPeriod={rsiPeriod}
              onChangeRsiPeriod={setRsiPeriod}
            />
          </div>

          {/* Right Column: Results & Charts (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Quantitative Metrics Summary Stat Cards */}
            {backtestResult && <MetricsOverview metrics={backtestResult.metrics} />}

            {/* Chart & Analysis Tabs Container */}
            <div className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden shadow-2xl min-h-[510px]">
              {/* Tab Navigation Header */}
              <div className="bg-zinc-950/70 p-2.5 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("candlesticks")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
                      activeTab === "candlesticks"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Candlestick & Trades
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("equity")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
                      activeTab === "equity"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    <LineChart className="w-3.5 h-3.5" />
                    Equity Curve & Drawdown
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("trades")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
                      activeTab === "trades"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    Trades Log ({backtestResult?.trades.length || 0})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("logs")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
                      activeTab === "logs"
                        ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Console
                  </button>
                </div>
              </div>

              {/* Tab View Contents */}
              <div className="p-3 flex-1 flex flex-col">
                {activeTab === "candlesticks" && backtestResult && (
                  <CandlestickChart
                    candlesticks={backtestResult.candlesticks}
                    trades={backtestResult.trades}
                    ticker={backtestResult.ticker}
                    tickerName={backtestResult.ticker_name}
                  />
                )}

                {activeTab === "equity" && backtestResult && (
                  <EquityChart equityCurve={backtestResult.equity_curve} />
                )}

                {activeTab === "trades" && backtestResult && (
                  <TradesTable trades={backtestResult.trades} />
                )}

                {activeTab === "logs" && backtestResult && (
                  <div className="glass-card rounded-2xl p-4 font-mono text-xs text-zinc-300 flex-1 overflow-y-auto space-y-1.5 max-h-[440px]">
                    {backtestResult.logs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className="text-zinc-600 select-none">[{idx + 1}]</span>
                        <span
                          className={
                            log.includes("CRITICAL") || log.includes("ERROR")
                              ? "text-red-400 font-semibold"
                              : log.includes("Complete")
                              ? "text-emerald-400 font-semibold"
                              : log.includes("Executing") || log.includes("Loaded")
                              ? "text-cyan-300"
                              : "text-zinc-300"
                          }
                        >
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
