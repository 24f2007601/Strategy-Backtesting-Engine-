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
    
    wma_half = df['Close'].rolling(half_p).apply(lambda x: np.dot(x, np.arange(1, half_p+1)) / np.arange(1, half_p+1).sum(), raw=True)
    wma_full = df['Close'].rolling(period).apply(lambda x: np.dot(x, np.arange(1, period+1)) / np.arange(1, period+1).sum(), raw=True)
    diff = 2 * wma_half - wma_full
    hma = diff.rolling(sqrt_p).apply(lambda x: np.dot(x, np.arange(1, sqrt_p+1)) / np.arange(1, sqrt_p+1).sum(), raw=True)
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] > hma] = 1
    signals[df['Close'] < hma] = -1
    return signals
`,
  },
  {
    id: "parabolic_sar",
    name: "Parabolic SAR Trend Acceleration",
    category: "Trend Following",
    description: "Trailing stop and reverse system tracking accelerating market momentum.",
    presetType: "custom_code",
    code: `# Parabolic SAR Proxy Strategy
def generate_signals(df):
    sma20 = df['Close'].rolling(20).mean()
    upper = df['High'].rolling(20).max()
    lower = df['Low'].rolling(20).min()
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] > (upper + sma20) / 2] = 1
    signals[df['Close'] < (lower + sma20) / 2] = -1
    return signals
`,
  },
  {
    id: "supertrend",
    name: "Supertrend Indicator (10, 3.0)",
    category: "Trend Following",
    description: "ATR-based dynamic support and resistance breakout trend follower.",
    presetType: "custom_code",
    code: `# Supertrend (10, 3.0 ATR) Strategy
def generate_signals(df):
    high_low = df['High'] - df['Low']
    high_cp = (df['High'] - df['Close'].shift()).abs()
    low_cp = (df['Low'] - df['Close'].shift()).abs()
    tr = pd.concat([high_low, high_cp, low_cp], axis=1).max(axis=1)
    atr = tr.rolling(10).mean()
    
    hl2 = (df['High'] + df['Low']) / 2
    upperband = hl2 + (3.0 * atr)
    lowerband = hl2 - (3.0 * atr)
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] > upperband.shift(1)] = 1
    signals[df['Close'] < lowerband.shift(1)] = -1
    return signals
`,
  },
  {
    id: "rsi_classic",
    name: "RSI(14) Mean Reversion (30/70)",
    category: "Mean Reversion",
    description: "Classic oversold dip buying (<30) and overbought profit taking (>70).",
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
    name: "Bollinger Bands Mean Reversion (20, 2σ)",
    category: "Mean Reversion",
    description: "BUY on Lower Band touch (oversold); SELL on Upper Band touch (overbought).",
    presetType: "custom_code",
    code: `# Bollinger Bands Mean Reversion (20, 2 StdDev)
def generate_signals(df):
    sma20 = df['Close'].rolling(window=20).mean()
    std20 = df['Close'].rolling(window=20).std()
    upper_band = sma20 + (std20 * 2)
    lower_band = sma20 - (std20 * 2)
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] < lower_band] = 1   # Touch Lower Band -> BUY
    signals[df['Close'] > upper_band] = -1  # Touch Upper Band -> SELL
    return signals
`,
  },
  {
    id: "stochastic_oscillator",
    name: "Stochastic Oscillator (%K 14, %D 3)",
    category: "Mean Reversion",
    description: "BUY when %K crosses above %D in oversold zone (<20); SELL when overbought (>80).",
    presetType: "custom_code",
    code: `# Stochastic Oscillator (14, 3) Strategy
def generate_signals(df):
    low14 = df['Low'].rolling(14).min()
    high14 = df['High'].rolling(14).max()
    k_percent = 100 * ((df['Close'] - low14) / (high14 - low14 + 1e-10))
    d_percent = k_percent.rolling(3).mean()
    
    signals = pd.Series(0, index=df.index)
    signals[(k_percent > d_percent) & (k_percent < 20)] = 1   # Bullish Cross in Oversold
    signals[(k_percent < d_percent) & (k_percent > 80)] = -1  # Bearish Cross in Overbought
    return signals
`,
  },
  {
    id: "keltner_channels",
    name: "Keltner Channel Reversion (20, 2 ATR)",
    category: "Mean Reversion",
    description: "Volatility envelope buying when price dips below lower channel.",
    presetType: "custom_code",
    code: `# Keltner Channel Mean Reversion
def generate_signals(df):
    ema20 = df['Close'].ewm(span=20, adjust=False).mean()
    tr = (df['High'] - df['Low']).rolling(20).mean()
    upper = ema20 + (2 * tr)
    lower = ema20 - (2 * tr)
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] < lower] = 1
    signals[df['Close'] > upper] = -1
    return signals
`,
  },
  {
    id: "williams_r",
    name: "Williams %R Momentum Reversion",
    category: "Mean Reversion",
    description: "BUY when Williams %R enters deep oversold (<-80); SELL when overbought (>-20).",
    presetType: "custom_code",
    code: `# Williams %R Strategy (14)
