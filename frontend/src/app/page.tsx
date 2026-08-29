"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { TickerSelector } from "@/components/TickerSelector";
import { CodeEditor } from "@/components/CodeEditor";
import { CandlestickChart } from "@/components/CandlestickChart";
import { EquityChart } from "@/components/EquityChart";
import { MetricsOverview } from "@/components/MetricsOverview";
import { TradesTable } from "@/components/TradesTable";
import { fetchGlobalIndices, runBacktestApi } from "@/lib/api";
import { BacktestRequest, BacktestResponse, TickerInfo } from "@/lib/types";
import { BarChart3, LineChart, History, Terminal, Calendar, DollarSign, RefreshCw, AlertCircle, Percent, SlidersHorizontal, Clock } from "lucide-react";

export default function Home() {
  const [indices, setIndices] = useState<TickerInfo[]>([]);
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500/20 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 space-y-4">
        {/* Top Control Bar: Global Ticker, Timeframe & Fee Settings */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-sm space-y-4">
          <TickerSelector
            indices={indices}
            selectedTicker={selectedTicker}
            onSelectTicker={(ticker) => {
              setSelectedTicker(ticker);
            }}
          />

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-3 border-t border-zinc-800/60 text-xs">
            {/* Start Date */}
            <div className="flex flex-col space-y-1">
              <label className="text-zinc-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col space-y-1">
              <label className="text-zinc-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" /> End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Timeframe Interval */}
            <div className="flex flex-col space-y-1">
              <label className="text-zinc-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" /> Timeframe
              </label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="1d">1 Day (Daily)</option>
                <option value="1wk">1 Week</option>
                <option value="1mo">1 Month</option>
                <option value="1h">1 Hour (Intraday)</option>
                <option value="15m">15 Minutes</option>
                <option value="5m">5 Minutes</option>
              </select>
            </div>

            {/* Initial Capital */}
            <div className="flex flex-col space-y-1">
              <label className="text-zinc-400 font-medium flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-zinc-500" /> Capital ($)
              </label>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Commission % */}
            <div className="flex flex-col space-y-1">
              <label className="text-zinc-400 font-medium flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-zinc-500" /> Commission (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={commissionPct}
                onChange={(e) => setCommissionPct(Number(e.target.value))}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Slippage % */}
            <div className="flex flex-col space-y-1">
              <label className="text-zinc-400 font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" /> Slippage (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={slippagePct}
                onChange={(e) => setSlippagePct(Number(e.target.value))}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 flex items-center gap-3 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold">Backtest Execution Error</p>
              <p className="text-red-300">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Main Workbench Layout: Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Monaco Python IDE (5 Cols) */}
          <div className="lg:col-span-5 h-[640px]">
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
            <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl min-h-[500px]">
              {/* Tab Navigation Header */}
              <div className="bg-zinc-900/80 p-2 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("candlesticks")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      activeTab === "candlesticks"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Stock Candlestick & Trades
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("equity")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      activeTab === "equity"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <LineChart className="w-3.5 h-3.5" />
                    Equity Curve & Drawdown
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("trades")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      activeTab === "trades"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    Trade Log ({backtestResult?.trades.length || 0})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("logs")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      activeTab === "logs"
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Console Logs
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
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 flex-1 overflow-y-auto space-y-1">
                    {backtestResult.logs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-zinc-600 select-none">[{idx + 1}]</span>
                        <span className={log.includes("ERROR") ? "text-red-400" : log.includes("Complete") ? "text-emerald-400" : "text-zinc-300"}>
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
