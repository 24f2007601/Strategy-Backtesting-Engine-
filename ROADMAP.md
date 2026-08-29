# QuantStudio — Strategy Backtesting Engine Roadmap

> **Vision**: Transform the Python strategy backtester into an enterprise-grade web application where quantitative traders and developers can write Python strategies, test them against any global market index or stock, and visualize risk-adjusted performance on interactive charts.

---

## 📊 Phase-by-Phase Progress Summary

| Phase | Description | Target | Status | Progress |
|-------|-------------|--------|--------|----------|
| **Phase 1** | **Backend Architecture & Execution Engine** | W1 | ✅ Completed | 100% |
| **Phase 2** | **Next.js Web App, Monaco IDE & TradingView Charts** | W2 | ✅ Completed | 100% |
| **Phase 3** | **Global Indices, Timeframe Controls & Fees** | W3 | ✅ Completed | 100% |
| **Phase 4** | **Strategy Optimization, Parameter Tuning & Export** | W4 | ⏳ Planned | 0% |

---

## 🗺️ Detailed Phase Breakdown

### ✅ Phase 1: Backend Architecture & Execution Engine (COMPLETED)
- [x] **FastAPI Server Setup**: Built REST API endpoints (`GET /api/v1/indices`, `POST /api/v1/backtest`).
- [x] **Global Market Data Provider**: Integrated `yfinance` with in-memory caching for historical OHLCV data.
- [x] **Python Execution Sandbox**: Isolated AST execution context allowing custom `generate_signals(df)` Python functions.
- [x] **Quantitative Metrics Core**: Implemented math for Sharpe Ratio, CAGR, Max Drawdown %, Win Rate %, Profit Factor, and Volatility.
- [x] **Built-in Strategies**: Added pre-packaged SMA Crossover, RSI Mean Reversion, and Momentum Breakout algorithms.

### ✅ Phase 2: Next.js + shadcn/ui Workbench & Financial Charting (COMPLETED)
- [x] **Next.js App Router**: Initialized React + Tailwind CSS + `shadcn/ui` dark-mode workspace layout.
- [x] **Monaco Python IDE**: Integrated VS Code editor core (`@monaco-editor/react`) with syntax highlighting and template presets.
- [x] **TradingView Lightweight Charts v5**: Rendered candlestick price action, volume histograms, and Buy/Sell trade execution markers.
- [x] **Equity Curve & Drawdown Visualizer**: Built Recharts component comparing strategy equity vs Buy & Hold benchmark.
- [x] **Trade Execution History Table**: Formatted trade execution log showing date, price, shares, and portfolio value.

### ✅ Phase 3: Global Asset Exploration, Timeframes & Fees (COMPLETED)
- [x] **Preset Global Index Chips**: Instant backtest execution on S&P 500 (`^GSPC`), NIFTY 50 (`^NSEI`), NASDAQ (`^IXIC`), Nikkei 225 (`^N225`), FTSE 100 (`^FTSE`), DAX (`^GDAXI`), Hang Seng (`^HSI`), and Bitcoin (`BTC-USD`).
- [x] **Custom Asset Search**: Support for typing any global stock symbol (e.g. `AAPL`, `NVDA`, `TSLA`, `RELIANCE.NS`).
- [x] **Multi-Timeframe Controls**: Support for 1D Daily, 1W Weekly, 1M Monthly, 1H Intraday, 15M, and 5M timeframes.
- [x] **Commission & Slippage Customization**: Configurable trade fee % and slippage % with total fees calculation.

### ⏳ Phase 4: Strategy Optimization & Export Tools (PLANNED)
- [ ] **Parameter Optimization Grid**: Auto-tune short/long window combinations to find optimal Sharpe ratios.
- [ ] **CSV / JSON Report Export**: Download trade history log and performance metrics report.
- [ ] **Community Strategy Library**: Save and load custom user strategy scripts.

---

## ⏱️ Timeline & Progress Tracking

```
Task                             | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
---------------------------------|---------|---------|---------|---------|
Backend API & Engine Modularization| ✅ 100% |         |         |         |
Next.js Web App & Monaco IDE     |         | ✅ 100% |         |         |
TradingView Candlestick Markers  |         | ✅ 100% |         |         |
Global Indices & Timeframe Controls|       |         | ✅ 100% |         |
Trade Commission & Slippage Fees |         |         | ✅ 100% |         |
Parameter Grid Optimization      |         |         |         | ⏳ 0%   |
CSV / Report Export              |         |         |         | ⏳ 0%   |
```

---

## ⚠️ Risk Register & Mitigations

| ID | Risk | Likelihood | Impact | Status | Mitigation |
|----|------|------------|--------|--------|------------|
| **R1** | Windows Socket Port 8000 Conflict | High | Med | ✅ Resolved | Switched default backend port to `8001` to bypass Hyper-V port exclusion. |
| **R2** | `lightweight-charts` v5 API breaking changes | Med | Med | ✅ Resolved | Upgraded candlestick and marker implementations to v5 `addSeries(CandlestickSeries)` and `createSeriesMarkers`. |
| **R3** | `yfinance` API rate limiting | Med | High | 🟢 Mitigated | In-memory caching layer stores fetched market data per ticker, date range, and timeframe interval. |

---

*Last Updated: 2026-08-30 (Phase 1 - 3 Completed)*
