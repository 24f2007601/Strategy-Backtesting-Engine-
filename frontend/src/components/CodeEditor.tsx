"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { Code2, Play, Sparkles } from "lucide-react";

interface CodeEditorProps {
  strategyType: "custom_code" | "sma_crossover" | "rsi" | "momentum";
  pythonCode: string;
  onChangeCode: (code: string) => void;
  onSelectStrategy: (type: "custom_code" | "sma_crossover" | "rsi" | "momentum") => void;
  onRunBacktest: () => void;
  isLoading: boolean;
  shortWindow: number;
  longWindow: number;
  onChangeShortWindow: (val: number) => void;
  onChangeLongWindow: (val: number) => void;
  rsiPeriod: number;
  onChangeRsiPeriod: (val: number) => void;
}

const STRATEGY_PRESETS = {
  sma_crossover: `# Dual Moving Average Crossover Strategy
def generate_signals(df):
    short_window = 20
    long_window = 50
    
    sma_short = df['Close'].rolling(window=short_window).mean()
    sma_long = df['Close'].rolling(window=long_window).mean()
    
    signals = pd.Series(0, index=df.index)
    signals[sma_short > sma_long] = 1   # BUY Signal
    signals[sma_short < sma_long] = -1  # SELL Signal
    return signals
`,
  rsi: `# RSI Mean Reversion Strategy
def generate_signals(df):
    period = 14
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    
    rs = gain / (loss + 1e-10)
    rsi = 100 - (100 / (1 + rs))
    
    signals = pd.Series(0, index=df.index)
    signals[rsi < 30] = 1   # Oversold -> BUY
    signals[rsi > 70] = -1  # Overbought -> SELL
    return signals
`,
  momentum: `# Donchian Channel Momentum Breakout
def generate_signals(df):
    lookback = 20
    highest = df['High'].shift(1).rolling(window=lookback).max()
    lowest = df['Low'].shift(1).rolling(window=lookback).min()
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] > highest] = 1   # Breakout -> BUY
    signals[df['Close'] < lowest] = -1   # Breakdown -> SELL
    return signals
`,
  custom_code: `# Custom Python Strategy Template
def generate_signals(df):
    """
    Available columns: df['Open'], df['High'], df['Low'], df['Close'], df['Volume']
    Return: pd.Series containing 1 (BUY), -1 (SELL), or 0 (HOLD)
    """
    # Calculate custom indicators
    returns = df['Close'].pct_change()
    volatility = returns.rolling(window=20).std()
    
    # Define signal rules
    signals = pd.Series(0, index=df.index)
    signals[returns > volatility] = 1
    signals[returns < -volatility] = -1
    return signals
`,
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
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
  const handlePresetChange = (type: "custom_code" | "sma_crossover" | "rsi" | "momentum") => {
    onSelectStrategy(type);
    if (type in STRATEGY_PRESETS) {
      onChangeCode(STRATEGY_PRESETS[type]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      {/* Editor Header & Preset Switcher */}
      <div className="bg-zinc-950 p-3 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-zinc-200">Python Strategy IDE</span>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-[11px]">
          <button
            type="button"
            onClick={() => handlePresetChange("sma_crossover")}
            className={`px-2 py-1 rounded-md transition font-medium ${
              strategyType === "sma_crossover"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            SMA Crossover
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("rsi")}
            className={`px-2 py-1 rounded-md transition font-medium ${
              strategyType === "rsi"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            RSI Reversion
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("momentum")}
            className={`px-2 py-1 rounded-md transition font-medium ${
              strategyType === "momentum"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Momentum
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("custom_code")}
            className={`px-2 py-1 rounded-md transition font-medium flex items-center gap-1 ${
              strategyType === "custom_code"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            Custom Code
          </button>
        </div>
      </div>

      {/* Parameter Controls for Preset Strategies */}
      {strategyType === "sma_crossover" && (
        <div className="bg-zinc-950/60 px-3 py-2 border-b border-zinc-800/80 flex items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 font-medium">Short Window:</span>
            <input
              type="number"
              value={shortWindow}
              onChange={(e) => onChangeShortWindow(Number(e.target.value))}
              className="w-16 bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-zinc-100 font-mono text-xs focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 font-medium">Long Window:</span>
            <input
              type="number"
              value={longWindow}
              onChange={(e) => onChangeLongWindow(Number(e.target.value))}
              className="w-16 bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-zinc-100 font-mono text-xs focus:border-emerald-500"
            />
          </div>
        </div>
      )}

      {strategyType === "rsi" && (
        <div className="bg-zinc-950/60 px-3 py-2 border-b border-zinc-800/80 flex items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 font-medium">RSI Period:</span>
            <input
              type="number"
              value={rsiPeriod}
              onChange={(e) => onChangeRsiPeriod(Number(e.target.value))}
              className="w-16 bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-zinc-100 font-mono text-xs focus:border-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Monaco Code Editor Canvas */}
      <div className="flex-1 min-h-[340px]">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
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
          }}
        />
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
        <p className="text-[11px] text-zinc-500 font-mono">
          API: pandas (pd), numpy (np), df ['Open','High','Low','Close','Volume']
        </p>
        <button
          type="button"
          onClick={onRunBacktest}
          disabled={isLoading}
          className={`px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-lg ${
            isLoading
              ? "bg-emerald-800 text-zinc-400 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20"
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isLoading ? "Executing Backtest..." : "Run Backtest"}
        </button>
      </div>
    </div>
  );
};
