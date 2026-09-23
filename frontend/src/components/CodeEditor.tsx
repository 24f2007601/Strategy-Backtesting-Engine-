"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Code2, Play, Sparkles, Sliders, Cpu, BookOpen, ChevronDown } from "lucide-react";

export interface StrategyOption {
  id: string;
  name: string;
  category: "Trend Following" | "Mean Reversion" | "Momentum & Breakout" | "Advanced & Custom";
  description: string;
  code: string;
  presetType?: "sma_crossover" | "rsi" | "momentum" | "custom_code";
}

export const STRATEGY_CATALOG: StrategyOption[] = [
  {
    id: "sma_crossover",
    name: "Dual SMA Crossover (20/50)",
    category: "Trend Following",
    description: "BUY when 20 SMA crosses above 50 SMA; SELL when it crosses below.",
    presetType: "sma_crossover",
    code: `# Dual Moving Average Crossover Strategy
def generate_signals(df):
    short_w = 20
    long_w = 50
    
    sma_short = df['Close'].rolling(window=short_w).mean()
    sma_long = df['Close'].rolling(window=long_w).mean()
    
    signals = pd.Series(0, index=df.index)
    signals[sma_short > sma_long] = 1   # BUY Signal
    signals[sma_short < sma_long] = -1  # SELL Signal
    return signals
`,
  },
  {
    id: "triple_ema",
    name: "Triple EMA Trend Filter (9/21/55)",
    category: "Trend Following",
    description: "BUY when EMA(9) > EMA(21) > EMA(55); SELL when trend reverses.",
    presetType: "custom_code",
    code: `# Triple Exponential Moving Average System
def generate_signals(df):
    ema9 = df['Close'].ewm(span=9, adjust=False).mean()
    ema21 = df['Close'].ewm(span=21, adjust=False).mean()
    ema55 = df['Close'].ewm(span=55, adjust=False).mean()
    
    signals = pd.Series(0, index=df.index)
    signals[(ema9 > ema21) & (ema21 > ema55)] = 1   # Strong Uptrend -> BUY
    signals[(ema9 < ema21) & (ema21 < ema55)] = -1  # Strong Downtrend -> SELL
    return signals
`,
  },
  {
    id: "macd",
    name: "MACD Signal Line Crossover",
    category: "Trend Following",
    description: "BUY when MACD line crosses above Signal line; SELL on cross below.",
    presetType: "custom_code",
    code: `# MACD (12, 26, 9) Crossover Strategy
def generate_signals(df):
    ema12 = df['Close'].ewm(span=12, adjust=False).mean()
    ema26 = df['Close'].ewm(span=26, adjust=False).mean()
    macd_line = ema12 - ema26
    signal_line = macd_line.ewm(span=9, adjust=False).mean()
    
    signals = pd.Series(0, index=df.index)
    signals[macd_line > signal_line] = 1   # Bullish Crossover -> BUY
    signals[macd_line < signal_line] = -1  # Bearish Crossover -> SELL
    return signals
`,
  },
  {
    id: "golden_cross",
    name: "Golden Cross / Death Cross (50/200)",
    category: "Trend Following",
    description: "Classic long-term trend strategy using 50-day and 200-day Simple Moving Averages.",
    presetType: "custom_code",
    code: `# Golden Cross / Death Cross Strategy
def generate_signals(df):
    sma50 = df['Close'].rolling(window=50).mean()
    sma200 = df['Close'].rolling(window=200).mean()
    
    signals = pd.Series(0, index=df.index)
    signals[sma50 > sma200] = 1   # Golden Cross -> BUY
    signals[sma50 < sma200] = -1  # Death Cross -> SELL
    return signals
`,
  },
  {
    id: "hull_ma",
    name: "Hull Moving Average (HMA 20)",
    category: "Trend Following",
    description: "Fast, smooth trend detection minimizing lag via weighted moving average calculations.",
    presetType: "custom_code",
    code: `# Hull Moving Average (HMA 20) Strategy
def generate_signals(df):
    period = 20
    half_p = int(period / 2)
    sqrt_p = int(np.sqrt(period))
    
    wma_half = df['Close'].rolling(window=half_p).apply(lambda x: np.dot(x, np.arange(1, half_p+1)) / np.arange(1, half_p+1).sum(), raw=True)
    wma_full = df['Close'].rolling(window=period).apply(lambda x: np.dot(x, np.arange(1, period+1)) / np.arange(1, period+1).sum(), raw=True)
    
    diff = 2 * wma_half - wma_full
    hma = diff.rolling(window=sqrt_p).apply(lambda x: np.dot(x, np.arange(1, sqrt_p+1)) / np.arange(1, sqrt_p+1).sum(), raw=True)
    
    signals = pd.Series(0, index=df.index)
    signals[hma > hma.shift(1)] = 1   # Rising HMA -> BUY
    signals[hma < hma.shift(1)] = -1  # Falling HMA -> SELL
    return signals
`,
  },
  {
    id: "rsi",
    name: "RSI Mean Reversion (14-period)",
    category: "Mean Reversion",
    description: "BUY when RSI < 30 (Oversold); SELL when RSI > 70 (Overbought).",
    presetType: "rsi",
    code: `# RSI Mean Reversion Strategy
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
  },
  {
    id: "bollinger_bands",
    name: "Bollinger Bands Mean Reversion",
    category: "Mean Reversion",
    description: "BUY when price touches lower 2-sigma band; SELL on upper band touch.",
    presetType: "custom_code",
    code: `# Bollinger Bands Mean Reversion (20-period, 2-std)
def generate_signals(df):
    window = 20
    sma = df['Close'].rolling(window=window).mean()
    std = df['Close'].rolling(window=window).std()
    
    upper_band = sma + (2 * std)
    lower_band = sma - (2 * std)
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] < lower_band] = 1   # Oversold -> BUY
    signals[df['Close'] > upper_band] = -1  # Overbought -> SELL
    return signals
