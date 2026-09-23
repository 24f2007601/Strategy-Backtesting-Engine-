# QuantStudio — Project Roadmap & Progress

> **Vision**: Transform the Python strategy backtester into an enterprise-grade web application where quantitative traders and developers can write custom Python strategies or use built-in algorithms, test them against any global market index or stock, and visualize risk-adjusted performance on interactive financial charts.

---

## 📊 Phase-by-Phase Progress Summary

| Phase | Description | Target | Status | Progress |
|-------|-------------|--------|--------|----------|
| **Phase 1** | **Backend Architecture & Execution Engine** | W1 | ✅ Completed | 100% |
| **Phase 2** | **Next.js Web App, Monaco IDE & Financial Charting** | W2 | ✅ Completed | 100% |
| **Phase 3** | **Global Indices, Multi-Timeframes & Fees** | W3 | ✅ Completed | 100% |
| **Phase 4** | **Strategy Optimization, Parameter Tuning & Export** | W4 | ⏳ Planned | 0% |

---

## 🗺️ Detailed Phase Breakdown

### ✅ Phase 1: Backend Architecture & Execution Engine (COMPLETED)
- **FastAPI Server Core**: Implemented REST API endpoints (`GET /api/v1/indices`, `POST /api/v1/backtest`, `/health`, `/ready`).
- **Market Data Engine**: Integrated `yfinance` with an in-memory caching layer for historical OHLCV data across daily, weekly, monthly, and intraday timeframes.
- **Python Execution Sandbox**: Dynamic Python execution context allowing custom user-defined `generate_signals(df)` functions or `signals` Series in isolated scopes.
- **Quantitative Metrics Core**: Performance math calculating Total Return %, Benchmark Return %, CAGR %, Sharpe Ratio, Max Drawdown %, Win Rate %, Profit Factor, Annualized Volatility %, Total Trades, and Total Fees Paid.
- **Built-in Strategies**: Pre-packaged algorithms including SMA Crossover, RSI Mean Reversion, and Momentum Breakout.

### ✅ Phase 2: Next.js + Tailwind CSS Workbench & Financial Charting (COMPLETED)
- **Glassmorphism Design System & Light Mode Theme**: Engineered a 10-year Senior Design Engineer grade glassmorphism design system supporting both **Dark Mode** (obsidian canvas with glowing neon accents) and **Light Mode** (slate-50 canvas with crisp frosted glass panels and high contrast typography) with instant theme persistence.
- **Header Theme Toggle Button**: Added a glass theme switcher in [`Navbar.tsx`](file:///c:/Users/prith/Projects/Strategy-Backtesting-Engine-/frontend/src/components/Navbar.tsx) featuring `Sun` and `Moon` icons.
- **18 Pre-Built Quantitative Strategy Catalog**: Integrated a glass strategy dropdown selector in [`CodeEditor.tsx`](file:///c:/Users/prith/Projects/Strategy-Backtesting-Engine-/frontend/src/components/CodeEditor.tsx) featuring 18 ready-to-test strategies grouped into 4 categories (*Trend Following*, *Mean Reversion*, *Momentum & Breakout*, *Advanced Quant*).
- **Next.js App Router**: Workbench UI using React, Tailwind CSS, and dark-mode styling.
- **Floating Frosted Navbar**: Glass header with pulsing system telemetry badges and glowing logo mark.
- **Monaco Python IDE**: Embedded VS Code editor core (`@monaco-editor/react`) inside a translucent glass terminal frame with strategy template presets and glowing action buttons.
- **TradingView Lightweight Charts v5**: Financial candlestick price chart rendering OHLC candles, volume histograms, and color-coded Buy/Sell trade execution markers in a glass container.
- **Equity Curve & Drawdown Visualizer**: Recharts dual-axis chart comparing strategy portfolio growth against Buy & Hold benchmark with drawdown area shading and frosted glass tooltips.
- **Trade Execution History Table**: Detailed glass trade log table displaying date, signal type (BUY/SELL), execution price, shares traded, net trade value, and commission fees.

### ✅ Phase 3: Global Asset Exploration, Timeframes & Fees (COMPLETED)
- **Stock Name & Ticker Autocomplete Search**: Implemented a live glass autocomplete popover in [`TickerSelector.tsx`](file:///c:/Users/prith/Projects/Strategy-Backtesting-Engine-/frontend/src/components/TickerSelector.tsx) matching company names (*Apple*, *Tesla*, *Reliance*, *Tata Motors*, *Nifty*, *Microsoft*, *Google*) as well as ticker symbols (`AAPL`, `TSLA`, `RELIANCE.NS`, `NVDA`, `BTC-USD`, `^NSEI`).
- **Preset Global Index Chips**: Instant access to major global indices (S&P 500 `^GSPC`, NASDAQ `^IXIC`, NIFTY 50 `^NSEI`, Nikkei 225 `^N225`, FTSE 100 `^FTSE`, DAX `^GDAXI`, Hang Seng `^HSI`) and Crypto (`BTC-USD`, `ETH-USD`).
- **Custom Asset Search**: Support for any global stock symbol (e.g., `AAPL`, `NVDA`, `TSLA`, `RELIANCE.NS`).
- **Multi-Timeframe Support**: Selectable resolution intervals: `1d` (Daily), `1wk` (Weekly), `1mo` (Monthly), `1h` (1 Hour Intraday), `15m`, and `5m`.
- **Commission & Slippage Modeling**: Customizable transaction fee % and slippage % with net executed price calculations.

### ⏳ Phase 4: Strategy Optimization & Export Tools (PLANNED)
- **Parameter Optimization Grid**: Auto-tuning short/long window combinations to find optimal Sharpe ratios.
- **CSV / JSON Report Export**: Export trade logs and quantitative analytics reports.
- **Strategy Preset Library**: Save and load custom strategy scripts.

---

## ⏱️ Technical Architecture & Key Decision Log

1. **Backend Port Choice (`8001`)**: Default port set to `8001` to prevent Windows Hyper-V port exclusion conflicts on port `8000`.
2. **TradingView Lightweight Charts v5**: Integrated latest Lightweight Charts API (`CandlestickSeries`, `createSeriesMarkers`).
3. **Data Caching**: In-memory caching key (`{ticker}_{start_date}_{end_date}_{interval}`) prevents redundant HTTP requests to `yfinance`.
