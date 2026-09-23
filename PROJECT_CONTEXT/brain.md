# QuantStudio — System Brain & Domain Knowledge

> **Purpose**: Serves as the central repository of system intelligence, mathematical models, trading execution logic, data flow architectures, and design decisions for the QuantStudio Strategy Backtesting Engine.

---

## 💡 Core Domain Concepts & Architecture

### 1. Backtesting Paradigms
QuantStudio supports two execution modes:
- **Built-in Algorithmic Strategies**:
  - **SMA Crossover**: Short-period Simple Moving Average crossing above/below Long-period SMA.
  - **RSI Mean Reversion**: Relative Strength Index with configurable period, overbought threshold (e.g. 70), and oversold threshold (e.g. 30).
  - **Momentum Breakout**: 20-bar High/Low breakout system.
- **Custom Python Strategy Execution**:
  - Executes arbitrary user Python scripts in an isolated `exec()` scope containing `pandas` (`pd`) and `numpy` (`np`).
  - Expects user code to define a function `generate_signals(df)` returning a `pd.Series` (1 for BUY, -1 for SELL, 0 for HOLD) or a global `signals` Series.

---

## 🔄 End-to-End Data & Execution Flow

```
[User Input UI] 
   │ (Ticker, Date Range, Interval, Capital, Fee/Slippage %, Python Strategy Code)
   ▼
[Frontend: Next.js app/page.tsx]
   │ POST /api/v1/backtest
   ▼
[FastAPI Backend: main.py -> run_backtest()]
   │
   ├──► [data_fetcher.py]
   │       └── Fetch OHLCV via yfinance (checks in-memory _data_cache)
   │
   ├──► [Signal Generation]
   │       ├── Built-in strategy math OR
   │       └── Custom Python exec() sandbox (generate_signals(df))
   │
   ├──► [Portfolio Simulation Loop]
   │       ├── Bar-by-bar state iteration
   │       ├── Slippage price adjustment:
   │       │     BUY Price = Raw Close * (1 + Slippage%)
   │       │     SELL Price = Raw Close * (1 - Slippage%)
   │       ├── Commission deduction: Fee = Cash/Value * Commission%
   │       ├── Position & Cash Tracking
   │       └── Trade Record generation (TradeRecord objects)
   │
   ├──► [Benchmark & Metrics Calculation: metrics.py]
   │       ├── Benchmark Buy & Hold Portfolio Value calculation
   │       ├── Cumulative Return %, CAGR %, Sharpe Ratio, Max Drawdown %
   │       ├── Win Rate %, Profit Factor, Volatility %
   │       └── Total Fees Paid computation
   │
   └──► [JSON Serialization: BacktestResponse]
           └── metrics, equity_curve, candlesticks, trades, logs
   │
   ▼
[Frontend Render]
   ├── MetricsOverview (Stat Cards)
   ├── CandlestickChart (TradingView Lightweight Charts v5 + Trade Markers)
   ├── EquityChart (Recharts Strategy vs Benchmark & Drawdown Area)
   ├── TradesTable (Sortable Execution Log)
   └── Console Logs (Execution Diagnostic Terminal)
```

---

## 🧮 Quantitative Finance Mathematical Specifications

### 1. Portfolio Simulation Equations
- **BUY Execution Price**: \( P_{\text{exec}} = P_{\text{close}} \times (1 + \text{slippage\_rate}) \)
- **Net Buy Cash**: \( \text{Cash}_{\text{net}} = \text{Cash} \times (1 - \text{commission\_rate}) \)
- **Shares Purchased**: \( S = \frac{\text{Cash}_{\text{net}}}{P_{\text{exec}}} \)
- **SELL Execution Price**: \( P_{\text{exec}} = P_{\text{close}} \times (1 - \text{slippage\_rate}) \)
- **Gross Proceeds**: \( V_{\text{gross}} = S \times P_{\text{exec}} \)
- **Net Sell Cash**: \( \text{Cash}_{\text{net}} = V_{\text{gross}} \times (1 - \text{commission\_rate}) \)

### 2. Performance Metrics Equations
- **Total Return**: \( R_{\text{total}} = \frac{V_{\text{final}} - V_{\text{initial}}}{V_{\text{initial}}} \times 100\% \)
- **Compound Annual Growth Rate (CAGR)**:
  \( \text{CAGR} = \left( \frac{V_{\text{final}}}{V_{\text{initial}}} \right)^{\frac{365}{N_{\text{days}}}} - 1 \)
- **Sharpe Ratio (Risk-Free Rate = 2%)**:
  \( \text{Sharpe} = \frac{\bar{R}_{\text{daily\_ann}} - 0.02}{\sigma_{\text{daily}} \times \sqrt{252}} \)
- **Max Drawdown %**:
  \( \text{Drawdown}_t = \frac{V_t - \max_{0 \le i \le t}(V_i)}{\max_{0 \le i \le t}(V_i)} \times 100\% \)
- **Win Rate %**:
  \( \text{Win Rate} = \frac{N_{\text{winning\_trades}}}{N_{\text{total\_trades}}} \times 100\% \)
- **Profit Factor**:
  \( \text{Profit Factor} = \frac{\sum \text{Gross Gains}}{\sum |\text{Gross Losses}|} \)

---

## 🛠️ Key Technical Decisions & Gotchas

1. **Backend Service Port (`8001`)**: Windows OS often locks port `8000` for Hyper-V / WSL internal services. The project explicitly uses port `8001` for the FastAPI backend.
2. **TradingView Lightweight Charts v5 Syntax**: Uses `createSeries(CandlestickSeries)` and `createSeriesMarkers` helper functions according to Lightweight Charts v5 API specs.
3. **Data Caching Layer**: In-memory dictionary in `data_fetcher.py` caches data by key `"{ticker}_{start_date}_{end_date}_{interval}"` to ensure fast re-runs and prevent `yfinance` rate limits.
4. **Monaco Editor React**: Uses `@monaco-editor/react` configured with vs-dark theme and Python language support for code editing.
