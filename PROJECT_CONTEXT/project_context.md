# QuantStudio — Comprehensive Project Context & File Map

> **Overview**: QuantStudio is a quantitative trading strategy backtesting suite built with a FastAPI Python backend engine and a Next.js (TypeScript + React + Tailwind CSS) frontend dashboard. It enables traders to select global equities/indices, customize timeframes/fees, write custom Python strategies, and inspect risk-adjusted metrics, trade markers, candlestick price action, and equity curve drawdowns.

---

## 📂 Whole Project Directory Structure

```
Strategy-Backtesting-Engine/
├── PROJECT_CONTEXT/            # Master project context files (read by AI models)
│   ├── roadmap.md              # Project status, completed phases & future roadmap
│   ├── brain.md                # System math, data flow, & design decisions
│   └── project_context.md      # File map, API contracts, & setup documentation
├── AGENTS.md                   # Agent directives & memory instructions
├── Strategy_backtest.ipynb     # Initial prototype Jupyter notebook
├── docker-compose.yml          # Container orchestration for frontend + backend
├── DEPLOYMENT.md               # Production deployment instructions
├── backend/                    # FastAPI Quantitative Engine
│   ├── Dockerfile              # Python backend container specification
│   ├── requirements.txt        # FastAPI, yfinance, pandas, numpy, pydantic
│   └── app/
│       ├── main.py             # FastAPI REST endpoints (/api/v1/indices, /backtest)
│       ├── engine/
│       │   ├── backtester.py   # Strategy simulation, signals, slippage/fees, trades loop
│       │   ├── data_fetcher.py # yfinance data fetching & in-memory caching
│       │   └── metrics.py      # Sharpe, CAGR, Drawdown, Profit Factor math
│       └── schemas/
│           └── backtest.py     # Pydantic schemas (BacktestRequest, BacktestResponse)
└── frontend/                   # Next.js 14 Web Application
    ├── package.json            # React, Next.js, Monaco, Lightweight Charts, Recharts
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx        # Main workbench UI state & tab controller
    │   │   ├── layout.tsx      # App shell root layout
    │   │   └── globals.css     # Dark mode theme & Tailwind imports
    │   ├── components/
    │   │   ├── Navbar.tsx            # Header navigation bar & system status badge
    │   │   ├── TickerSelector.tsx    # Popular index chips & symbol search bar
    │   │   ├── CodeEditor.tsx        # Monaco Python IDE & strategy parameters
    │   │   ├── CandlestickChart.tsx  # TradingView Lightweight Charts v5 + Trade Markers
    │   │   ├── EquityChart.tsx       # Recharts Strategy Equity vs Benchmark & Drawdown Area
    │   │   ├── MetricsOverview.tsx   # Stat cards (Return, CAGR, Sharpe, Drawdown)
    │   │   └── TradesTable.tsx       # Execution history table with signals & fees
    │   └── lib/
    │       ├── api.ts          # API fetch wrappers (fetchGlobalIndices, runBacktestApi)
    │       └── types.ts        # TypeScript interface definitions
```

---

## ⚙️ Backend Component Deep Dive

### 1. `backend/app/main.py`
- **FastAPI application initialization** with CORS middleware configured via `ALLOWED_ORIGINS` environment variable.
- **Endpoints**:
  - `GET /` & `GET /health` & `GET /ready`: Health check probe endpoints.
  - `GET /api/v1/indices`: Returns catalog of popular global market indices, stocks, and crypto.
  - `POST /api/v1/backtest`: Accepts `BacktestRequest`, invokes backtest engine, returns `BacktestResponse`.

### 2. `backend/app/engine/data_fetcher.py`
- Fetches market data using `yfinance.Ticker().history()`.
- Implements in-memory `_data_cache` dictionary to eliminate duplicate network calls.
- Supports interval resolutions: `1d`, `1wk`, `1mo`, `1h`, `15m`, `5m`.
- Standardizes column names and formats datetime strings.

### 3. `backend/app/engine/backtester.py`
- Evaluates signals using built-in algorithms (`sma_crossover`, `rsi`, `momentum`) or custom Python `generate_signals(df)` code via `exec()`.
- Executes iterative bar-by-bar portfolio tracking with configurable commission % and slippage %.
- Constructs `TradeRecord` instances, computes `Portfolio_Value`, `Benchmark_Value`, and `Drawdown_Pct`.
- Returns formatted `candlesticks` and `equity_curve` data points for frontend charts.

### 4. `backend/app/engine/metrics.py`
- Computes quantitative financial stats: Sharpe Ratio, CAGR, Max Drawdown %, Volatility, Win Rate %, Profit Factor, Total Return %, Benchmark Return %, and Total Fees.

---

## 💻 Frontend Component Deep Dive

### 1. `frontend/src/app/page.tsx`
- Central controller managing selected ticker, dates, interval, capital, fee settings, strategy selection, and active tabs (`candlesticks`, `equity`, `trades`, `logs`).
- Runs initial backtest automatically on mount and re-runs when user clicks "Run Strategy".

### 2. `frontend/src/components/CandlestickChart.tsx`
- Renders financial price action using TradingView `lightweight-charts` v5.
- Displays OHLC candlesticks, volume histogram, and overlay markers for BUY (green arrow up) and SELL (red arrow down) execution points.

### 3. `frontend/src/components/EquityChart.tsx`
- Renders dual-axis interactive line chart via `recharts`.
- Green line: Strategy Portfolio Value.
- Blue dashed line: Buy & Hold Benchmark.
- Red shaded gradient area: Portfolio Drawdown %.

### 4. `frontend/src/components/CodeEditor.tsx`
- Integrates `@monaco-editor/react` with Python syntax highlighting.
- Includes strategy selector dropdown (Custom Code, SMA Crossover, RSI, Momentum) and parameter input sliders.

---

## 🔌 API Contracts

### `POST /api/v1/backtest`
**Request Payload**:
```json
{
  "ticker": "^GSPC",
  "start_date": "2022-01-01",
  "end_date": "2024-01-01",
  "interval": "1d",
  "initial_capital": 10000,
  "commission_pct": 0.1,
  "slippage_pct": 0.05,
  "strategy_type": "sma_crossover",
  "python_code": "# Python code...",
  "short_window": 20,
  "long_window": 50,
  "rsi_period": 14,
  "rsi_overbought": 70,
  "rsi_oversold": 30
}
```

**Response Object**:
Contains `metrics`, `equity_curve`, `candlesticks`, `trades`, and execution `logs`.

---

## 🚀 How to Run locally

### Backend:
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
(Access workbench UI at `http://localhost:3000`)