`,
  },
  {
    id: "stochastic",
    name: "Stochastic Oscillator (%K / %D)",
    category: "Mean Reversion",
    description: "BUY when %K crosses %D below 20; SELL when %K crosses %D above 80.",
    presetType: "custom_code",
    code: `# Stochastic Oscillator Strategy (14, 3)
def generate_signals(df):
    period = 14
    low_min = df['Low'].rolling(window=period).min()
    high_max = df['High'].rolling(window=period).max()
    
    k_percent = 100 * ((df['Close'] - low_min) / (high_max - low_min + 1e-10))
    d_percent = k_percent.rolling(window=3).mean()
    
    signals = pd.Series(0, index=df.index)
    signals[(k_percent > d_percent) & (k_percent < 20)] = 1   # Oversold Crossover -> BUY
    signals[(k_percent < d_percent) & (k_percent > 80)] = -1  # Overbought Crossover -> SELL
    return signals
`,
  },
  {
    id: "keltner_channels",
    name: "Keltner Channel Volatility Breakout",
    category: "Mean Reversion",
    description: "Channel breakout using EMA and Average True Range (ATR).",
    presetType: "custom_code",
    code: `# Keltner Channel Strategy (EMA 20, 2x ATR)
def generate_signals(df):
    ema = df['Close'].ewm(span=20, adjust=False).mean()
    tr = np.maximum(df['High'] - df['Low'], np.abs(df['High'] - df['Close'].shift(1)))
    atr = pd.Series(tr, index=df.index).rolling(window=14).mean()
    
    upper_keltner = ema + (2 * atr)
    lower_keltner = ema - (2 * atr)
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] > upper_keltner] = 1   # Bullish Breakout -> BUY
    signals[df['Close'] < lower_keltner] = -1  # Bearish Breakdown -> SELL
    return signals
`,
  },
  {
    id: "zscore",
    name: "Z-Score Statistical Arbitrage",
    category: "Mean Reversion",
    description: "BUY when price Z-Score is < -2.0; SELL when Z-Score > +2.0.",
    presetType: "custom_code",
    code: `# Statistical Z-Score Mean Reversion
def generate_signals(df):
    window = 20
    mean = df['Close'].rolling(window=window).mean()
    std = df['Close'].rolling(window=window).std()
    z_score = (df['Close'] - mean) / (std + 1e-10)
    
    signals = pd.Series(0, index=df.index)
    signals[z_score < -2.0] = 1   # 2 Std Dev below mean -> BUY
    signals[z_score > 2.0] = -1   # 2 Std Dev above mean -> SELL
    return signals
`,
  },
  {
    id: "donchian",
    name: "Donchian 20-Day Channel Breakout",
    category: "Momentum & Breakout",
    description: "Turtle Trading System: BUY 20-day high breakout; SELL 20-day low breakdown.",
    presetType: "momentum",
    code: `# Donchian Channel Breakout (Turtle Trading)
def generate_signals(df):
    lookback = 20
    highest = df['High'].shift(1).rolling(window=lookback).max()
    lowest = df['Low'].shift(1).rolling(window=lookback).min()
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] > highest] = 1   # 20-day High -> BUY
    signals[df['Close'] < lowest] = -1   # 20-day Low -> SELL
    return signals
`,
  },
  {
    id: "roc",
    name: "Rate of Change (ROC) Momentum",
    category: "Momentum & Breakout",
    description: "BUY when 12-day ROC percentage > 2%; SELL when ROC < -2%.",
    presetType: "custom_code",
    code: `# Rate of Change (ROC) Momentum Strategy