def generate_signals(df):
    high14 = df['High'].rolling(14).max()
    low14 = df['Low'].rolling(14).min()
    wr = -100 * ((high14 - df['Close']) / (high14 - low14 + 1e-10))
    
    signals = pd.Series(0, index=df.index)
    signals[wr < -80] = 1
    signals[wr > -20] = -1
    return signals
`,
  },
  {
    id: "momentum_breakout",
    name: "20-Bar Momentum Breakout",
    category: "Momentum & Breakout",
    description: "BUY when price breaks above 20-period High; SELL on 20-period Low breakdown.",
    presetType: "momentum",
    code: `# 20-Bar Price Channel Breakout Strategy
def generate_signals(df):
    lookback = 20
    highest_high = df['High'].shift(1).rolling(window=lookback).max()
    lowest_low = df['Low'].shift(1).rolling(window=lookback).min()
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] > highest_high] = 1   # New High Breakout -> BUY
    signals[df['Close'] < lowest_low] = -1   # New Low Breakdown -> SELL
    return signals
`,
  },
  {
    id: "donchian_channels",
    name: "Donchian Channel Breakout (Turtle Trading)",
    category: "Momentum & Breakout",
    description: "Legendary 20-day high entry and 10-day low trailing exit strategy.",
    presetType: "custom_code",
    code: `# Donchian Channel Breakout (Turtle Trading Rule)
def generate_signals(df):
    high20 = df['High'].shift(1).rolling(20).max()
    low10 = df['Low'].shift(1).rolling(10).min()
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] > high20] = 1
    signals[df['Close'] < low10] = -1
    return signals
`,
  },
  {
    id: "rate_of_change",
    name: "Rate of Change (ROC 12)",
    category: "Momentum & Breakout",
    description: "Velocity momentum strategy triggering when price speed accelerates.",
    presetType: "custom_code",
    code: `# Rate of Change (ROC 12) Strategy
def generate_signals(df):
    roc = ((df['Close'] - df['Close'].shift(12)) / df['Close'].shift(12)) * 100
    
    signals = pd.Series(0, index=df.index)
    signals[roc > 2.0] = 1
    signals[roc < -2.0] = -1
    return signals
`,
  },
  {
    id: "atr_breakout",
    name: "ATR Volatility Expansion Breakout",
    category: "Momentum & Breakout",
    description: "BUY when sudden price expansion exceeds 2.5x Average True Range.",
    presetType: "custom_code",
    code: `# ATR Volatility Expansion Breakout
def generate_signals(df):
    tr = (df['High'] - df['Low']).rolling(14).mean()
    sma20 = df['Close'].rolling(20).mean()
    
    signals = pd.Series(0, index=df.index)
    signals[df['Close'] > (sma20 + 2.5 * tr)] = 1
    signals[df['Close'] < (sma20 - 2.5 * tr)] = -1
    return signals
`,
  },
  {
    id: "multi_indicator",
    name: "Multi-Indicator Confluence (RSI + MACD + SMA)",
    category: "Advanced & Custom",
    description: "Institutional confluence model combining trend direction, MACD momentum, and RSI confirmation.",
    presetType: "custom_code",
    code: `# Institutional Multi-Indicator Confluence System
def generate_signals(df):
    sma50 = df['Close'].rolling(50).mean()
    
    # MACD
    ema12 = df['Close'].ewm(span=12).mean()
    ema26 = df['Close'].ewm(span=26).mean()
    macd = ema12 - ema26
    signal = macd.ewm(span=9).mean()
    
    # RSI
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
    rsi = 100 - (100 / (1 + (gain / (loss + 1e-10))))
    
    signals = pd.Series(0, index=df.index)
    # Buy when Above 50 SMA + MACD Bullish + RSI in Sweet Spot (45-65)
    buy_cond = (df['Close'] > sma50) & (macd > signal) & (rsi > 45) & (rsi < 68)
    # Sell when Below 50 SMA OR MACD Bearish Cross
    sell_cond = (df['Close'] < sma50) | (macd < signal)
    
    signals[buy_cond] = 1
    signals[sell_cond] = -1
    return signals
`,
  },
  {
    id: "custom_template",
    name: "Blank Vectorized Python Template",
    category: "Advanced & Custom",
    description: "Build your own custom quantitative algorithm using pandas and numpy.",
    presetType: "custom_code",
    code: `# Custom Quantitative Strategy Template
# Write your custom vectorized logic below:
def generate_signals(df):
    """
    df has columns: ['Open', 'High', 'Low', 'Close', 'Volume', 'Date']
    Return a pandas Series with:
       1  -> BUY / LONG
      -1  -> SELL / EXIT
       0  -> HOLD
    """
    signals = pd.Series(0, index=df.index)
    
    # Example: Buy when today's close > yesterday's close
    signals[df['Close'] > df['Close'].shift(1)] = 1
    signals[df['Close'] < df['Close'].shift(1)] = -1
    
    return signals
`,
  },
];

export const DEFAULT_STRATEGY = STRATEGY_CATALOG[0];