def generate_signals(df):
    period = 12
    roc = ((df['Close'] - df['Close'].shift(period)) / df['Close'].shift(period)) * 100.0
    
    signals = pd.Series(0, index=df.index)
    signals[roc > 2.0] = 1    # Strong momentum UP -> BUY
    signals[roc < -2.0] = -1  # Strong momentum DOWN -> SELL
    return signals
`,
  },
  {
    id: "obv_trend",
    name: "On-Balance Volume (OBV) Breakout",
    category: "Momentum & Breakout",
    description: "Volume-flow strategy comparing OBV to its 20-period moving average.",
    presetType: "custom_code",
    code: `# On-Balance Volume (OBV) Trend Strategy
def generate_signals(df):
    obv = (np.sign(df['Close'].diff()) * df['Volume']).fillna(0).cumsum()
    obv_sma = obv.rolling(window=20).mean()
    
    signals = pd.Series(0, index=df.index)
    signals[obv > obv_sma] = 1   # Volume accumulation -> BUY
    signals[obv < obv_sma] = -1  # Volume distribution -> SELL
    return signals
`,
  },
  {
    id: "cci",
    name: "Commodity Channel Index (CCI)",
    category: "Momentum & Breakout",
    description: "BUY when CCI crosses above -100; SELL when CCI crosses below +100.",
    presetType: "custom_code",
    code: `# Commodity Channel Index (CCI 20) Strategy
def generate_signals(df):
    tp = (df['High'] + df['Low'] + df['Close']) / 3.0
    sma = tp.rolling(window=20).mean()
    mad = tp.rolling(window=20).apply(lambda x: np.fabs(x - x.mean()).mean(), raw=True)
    cci = (tp - sma) / (0.015 * mad + 1e-10)
    
    signals = pd.Series(0, index=df.index)
    signals[cci > -100] = 1
    signals[cci > 100] = -1
    return signals
`,
  },
  {
    id: "adx_dmi",
    name: "ADX & DMI Trend Strength",
    category: "Momentum & Breakout",
    description: "BUY when +DI > -DI and ADX > 25 (confirming a strong trend).",
    presetType: "custom_code",
    code: `# ADX / DMI Trend Strength Strategy
def generate_signals(df):
    period = 14
    up_move = df['High'].diff()
    down_move = -df['Low'].diff()
    
    plus_di = pd.Series(np.where((up_move > down_move) & (up_move > 0), up_move, 0), index=df.index).rolling(window=period).mean()
    minus_di = pd.Series(np.where((down_move > up_move) & (down_move > 0), down_move, 0), index=df.index).rolling(window=period).mean()
    
    dx = (100 * np.abs(plus_di - minus_di) / (plus_di + minus_di + 1e-10))
    adx = dx.rolling(window=period).mean()
    
    signals = pd.Series(0, index=df.index)
    signals[(plus_di > minus_di) & (adx > 25)] = 1   # Strong Uptrend -> BUY
    signals[(plus_di < minus_di) & (adx > 25)] = -1  # Strong Downtrend -> SELL
    return signals
`,
  },
  {
    id: "rsi_bollinger_combo",
    name: "RSI + Bollinger Bands Combo",
    category: "Advanced & Custom",
    description: "High-probability mean reversion requiring dual confirmation.",
    presetType: "custom_code",
    code: `# Dual Confirmation: RSI + Bollinger Bands
def generate_signals(df):
    # 1. RSI(14)
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rsi = 100 - (100 / (1 + (gain / (loss + 1e-10))))
    
    # 2. Bollinger Bands
    sma = df['Close'].rolling(window=20).mean()
    std = df['Close'].rolling(window=20).std()
    lower_band = sma - (2 * std)
    upper_band = sma + (2 * std)
    
    signals = pd.Series(0, index=df.index)
    signals[(rsi < 35) & (df['Close'] <= lower_band)] = 1   # Double Confirmation BUY
    signals[(rsi > 65) & (df['Close'] >= upper_band)] = -1  # Double Confirmation SELL
    return signals
`,
  },
  {
    id: "volatility_target",
    name: "Vol-Target Risk Parity Strategy",
    category: "Advanced & Custom",
    description: "Dynamic signal filter based on 20-day annualized rolling volatility.",
    presetType: "custom_code",
    code: `# Volatility Target & Momentum Strategy
def generate_signals(df):
    returns = df['Close'].pct_change()
    ann_vol = returns.rolling(window=20).std() * np.sqrt(252)
    ma50 = df['Close'].rolling(window=50).mean()
    
    signals = pd.Series(0, index=df.index)
    # Only trade long when trend is up AND annual volatility is under 30%
    signals[(df['Close'] > ma50) & (ann_vol < 0.30)] = 1
    signals[(df['Close'] < ma50) | (ann_vol >= 0.30)] = -1
    return signals
`,
  },
  {
    id: "custom_code",
    name: "Custom Strategy Boilerplate",
    category: "Advanced & Custom",
    description: "Empty template for user-defined Python indicator logic.",
    presetType: "custom_code",
    code: `# Custom Python Quantitative Strategy
def generate_signals(df):
    """
    Inputs: df['Open'], df['High'], df['Low'], df['Close'], df['Volume']
    Returns: pd.Series containing 1 (BUY), -1 (SELL), or 0 (HOLD)
    """
    returns = df['Close'].pct_change()
    volatility = returns.rolling(window=20).std()
    
    signals = pd.Series(0, index=df.index)
    signals[returns > volatility] = 1
    signals[returns < -volatility] = -1
    return signals
`,
  },
];

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
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("sma_crossover");

  const handleSelectStrategyDropdown = (strategyId: string) => {
    setSelectedStrategyId(strategyId);
    const item = STRATEGY_CATALOG.find((s) => s.id === strategyId);
    if (item) {
      onSelectStrategy(item.presetType || "custom_code");
      onChangeCode(item.code);
    }
  };

  const currentStrategy = STRATEGY_CATALOG.find((s) => s.id === selectedStrategyId) || STRATEGY_CATALOG[0];

  // Group strategies by category for optgroups
  const categories = Array.from(new Set(STRATEGY_CATALOG.map((s) => s.category)));

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Editor Header & Strategy Selector Dropdown */}
      <div className="bg-zinc-950/80 p-3.5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-zinc-100 tracking-tight block">Python Strategy IDE</span>
            <span className="text-[10px] text-zinc-500 font-mono">Quantitative Algorithm Library</span>
          </div>
        </div>

        {/* 18-Strategy Glass Dropdown Menu */}
        <div className="relative flex items-center gap-2">
          <label className="text-[11px] font-semibold text-zinc-400 hidden md:flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Strategy Preset:
          </label>

          <div className="relative flex-1 sm:w-[260px]">
            <select
              value={selectedStrategyId}
              onChange={(e) => handleSelectStrategyDropdown(e.target.value)}
              className="w-full glass-input rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-emerald-300 focus:outline-none cursor-pointer appearance-none border-emerald-500/30"
            >
              {categories.map((cat) => (
                <optgroup key={cat} label={cat} className="bg-zinc-950 text-zinc-400 font-sans">
                  {STRATEGY_CATALOG.filter((s) => s.category === cat).map((strat) => (
                    <option key={strat.id} value={strat.id} className="bg-zinc-900 text-zinc-100 font-sans py-1">
                      {strat.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Selected Strategy Description Banner */}
      <div className="bg-zinc-950/40 px-4 py-2 border-b border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
            {currentStrategy.category}
          </span>
          <span className="text-zinc-300 font-medium">{currentStrategy.description}</span>
        </div>

        {/* Parameter Sliders for preset algorithms */}
        {strategyType === "sma_crossover" && (
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="text-zinc-500 font-medium">Short:</span>
              <input
                type="number"
                value={shortWindow}
                onChange={(e) => onChangeShortWindow(Number(e.target.value))}
                className="w-14 glass-input rounded-lg px-1.5 py-0.5 text-zinc-100 font-mono text-xs focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-zinc-500 font-medium">Long:</span>
              <input
                type="number"
                value={longWindow}
                onChange={(e) => onChangeLongWindow(Number(e.target.value))}
                className="w-14 glass-input rounded-lg px-1.5 py-0.5 text-zinc-100 font-mono text-xs focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {strategyType === "rsi" && (
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="text-zinc-500 font-medium">Period:</span>
            <input
              type="number"
              value={rsiPeriod}
              onChange={(e) => onChangeRsiPeriod(Number(e.target.value))}
              className="w-14 glass-input rounded-lg px-1.5 py-0.5 text-zinc-100 font-mono text-xs focus:border-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Monaco Code Editor Canvas */}
      <div className="flex-1 min-h-[340px] bg-[#090a0f]/80">
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
            fontFamily: "JetBrains Mono, Fira Code, monospace",
          }}
        />
      </div>

      {/* Glass Action Footer */}
      <div className="p-3.5 bg-zinc-950/80 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Python Engine • OHLCV Ready</span>
        </div>

        <button
          type="button"
          onClick={onRunBacktest}
          disabled={isLoading}
          className={`px-5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-all duration-200 shadow-lg ${
            isLoading
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
              : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isLoading ? "Executing Strategy..." : "Run Backtest"}
        </button>
      </div>
    </div>
  );
};
